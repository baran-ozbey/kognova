import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Mental rotation: show a shape made of colored blocks, then show 4 rotated versions — pick the one that matches
const SHAPES = [
  [[1,0],[1,1],[1,0]],   // T
  [[1,1],[0,1],[0,1]],   // L-flip
  [[1,0],[1,0],[1,1]],   // L
  [[0,1],[1,1],[1,0]],   // S
  [[1,0],[1,1],[0,1]],   // Z
  [[1,1],[1,1],[0,0]],   // corner
];

function rotateMatrix(mat) {
  const R = mat.length, C = mat[0].length;
  return Array.from({ length: C }, (_, j) =>
    Array.from({ length: R }, (_, i) => mat[R - 1 - i][j])
  );
}

function ShapeGrid({ mat, color = '#8b5cf6', size = 22 }) {
  return (
    <div style={{ display: 'inline-grid', gridTemplateRows: `repeat(${mat.length},${size}px)`, gridTemplateColumns: `repeat(${mat[0].length},${size}px)`, gap: 3 }}>
      {mat.flatMap((row, r) => row.map((c, ci) => (
        <div key={`${r}-${ci}`} style={{ width: size, height: size, borderRadius: 5, background: c ? color : 'transparent', boxShadow: c ? `0 0 8px ${color}88` : 'none' }} />
      )))}
    </div>
  );
}

export default function RotasyonOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.rotSeviye ?? 1);
  const [skor, setSkor]     = useState(state.rotSkor ?? 0);

  const [hedef, setHedef]       = useState(null);
  const [secenekler, setSec]    = useState([]);
  const [dogruIdx, setDogru]    = useState(0);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Hangi rotasyon aynı şekil?');

  const baslatOyunu = useCallback((sv = seviye) => {
    const shape = SHAPES[rastgele(0, SHAPES.length - 1)];
    const rotCount = rastgele(1, 3);
    let rotated = shape;
    for (let i = 0; i < rotCount; i++) rotated = rotateMatrix(rotated);

    const dogru = rotated;
    const dogIdx = rastgele(0, 3);
    const opts = Array.from({ length: 4 }, (_, i) => {
      if (i === dogIdx) return dogru;
      let wrong = SHAPES[rastgele(0, SHAPES.length - 1)];
      const r = rastgele(0, 3);
      for (let k = 0; k < r; k++) wrong = rotateMatrix(wrong);
      return wrong;
    });

    setHedef(shape);
    setSec(opts);
    setDogru(dogIdx);
    setMesaj('Hangi seçenek orijinal şeklin rotasyonu?');
    setPhase('play');
  }, [seviye]);

  const sec = (idx) => {
    if (phase !== 'play') return;
    if (idx === dogruIdx) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ rotSeviye: ys, rotSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj('Yanlış! Uzamsal algı hata yaptı.');
      setPhase('idle');
      hataYap(); oyunGuncelle({ rotSeviye: seviye, rotSkor: skor });
    }
  };

  const COLORS = ['#22d3ee', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🔄 Uzamsal Rotasyon</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Uzamsal Rotasyon</h2>
          <p>Verilen şeklin döndürülmüş halini seçenekler arasından bul.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && hedef && (
            <>
              <div style={{ marginBottom: 24, padding: 16, background: '#ffffff08', borderRadius: 16, border: '1px solid #ffffff18' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10, letterSpacing: 1 }}>ORİJİNAL ŞEKİL</div>
                <ShapeGrid mat={hedef} color="#8b5cf6" size={26} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                {secenekler.map((opt, i) => (
                  <button key={i} onClick={() => sec(i)} style={{
                    background: '#ffffff08', border: '1px solid #ffffff18', borderRadius: 16,
                    padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffffff15'}
                    onMouseLeave={e => e.currentTarget.style.background = '#ffffff08'}
                  >
                    <ShapeGrid mat={opt} color={COLORS[i]} size={22} />
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
