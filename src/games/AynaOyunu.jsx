import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// 5x5 grid; left half shown, player fills right half (mirrored)
const COLS = 5;
const ROWS = 5;
const LEFT_HALF = [0, 1, 2]; // columns shown (axis = col 2, center)

export default function AynaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.aySeviye ?? 1);
  const [skor, setSkor]     = useState(state.aySkor ?? 0);

  const [kaynak, setKaynak]   = useState([]); // full 5x5 bool grid (sol yarı dolu)
  const [cevap, setCevap]     = useState([]); // player's right side
  const [phase, setPhase]     = useState('idle');
  const [mesaj, setMesaj]     = useState('Sol yarının aynasını oluştur!');

  const baslatOyunu = useCallback((sv = seviye) => {
    // Generate random left 3 cols + center (2 cols), total left including center
    const kaynakGrid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, (_, c) => c <= 2 ? Math.random() < 0.55 : false)
    );
    setKaynak(kaynakGrid);
    setCevap(Array.from({ length: ROWS }, () => [false, false, false, false, false]));
    setMesaj('Sağ yarıyı aynalayacak şekilde tıkla!');
    setPhase('play');
  }, [seviye]);

  const toggle = (r, c) => {
    if (phase !== 'play' || c < 3) return; // only right side (cols 3,4)
    setCevap(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = !next[r][c];
      return next;
    });
  };

  const kontrol = () => {
    let dogru = true;
    for (let r = 0; r < ROWS; r++) {
      // right cols (3,4) should mirror left cols (1,0)
      if (cevap[r][3] !== kaynak[r][1]) dogru = false;
      if (cevap[r][4] !== kaynak[r][0]) dogru = false;
    }
    if (dogru) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ aySeviye: ys, aySkor: ySk });
      setMesaj('Mükemmel! Boyutlar hizalandı ✨');
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1200);
    } else {
      setMesaj('Boyutlar çakışmıyor! Tekrar dene.');
      setPhase('idle');
      hataYap(); oyunGuncelle({ aySeviye: seviye, aySkor: skor });
    }
  };

  const getCellStyle = (r, c, isPlayer) => {
    const isLit = isPlayer ? cevap[r][c] : kaynak[r][c];
    const isAxis = c === 2;
    return {
      width: 48, height: 48, borderRadius: 10,
      cursor: isPlayer && !isAxis ? 'pointer' : 'default',
      background: isAxis ? '#ffffff08' : isLit
        ? 'linear-gradient(135deg,#22d3ee,#8b5cf6)'
        : '#ffffff0d',
      border: isAxis ? '1px dashed #ffffff25' : '1px solid #ffffff15',
      boxShadow: isLit && !isAxis ? '0 0 12px #22d3ee88' : 'none',
      transition: 'all 0.15s',
    };
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🪞 Ayna Boyutu</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Ayna Boyutu</h2>
          <p>Sol yarının birebir yansımasını sağ tarafa oluştur. Orta sütun simetrinin ekseni.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS},48px)`, gap: 6, marginBottom: 20 }}>
                {Array.from({ length: ROWS }, (_, r) =>
                  Array.from({ length: COLS }, (_, c) => (
                    <div key={`${r}-${c}`}
                      style={getCellStyle(r, c, c >= 3)}
                      onClick={() => toggle(r, c)}
                    />
                  ))
                )}
              </div>
              <button className="buton mavi-btn" onClick={kontrol} style={{ marginTop: 8 }}>Kontrol Et</button>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
