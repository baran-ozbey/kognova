import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Binary → Decimal quick recognition
const toBinary = (n) => n.toString(2).padStart(6, '0');

export default function BinaryOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.bnSeviye ?? 1);
  const [skor, setSkor]     = useState(state.bnSkor ?? 0);

  const [hedef, setHedef]       = useState(0);
  const [secenekler, setSecenekler] = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Galaktik kodu çöz!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const max = Math.min(8 + sv * 4, 63);
    const sayi = rastgele(2, max);
    const yanlis = new Set();
    while (yanlis.size < 3) {
      const r = rastgele(0, max);
      if (r !== sayi) yanlis.add(r);
    }
    setHedef(sayi);
    setSecenekler([sayi, ...[...yanlis]].sort(() => 0.5 - Math.random()));
    setMesaj('Galaktik kodu ondalığa çevir!');
    setPhase('play');
  }, [seviye]);

  const sec = (val) => {
    if (phase !== 'play') return;
    if (val === hedef) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ bnSeviye: ys, bnSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj(`Yanlış! ${toBinary(hedef)} = ${hedef} dir.`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ bnSeviye: seviye, bnSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>💻 Galaktik Kod</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Galaktik Kod</h2>
          <p>İkili (binary) sayıyı ondalık karşılığıyla eşleştir.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{
                fontFamily: 'monospace', fontSize: 38, fontWeight: 900,
                letterSpacing: 8, color: '#22d3ee', marginBottom: 30,
                background: '#00000040', padding: '18px 28px', borderRadius: 16,
              }}>
                {toBinary(hedef).split('').map((b, i) => (
                  <span key={i} style={{ color: b === '1' ? '#8b5cf6' : '#ffffff30' }}>{b}</span>
                ))}
              </div>
              <div className="cevaplar">
                {secenekler.map((s, i) => (
                  <button key={i} className="cevap" onClick={() => sec(s)} style={{ fontSize: 22 }}>{s}</button>
                ))}
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton mavi-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
