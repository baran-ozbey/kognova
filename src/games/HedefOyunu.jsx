import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Moving target — click/tap the fast-moving orb before timer runs out
export default function HedefOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.hdfSeviye ?? 1);
  const [skor, setSkor]     = useState(state.hdfSkor ?? 0);

  const [pos, setPos]       = useState({ x: 50, y: 50 });
  const [zaman, setZaman]   = useState(0);
  const [phase, setPhase]   = useState('idle');
  const [mesaj, setMesaj]   = useState('Hareket eden küreye tıkla!');
  const [hit, setHit]       = useState(false);
  const moveRef  = useRef(null);
  const timerRef = useRef(null);
  const hitRef   = useRef(false);

  const SURE = Math.max(4000 - seviye * 150, 1500);
  const BOYUT = Math.max(60 - seviye * 2, 28);

  const temizle = () => {
    clearInterval(moveRef.current);
    clearTimeout(timerRef.current);
  };

  const baslatOyunu = useCallback((sv = seviye) => {
    temizle();
    hitRef.current = false;
    setHit(false);
    setPos({ x: rastgele(5, 80), y: rastgele(5, 80) });
    setZaman(100);
    setMesaj('Tıkla!');
    setPhase('play');

    moveRef.current = setInterval(() => {
      setPos({ x: rastgele(5, 80), y: rastgele(5, 80) });
    }, Math.max(900 - sv * 40, 300));

    let prog = 100;
    const tick = 50;
    const step = (tick / (SURE)) * 100;
    const t = setInterval(() => {
      prog -= step;
      setZaman(Math.max(0, prog));
      if (prog <= 0) {
        clearInterval(t);
        if (!hitRef.current) {
          clearInterval(moveRef.current);
          setMesaj('Süre doldu! Kaçtı! 🌌');
          setPhase('idle');
          hataYap(); oyunGuncelle({ hdfSeviye: sv, hdfSkor: skor });
        }
      }
    }, tick);
    timerRef.current = t;
  }, [seviye, skor, hataYap, oyunGuncelle, SURE]);

  useEffect(() => () => temizle(), []);

  const tiklandi = () => {
    if (phase !== 'play' || hitRef.current) return;
    hitRef.current = true;
    setHit(true);
    temizle();
    const ys = seviye + 1, ySk = skor + 10;
    setSeviye(ys); setSkor(ySk);
    xpEkle(15); oyunGuncelle({ hdfSeviye: ys, hdfSkor: ySk });
    setMesaj('İsabet! 🎯');
    setPhase('idle');
    setTimeout(() => baslatOyunu(ys), 900);
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🎯 Astro Hedef</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Astro Hedef</h2>
          <p>Galaksiler arasında süzülen enerji küresine zamanında tıkla!</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <div style={{ position: 'relative', width: '100%', height: 280, background: '#00000040', borderRadius: 20, overflow: 'hidden', border: '1px solid #ffffff15', marginBottom: 12 }}>
              {/* Timer bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, height: 4, width: `${zaman}%`, background: `hsl(${zaman * 1.2},90%,55%)`, transition: 'width 0.05s linear' }} />
              {/* Stars */}
              {[...Array(20)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', left: `${rastgele(0,95)}%`, top: `${rastgele(0,95)}%`, width: 2, height: 2, borderRadius: '50%', background: '#ffffff60' }} />
              ))}
              {/* Moving orb */}
              <div onClick={tiklandi} style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: BOYUT,
                height: BOYUT,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #f9a8d4, #8b5cf6, #22d3ee)',
                boxShadow: '0 0 25px #8b5cf688, 0 0 50px #22d3ee44',
                cursor: 'crosshair',
                transition: 'left 0.25s ease, top 0.25s ease',
                transform: hit ? 'scale(2)' : 'scale(1)',
                opacity: hit ? 0 : 1,
              }} />
            </div>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton kirmizi-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
