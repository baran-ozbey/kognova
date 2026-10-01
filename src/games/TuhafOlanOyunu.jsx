import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Odd-one-out by logic category
const SORULAR = [
  { items: ['🐶','🐱','🐟','🐭'], cevap: '🐟', neden: 'Diğerleri kara hayvanı, balık deniz canlısı.' },
  { items: ['🍎','🍌','🥕','🍇'], cevap: '🥕', neden: 'Diğerleri meyve, havuç sebze.' },
  { items: ['🚗','🚌','✈️','🚲'], cevap: '✈️', neden: 'Diğerleri kara taşıtı.' },
  { items: ['🎸','🎹','🥁','📱'], cevap: '📱', neden: 'Diğerleri müzik aleti.' },
  { items: ['⬛','🔵','🟦','🟪'], cevap: '⬛', neden: 'Diğerleri mavi/mor ton, siyah farklı.' },
  { items: ['5','3','7','6'], cevap: '6', neden: 'Diğerleri tek sayı.' },
  { items: ['🌙','⭐','☀️','🌊'], cevap: '🌊', neden: 'Diğerleri gökyüzü nesnesi.' },
  { items: ['🇹🇷','🇩🇪','🇫🇷','🗼'], cevap: '🗼', neden: 'Diğerleri bayrak, Eyfel Kulesi değil.' },
  { items: ['4','8','12','9'], cevap: '9', neden: 'Diğerleri 4\'ün katı.' },
  { items: ['🍕','🍔','🌮','🍜'], cevap: '🍜', neden: 'Diğerleri Batı yemeği, erişte Asya.' },
];

export default function TuhafOlanOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.toSeviye ?? 1);
  const [skor, setSkor]     = useState(state.toSkor ?? 0);

  const [soru, setSoru]     = useState(null);
  const [phase, setPhase]   = useState('idle');
  const [mesaj, setMesaj]   = useState('Mantıkça uymayanı bul!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const s = SORULAR[rastgele(0, SORULAR.length - 1)];
    setSoru(s);
    setMesaj('Hangisi mantıkça bu gruba ait değil?');
    setPhase('play');
  }, [seviye]);

  const sec = (item) => {
    if (phase !== 'play' || !soru) return;
    if (item === soru.cevap) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ toSeviye: ys, toSkor: ySk });
      setMesaj(`Doğru! ${soru.neden}`);
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1500);
    } else {
      setMesaj(`Yanlış! ${soru.neden}`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ toSeviye: seviye, toSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🧩 Anomali Tespiti</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Anomali Tespiti</h2>
          <p>Gruptan mantıksal olarak ayrılan ögeyî bul.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && soru && (
            <div className="oyun-secenekleri">
              {soru.items.map((item, i) => (
                <button key={i} className="secenek" onClick={() => sec(item)} style={{ fontSize: 32 }}>
                  {item}
                </button>
              ))}
            </div>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton turuncu-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
