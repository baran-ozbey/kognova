import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const SEMBOLLER = ['🔵','🟢','🔴','🟡','🟣'];

export default function DesenOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye]     = useState(state.dSeviye);
  const [skor, setSkor]         = useState(state.dSkor);
  const [kareler, setKareler]   = useState([]);
  const [dogruIdx, setDogruIdx] = useState(-1);
  const [mesaj, setMesaj]       = useState('Farklı olanı bul!');
  const [phase, setPhase]       = useState('idle');

  const baslatOyunu = useCallback((seviyeOverride) => {
    let cogunluk = SEMBOLLER[rastgele(0, SEMBOLLER.length - 1)];
    let farkli   = SEMBOLLER[rastgele(0, SEMBOLLER.length - 1)];
    while (cogunluk === farkli) farkli = SEMBOLLER[rastgele(0, SEMBOLLER.length - 1)];
    const idx = rastgele(0, 15);
    setDogruIdx(idx);
    setKareler(Array(16).fill(cogunluk).map((s, i) => i === idx ? farkli : s));
    setMesaj('Farklı Olanı Bul!');
    setPhase('play');
  }, []);

  const desenTikla = useCallback((idx) => {
    if (phase !== 'play') return;
    if (idx === dogruIdx) {
      const yeniSeviye = seviye + 1;
      const yeniSkor   = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ dSeviye: yeniSeviye, dSkor: yeniSkor });
      baslatOyunu(yeniSeviye);
    } else {
      setMesaj('Yanlış seçim!');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ dSeviye: seviye, dSkor: skor });
    }
  }, [phase, dogruIdx, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🔮 Örüntü Avcısı</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Örüntü Avcısı</h2>
            <p>Farklı olanı veya desene uymayanı bul.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div className="desen">
              {kareler.map((s, i) => (
                <div key={i} className="desen-kare" onClick={() => desenTikla(i)}>
                  {s}
                </div>
              ))}
            </div>
            <div className="mesaj">{mesaj}</div>
            {phase === 'idle' && (
              <button
                className="buton turuncu-btn"
                onClick={() => baslatOyunu()}
              >
                {kareler.length === 0 ? 'Başla' : 'Tekrar Dene'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
