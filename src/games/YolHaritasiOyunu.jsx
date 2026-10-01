import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Show a path on a mini-map, then hide it — player redraws it from memory
const GRID = 5;
const ADIMLAR = 5;

function generatePath(length) {
  const path = [{ r: rastgele(0, GRID - 1), c: rastgele(0, GRID - 1) }];
  const dirs = [{ r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }];
  let tries = 0;
  while (path.length < length && tries < 200) {
    tries++;
    const last = path[path.length - 1];
    const d = dirs[rastgele(0, 3)];
    const nr = last.r + d.r, nc = last.c + d.c;
    if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) continue;
    if (path.some(p => p.r === nr && p.c === nc)) continue;
    path.push({ r: nr, c: nc });
  }
  return path;
}

export default function YolHaritasiOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.yhSeviye ?? 1);
  const [skor, setSkor]     = useState(state.yhSkor ?? 0);

  const [hedefYol, setHedef]    = useState([]);
  const [cizilen, setCizilen]   = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Yolu ezberle, sonra çiz!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const uzunluk = Math.min(3 + sv, ADIMLAR + 4);
    const yol = generatePath(uzunluk);
    setHedef(yol);
    setCizilen([]);
    setPhase('gosteriyor');
    setMesaj('Işıklı yolu ezberle...');
    const sure = Math.max(2500 - sv * 100, 1000);
    setTimeout(() => {
      setPhase('cizme');
      setMesaj(`Başlangıç noktasından yolu çiz! (${uzunluk} adım)`);
    }, sure);
  }, [seviye]);

  const toggleHucre = (r, c) => {
    if (phase !== 'cizme') return;
    const anahtar = `${r}-${c}`;
    setCizilen(prev => {
      const idx = prev.findIndex(p => p.r === r && p.c === c);
      if (idx !== -1) return prev.slice(0, idx); // backtrack
      if (prev.length === 0) {
        if (r !== hedefYol[0].r || c !== hedefYol[0].c) return prev;
        return [{ r, c }];
      }
      const last = prev[prev.length - 1];
      const adjR = Math.abs(last.r - r) + Math.abs(last.c - c) === 1;
      if (!adjR) return prev;
      return [...prev, { r, c }];
    });
  };

  const kontrol = () => {
    if (cizilen.length !== hedefYol.length) { setMesaj('Yol uzunluğu yanlış!'); return; }
    const dogru = cizilen.every((p, i) => p.r === hedefYol[i].r && p.c === hedefYol[i].c);
    if (dogru) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(20); oyunGuncelle({ yhSeviye: ys, yhSkor: ySk });
      setMesaj('Mükemmel yol hafızası! 🗺️');
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1000);
    } else {
      setMesaj('Yol eşleşmedi! Galaksi haritası hatalı.');
      setPhase('idle');
      hataYap(); oyunGuncelle({ yhSeviye: seviye, yhSkor: skor });
    }
  };

  const isHedef = (r, c) => phase === 'gosteriyor' && hedefYol.some(p => p.r === r && p.c === c);
  const isCizilen = (r, c) => cizilen.some(p => p.r === r && p.c === c);
  const isBaslangic = hedefYol[0];

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🗺️ Galaksi Yolu</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Galaksi Yolu</h2>
          <p>Işıklı yolu ezberle, söndükten sonra aynı yolu çiz.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID},52px)`, gap: 6, marginBottom: 16 }}>
            {Array.from({ length: GRID }, (_, r) =>
              Array.from({ length: GRID }, (_, c) => {
                const lit = isHedef(r, c);
                const drawn = isCizilen(r, c);
                const isStart = isBaslangic && isBaslangic.r === r && isBaslangic.c === c;
                return (
                  <div key={`${r}-${c}`} onClick={() => toggleHucre(r, c)} style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: lit ? 'linear-gradient(135deg,#f59e0b,#ef4444)'
                      : drawn ? 'linear-gradient(135deg,#22d3ee,#8b5cf6)'
                      : isStart && phase === 'cizme' ? '#ffffff15'
                      : '#ffffff09',
                    border: isStart && phase === 'cizme' ? '2px solid #22d3ee' : '1px solid #ffffff15',
                    boxShadow: lit ? '0 0 15px #f59e0b' : drawn ? '0 0 12px #22d3ee66' : 'none',
                    cursor: phase === 'cizme' ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                  }}>
                    {isStart && phase === 'cizme' && !drawn ? '🚀' : ''}
                  </div>
                );
              })
            )}
          </div>
          {phase === 'cizme' && <button className="buton yesil-btn" onClick={kontrol}>Onayla</button>}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
