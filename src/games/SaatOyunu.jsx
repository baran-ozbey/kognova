import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Analog clock shown — player picks the correct digital time
function Clock({ saat, dakika }) {
  const r = 60;
  const cx = 70, cy = 70;
  const saatAc = ((saat % 12) + dakika / 60) * 30 * (Math.PI / 180) - Math.PI / 2;
  const dakikaAc = dakika * 6 * (Math.PI / 180) - Math.PI / 2;
  const sx = cx + 35 * Math.cos(saatAc);
  const sy = cy + 35 * Math.sin(saatAc);
  const dx = cx + 50 * Math.cos(dakikaAc);
  const dy = cy + 50 * Math.sin(dakikaAc);

  return (
    <svg width={140} height={140} viewBox="0 0 140 140" style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff08" stroke="#8b5cf6" strokeWidth={3} />
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        return <circle key={i} cx={cx + 52 * Math.cos(a)} cy={cy + 52 * Math.sin(a)} r={2} fill="#ffffff60" />;
      })}
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke="#f9a8d4" strokeWidth={5} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={dx} y2={dy} stroke="#22d3ee" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill="#fff" />
    </svg>
  );
}

export default function SaatOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.saSeviye ?? 1);
  const [skor, setSkor]     = useState(state.saSkor ?? 0);

  const [saat, setSaat]         = useState(3);
  const [dakika, setDakika]     = useState(0);
  const [secenekler, setSec]    = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Saat hangi zamanı gösteriyor?');

  const baslatOyunu = useCallback((sv = seviye) => {
    const s = rastgele(1, 12);
    // As level grows, add non-zero minutes
    const dkOptions = sv < 3 ? [0] : sv < 6 ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const d = dkOptions[rastgele(0, dkOptions.length - 1)];
    const dogru = `${s}:${String(d).padStart(2, '0')}`;

    const yanlis = new Set();
    while (yanlis.size < 3) {
      const ys = rastgele(1, 12);
      const yd = dkOptions[rastgele(0, dkOptions.length - 1)];
      const yStr = `${ys}:${String(yd).padStart(2, '0')}`;
      if (yStr !== dogru) yanlis.add(yStr);
    }

    setSaat(s); setDakika(d);
    setSec([dogru, ...[...yanlis]].sort(() => 0.5 - Math.random()));
    setMesaj('Saatin gösterdiği zamanı seç!');
    setPhase('play');
  }, [seviye]);

  const sec = (val) => {
    if (phase !== 'play') return;
    const dogru = `${saat}:${String(dakika).padStart(2, '0')}`;
    if (val === dogru) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ saSeviye: ys, saSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj(`Yanlış! Doğru zaman: ${dogru}`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ saSeviye: seviye, saSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🕰️ Zaman Okuması</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Zaman Okuması</h2>
          <p>Kozmik saatin gösterdiği zamanı hızlıca oku.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ marginBottom: 24 }}><Clock saat={saat} dakika={dakika} /></div>
              <div className="oyun-secenekleri">
                {secenekler.map((s, i) => (
                  <button key={i} className="secenek" onClick={() => sec(s)} style={{ fontSize: 20, fontWeight: 700 }}>{s}</button>
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
