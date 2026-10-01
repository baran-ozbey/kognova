import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Numbers fall from top; tap only even numbers (or odd — rule switches per level)
export default function DusenSayilar({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.dsSeviye ?? 1);
  const [skor, setSkor]     = useState(state.dsSkor ?? 0);

  const [parcaciklar, setPar] = useState([]);
  const [kural, setKural]     = useState('cift'); // 'cift' | 'tek'
  const [phase, setPhase]     = useState('idle');
  const [mesaj, setMesaj]     = useState('');
  const [canlar, setCanlar]   = useState(3);
  const spawnRef = useRef(null);
  const fallRef  = useRef(null);
  const canRef   = useRef(3);
  const phaseRef = useRef('idle');

  const temizle = () => { clearInterval(spawnRef.current); clearInterval(fallRef.current); };

  const baslatOyunu = useCallback((sv = seviye) => {
    temizle();
    const yeniKural = Math.random() > 0.5 ? 'cift' : 'tek';
    canRef.current = 3;
    phaseRef.current = 'play';
    setKural(yeniKural);
    setCanlar(3);
    setPar([]);
    setPhase('play');
    setMesaj(`Sadece ${yeniKural === 'cift' ? 'ÇİFT' : 'TEK'} sayılara dokun!`);

    let idCounter = 0;
    const speed = Math.max(2 + sv * 0.5, 2); // Faster fall speed

    spawnRef.current = setInterval(() => {
      if (phaseRef.current !== 'play') return;
      const sayi = rastgele(1, 19);
      setPar(prev => [...prev, { id: idCounter++, sayi, x: rastgele(5, 80), y: 0, opacity: 1 }]);
    }, Math.max(1200 - sv * 80, 500)); // Spawn slightly faster too

    fallRef.current = setInterval(() => {
      if (phaseRef.current !== 'play') return;
      setPar(prev => {
        const updated = prev.map(p => ({ ...p, y: p.y + speed }));
        const missed = updated.filter(p => p.y > 95);
        if (missed.length > 0) {
          // check if missed ones should have been tapped
          const bad = missed.filter(p => yeniKural === 'cift' ? p.sayi % 2 === 0 : p.sayi % 2 !== 0);
          if (bad.length > 0) {
            canRef.current -= bad.length;
            setCanlar(canRef.current);
            if (canRef.current <= 0) {
              phaseRef.current = 'idle';
              setPhase('idle');
              setMesaj('Canların bitti! Bir sonraki sefere 💫');
              temizle();
            }
          }
        }
        return updated.filter(p => p.y <= 95);
      });
    }, 40); // 40ms interval for much smoother and faster falling
  }, [seviye]);

  useEffect(() => () => temizle(), []);

  const tap = (id, sayi) => {
    if (phase !== 'play') return;
    const dogru = kural === 'cift' ? sayi % 2 === 0 : sayi % 2 !== 0;
    setPar(prev => prev.filter(p => p.id !== id));
    if (dogru) {
      const ySk = skor + 5;
      setSkor(ySk);
      xpEkle(5);
      // Every 10 correct bumps level
      oyunGuncelle({ dsSeviye: seviye, dsSkor: ySk });
    } else {
      canRef.current -= 1;
      setCanlar(canRef.current);
      hataYap();
      if (canRef.current <= 0) {
        phaseRef.current = 'idle';
        setPhase('idle');
        setMesaj('Yanlış sayıya dokundun! Oyun bitti.');
        temizle();
      }
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🌠 Düşen Sayılar</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Düşen Sayılar</h2>
          <p>Kurala uygun sayılara dokunurken yanlış olanlara <em>dokunma!</em></p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
          <span>{'❤️'.repeat(Math.max(0, canlar))}</span>
        </div>
        <div className="oyun-alani" style={{ padding: 0 }}>
          {phase === 'play' && (
            <div style={{ position: 'relative', width: '100%', height: 300, background: '#00000040', borderRadius: 16, overflow: 'hidden', border: '1px solid #ffffff15', marginBottom: 8 }}>
              <div style={{ position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: '#f9a8d4', fontWeight: 700, zIndex: 10 }}>
                {kural === 'cift' ? '⚡ Sadece ÇİFT sayılara dokun' : '⚡ Sadece TEK sayılara dokun'}
              </div>
              {parcaciklar.map(p => (
                <div key={p.id} onClick={() => tap(p.id, p.sayi)} style={{
                  position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                  width: 44, height: 44, borderRadius: '50%',
                  background: p.sayi % 2 === 0 ? 'linear-gradient(135deg,#22d3ee,#2563eb)' : 'linear-gradient(135deg,#ec4899,#a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 900, cursor: 'pointer',
                  boxShadow: '0 0 12px rgba(0,0,0,0.4)',
                  userSelect: 'none',
                }}>{p.sayi}</div>
              ))}
            </div>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton mavi-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
