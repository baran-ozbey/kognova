import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Color sorting: a row of colored circles shown in wrong order — drag/tap to sort lightest→darkest
const RENKLER_PALETTES = [
  ['#1e3a5f','#2563eb','#60a5fa','#bfdbfe'],
  ['#4a1942','#a855f7','#c084fc','#e9d5ff'],
  ['#7f1d1d','#ef4444','#fca5a5','#fee2e2'],
  ['#064e3b','#10b981','#6ee7b7','#d1fae5'],
  ['#78350f','#f59e0b','#fcd34d','#fef3c7'],
];

export default function RenkSiralamaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.rksSeviye ?? 1);
  const [skor, setSkor]     = useState(state.rksSkor ?? 0);

  const [hedef, setHedef]   = useState([]);
  const [siradaki, setSira] = useState([]);
  const [phase, setPhase]   = useState('idle');
  const [mesaj, setMesaj]   = useState('Renkleri koyudan açığa sırala!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const palette = RENKLER_PALETTES[rastgele(0, RENKLER_PALETTES.length - 1)];
    const adet = Math.min(2 + Math.floor(sv / 2), 4);
    const slice = palette.slice(0, adet); // darkest→lightest
    const karisik = [...slice].sort(() => 0.5 - Math.random());
    setHedef(slice);
    setSira(karisik);
    setMesaj('Renkleri soldan en koyudan en açığa doğru sırala (sola tıkla = sola taşı).');
    setPhase('play');
  }, [seviye]);

  const sola = (i) => {
    if (i === 0 || phase !== 'play') return;
    setSira(prev => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const saga = (i) => {
    if (i === siradaki.length - 1 || phase !== 'play') return;
    setSira(prev => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const kontrol = () => {
    const dogru = siradaki.every((c, i) => c === hedef[i]);
    if (dogru) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ rksSeviye: ys, rksSkor: ySk });
      setMesaj('Spektrum mükemmel! 🌈');
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1000);
    } else {
      setMesaj('Yanlış sıra! Renk frekansları çakışmadı.');
      setPhase('idle');
      hataYap(); oyunGuncelle({ rksSeviye: seviye, rksSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🌈 Spektrum Sıralaması</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Spektrum Sıralaması</h2>
          <p>Renk tonlarını soldan en koyudan açığa doğru sırala.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
                {siradaki.map((renk, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 58, height: 58, borderRadius: 14, background: renk, boxShadow: `0 0 18px ${renk}88`, border: '2px solid #ffffff20' }} />
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => sola(i)} style={{ background: '#ffffff15', border: 'none', color: 'white', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>◀</button>
                      <button onClick={() => saga(i)} style={{ background: '#ffffff15', border: 'none', color: 'white', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>▶</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="buton yesil-btn" onClick={kontrol}>Kontrol Et</button>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
