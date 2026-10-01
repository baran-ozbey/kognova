import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const EMOJILER = ['💠','⚛️','🧠','👁️','💫','⚡','🪐','🧬','🌌','☄️','✨','🌀','🔮','🧿','☄️'];

export default function HafizaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.hfSeviye);
  const [skor, setSkor]     = useState(state.hfSkor);
  
  const [kartlar, setKartlar] = useState([]);
  const [acikKartlar, setAcikKartlar] = useState([]);
  const [eslesenler, setEslesenler] = useState([]);
  const [kilitli, setKilitli] = useState(false);
  const [phase, setPhase] = useState('idle');

  const baslatOyunu = useCallback((seviyeOverride) => {
    const s = seviyeOverride || seviye;
    const ciftSayisi = Math.min(3 + s, 8); // Max 16 kart (8 çift)
    const secilenEmojiler = [...EMOJILER].sort(() => 0.5 - Math.random()).slice(0, ciftSayisi);
    
    let yeniKartlar = [...secilenEmojiler, ...secilenEmojiler]
      .sort(() => 0.5 - Math.random())
      .map((emoji, index) => ({ id: index, emoji }));
      
    setKartlar(yeniKartlar);
    setAcikKartlar([]);
    setEslesenler([]);
    setPhase('play');
    setKilitli(false);
  }, [seviye]);

  useEffect(() => {
    if (acikKartlar.length === 2) {
      setKilitli(true);
      const [ilk, ikinci] = acikKartlar;
      
      if (kartlar[ilk].emoji === kartlar[ikinci].emoji) {
        setEslesenler(prev => [...prev, ilk, ikinci]);
        setAcikKartlar([]);
        setKilitli(false);
        
        if (eslesenler.length + 2 === kartlar.length) {
          setTimeout(() => {
            const yeniSeviye = seviye + 1;
            const yeniSkor = skor + 10;
            setSeviye(yeniSeviye);
            setSkor(yeniSkor);
            xpEkle(15);
            oyunGuncelle({ hfSeviye: yeniSeviye, hfSkor: yeniSkor });
            baslatOyunu(yeniSeviye);
          }, 1000);
        }
      } else {
        setTimeout(() => {
          setAcikKartlar([]);
          setKilitli(false);
          setPhase('idle');
          hataYap();
          oyunGuncelle({ hfSeviye: seviye, hfSkor: skor });
        }, 1000);
      }
    }
  }, [acikKartlar, kartlar, eslesenler, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  const kartTikla = (index) => {
    if (kilitli || acikKartlar.includes(index) || eslesenler.includes(index)) return;
    setAcikKartlar(prev => [...prev, index]);
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🧠 Nöron Eşleşmesi</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Nöron Eşleşmesi</h2>
            <p>Kozmik sinapsları birbiriyle eşle!</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div className="desen" style={{ gridTemplateColumns: `repeat(${kartlar.length > 12 ? 4 : kartlar.length > 6 ? 3 : 2}, 60px)` }}>
              {kartlar.map((kart, i) => {
                const acikMi = acikKartlar.includes(i) || eslesenler.includes(i);
                return (
                  <div 
                    key={kart.id} 
                    className={`desen-kare ${acikMi ? 'acik' : ''}`} 
                    onClick={() => kartTikla(i)}
                    style={{ background: acikMi ? '#ffffff15' : 'linear-gradient(135deg, #7c3aed, #ec4899)', border: acikMi ? '1px solid #ffffff30' : 'none' }}
                  >
                    {acikMi ? kart.emoji : '?'}
                  </div>
                );
              })}
            </div>
            {phase === 'idle' && (
              <button className="buton turuncu-btn" onClick={() => baslatOyunu()}>
                {kartlar.length === 0 ? 'Başla' : 'Tekrar Dene'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
