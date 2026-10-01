import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Player must tap in rhythm — we show a beat pattern visually and they tap it back
const BEATS = ['⬛', '🟣'];

export default function TempoOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.tmpSeviye ?? 1);
  const [skor, setSkor]     = useState(state.tmpSkor ?? 0);

  const [dizi, setDizi]           = useState([]); // 1=beat, 0=silence
  const [showIdx, setShowIdx]     = useState(-1);   // currently lit beat index
  const [phase, setPhase]         = useState('idle');
  const [kullanici, setKullanici] = useState([]);
  const [mesaj, setMesaj]         = useState('Ritim desenini ezberle, ardından tekrarla!');
  const intervalRef = useRef(null);

  const baslatOyunu = useCallback((sv = seviye) => {
    const uzunluk = Math.min(4 + sv, 10);
    const yeniDizi = Array.from({ length: uzunluk }, () => Math.random() > 0.4 ? 1 : 0);
    setDizi(yeniDizi);
    setKullanici([]);
    setPhase('gosteriyor');
    setMesaj('Dikkatle izle...');

    let i = 0;
    intervalRef.current = setInterval(() => {
      setShowIdx(i);
      i++;
      if (i >= yeniDizi.length) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setShowIdx(-1);
          setPhase('bekliyor');
          setMesaj('Şimdi senin sıran! Ritmi tekrarla 👇');
        }, 500);
      }
    }, 600);
  }, [seviye]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const tapBeat = (val) => {
    if (phase !== 'bekliyor') return;
    const idx = kullanici.length;
    const yeni = [...kullanici, val];
    setKullanici(yeni);

    if (val !== dizi[idx]) {
      setMesaj('Yanlış! Ritim kırıldı.');
      setPhase('idle');
      hataYap(); oyunGuncelle({ tmpSeviye: seviye, tmpSkor: skor });
      return;
    }
    if (yeni.length === dizi.length) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ tmpSeviye: ys, tmpSkor: ySk });
      setMesaj('Mükemmel ritim! 🎵');
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1000);
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🎵 Ritim Frekansı</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Ritim Frekansı</h2>
          <p>Evrenin titreşim desenini ezberle ve birebir tekrarla.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {/* Gösterim */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {dizi.map((b, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: 8,
                background: i === showIdx ? '#8b5cf6' : b === 1 ? '#ffffff18' : '#ffffff06',
                border: '1px solid #ffffff20',
                boxShadow: i === showIdx ? '0 0 20px #8b5cf6' : 'none',
                transition: 'all 0.1s',
              }} />
            ))}
          </div>

          {/* Input sırası */}
          {kullanici.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {kullanici.map((b, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: b === 1 ? '#22d3ee44' : '#ffffff08',
                  border: `1px solid ${b === 1 ? '#22d3ee' : '#ffffff20'}`,
                }} />
              ))}
            </div>
          )}

          {phase === 'bekliyor' && (
            <div style={{ display: 'flex', gap: 16 }}>
              <button className="buton" style={{ width: 120, background: '#8b5cf6' }} onClick={() => tapBeat(1)}>VURUŞ 🟣</button>
              <button className="buton" style={{ width: 120, background: '#1e293b' }} onClick={() => tapBeat(0)}>SESSIZ ⬛</button>
            </div>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
