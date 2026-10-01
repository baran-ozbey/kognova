import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Angle estimation game: show an angle, user picks the closest degree
export default function AciOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.izSeviye ?? 1); // Reuse iz state keys
  const [skor, setSkor]     = useState(state.izSkor ?? 0);

  const [hedefAci, setHedefAci] = useState(90);
  const [secenekler, setSec]    = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Gösterilen açıyı tahmin et!');

  const baslatOyunu = useCallback((sv = seviye) => {
    // Generate an angle multiple of 15
    const aci = rastgele(2, 23) * 15; // 30 to 345 degrees
    
    // Generate options
    const yanlislar = new Set();
    while(yanlislar.size < 3) {
      const y = aci + rastgele(-3, 3) * 15;
      if (y > 0 && y <= 360 && y !== aci) yanlislar.add(y);
    }
    
    setHedefAci(aci);
    setSec([aci, ...[...yanlislar]].sort(() => 0.5 - Math.random()));
    setPhase('play');
    setMesaj('Ortadaki açı kaç derecedir?');
  }, [seviye]);

  const sec = (secilen) => {
    if (phase !== 'play') return;
    if (secilen === hedefAci) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ izSeviye: ys, izSkor: ySk });
      setMesaj('Tam isabet! 📐');
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1200);
    } else {
      setMesaj(`Yanlış! Doğru açı ${hedefAci}° olmalıydı.`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ izSeviye: seviye, izSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>📐 Kozmik Açı</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Kozmik Açı</h2>
          <p>Yıldızlar arasındaki açıklığın kaç derece olduğunu tahmin et.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 30, background: '#ffffff0a', borderRadius: '50%', border: '2px solid #ffffff1a' }}>
                {/* Merkez Noktasi */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', transform: 'translate(-50%, -50%)', zIndex: 5 }} />
                
                {/* Sabit Çizgi (0 derece - sağa doğru) */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 90, height: 4, background: '#22d3ee', transformOrigin: '0% 50%', borderRadius: 2 }} />
                
                {/* Hareketli Çizgi (Açı) */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 90, height: 4, background: '#ec4899', transformOrigin: '0% 50%', transform: `rotate(-${hedefAci}deg)`, borderRadius: 2 }} />
                
                {/* Açı Yayı Göstergesi */}
                <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}>
                  <path d={`M 100 100 L 140 100 A 40 40 0 ${hedefAci > 180 ? 1 : 0} 0 ${100 + 40 * Math.cos(-hedefAci * Math.PI / 180)} ${100 + 40 * Math.sin(-hedefAci * Math.PI / 180)} Z`} fill="#ffffff22" />
                </svg>
              </div>

              <div className="oyun-secenekleri">
                {secenekler.map((a, i) => (
                  <button key={i} className="secenek" onClick={() => sec(a)} style={{ fontSize: 24, fontWeight: 700 }}>
                    {a}°
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton sari-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
