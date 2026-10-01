import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const EMOJILER = ['Δ','Φ','Ψ','Ω','Σ','Λ','Θ','Ξ','Π','Γ','Ж','Ф','Ц','Ч','Ш'];

export default function FarkiBulOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.fSeviye);
  const [skor, setSkor]     = useState(state.fSkor);
  
  const [matris1, setMatris1] = useState([]);
  const [matris2, setMatris2] = useState([]);
  const [farkIdx, setFarkIdx] = useState(-1);
  const [phase, setPhase] = useState('idle');
  const [mesaj, setMesaj] = useState('İkinci evrendeki sapan (değişen) rünü bul!');

  const baslatOyunu = useCallback((seviyeOverride) => {
    const s = seviyeOverride || seviye;
    const gridSize = Math.min(4 + Math.floor(s / 3), 16);
    
    // Rastgele emojiler seç
    const baseEmojis = Array.from({length: gridSize}, () => EMOJILER[rastgele(0, EMOJILER.length - 1)]);
    
    // Farklı bir emoji seç
    let diffEmoji = EMOJILER[rastgele(0, EMOJILER.length - 1)];
    const targetIdx = rastgele(0, gridSize - 1);
    
    while(diffEmoji === baseEmojis[targetIdx]) {
      diffEmoji = EMOJILER[rastgele(0, EMOJILER.length - 1)];
    }
    
    const diffEmojis = [...baseEmojis];
    diffEmojis[targetIdx] = diffEmoji;
    
    setMatris1(baseEmojis);
    setMatris2(diffEmojis);
    setFarkIdx(targetIdx);
    
    setMesaj('Sağdaki paralel evrende farklılaşan rünü (şekli) seç!');
    setPhase('play');
  }, [seviye]);

  const secimYap = (idx) => {
    if (phase !== 'play') return;
    
    if (idx === farkIdx) {
      const yeniSeviye = seviye + 1;
      const yeniSkor = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ fSeviye: yeniSeviye, fSkor: yeniSkor });
      baslatOyunu(yeniSeviye);
    } else {
      setMesaj('Yanlış! Farklı olana tıklayacaktın.');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ fSeviye: seviye, fSkor: skor });
    }
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>👁️ Kozmik Sapma</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Kozmik Sapma</h2>
            <p>İkinci boyutta değişime uğrayan rünü (şekli) bul ve ona tıkla!</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani" style={{ flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
            {phase === 'play' && (
              <>
                <div className="desen" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(matris1.length))}, 45px)`, background: '#ffffff05', padding: '10px', borderRadius: '15px' }}>
                  {matris1.map((emoji, i) => (
                    <div key={`m1-${i}`} className="desen-kare" style={{ width: '45px', height: '45px', fontSize: '24px', cursor: 'default' }}>
                      {emoji}
                    </div>
                  ))}
                </div>
                
                <div className="desen" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(matris2.length))}, 45px)`, background: '#ffffff10', padding: '10px', borderRadius: '15px', border: '1px solid #ffffff20' }}>
                  {matris2.map((emoji, i) => (
                    <div key={`m2-${i}`} className="desen-kare" style={{ width: '45px', height: '45px', fontSize: '24px' }} onClick={() => secimYap(i)}>
                      {emoji}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
            <div className="mesaj" style={{ marginTop: '20px' }}>{mesaj}</div>
            {phase === 'idle' && (
              <button className="buton sari-btn" onClick={() => baslatOyunu()}>Başla</button>
            )}
        </div>
      </div>
    </div>
  );
}
