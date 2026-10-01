import React, { useState, useCallback, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const RENKLER = [
  { ad: 'KARANLIK MADDE', hex: '#ef4444' },
  { ad: 'SÜPERNOVA', hex: '#3b82f6' },
  { ad: 'KUASAR', hex: '#22c55e' },
  { ad: 'PLAZMA', hex: '#eab308' },
  { ad: 'NÖTRON', hex: '#a855f7' },
  { ad: 'KIZIL DEV', hex: '#f97316' }
];

export default function StroopOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.rSeviye);
  const [skor, setSkor]     = useState(state.rSkor);
  
  const [yaziRengi, setYaziRengi] = useState(RENKLER[0]);
  const [yaziMetni, setYaziMetni] = useState(RENKLER[1]);
  const [secenekler, setSecenekler] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [mesaj, setMesaj] = useState('Yazının RENGİNİ seç, ne yazdığını değil!');

  const baslatOyunu = useCallback((seviyeOverride) => {
    const yaziIdx = rastgele(0, RENKLER.length - 1);
    let renkIdx = rastgele(0, RENKLER.length - 1);
    
    // Genellikle farklı olsun ki yanıltıcı olsun
    if (Math.random() > 0.3) {
      while (renkIdx === yaziIdx) {
        renkIdx = rastgele(0, RENKLER.length - 1);
      }
    }
    
    const metin = RENKLER[yaziIdx];
    const renk = RENKLER[renkIdx];
    
    setYaziMetni(metin);
    setYaziRengi(renk);
    
    // Seçenekleri oluştur
    const yeniSecenekler = [renk];
    while(yeniSecenekler.length < 4) {
      const rastgeleRenk = RENKLER[rastgele(0, RENKLER.length - 1)];
      if (!yeniSecenekler.includes(rastgeleRenk)) {
        yeniSecenekler.push(rastgeleRenk);
      }
    }
    setSecenekler(yeniSecenekler.sort(() => 0.5 - Math.random()));
    setMesaj('Yazının RENGİNİ seç, ne yazdığını değil!');
    setPhase('play');
  }, []);

  const secimYap = (secilen) => {
    if (phase !== 'play') return;
    
    if (secilen.ad === yaziRengi.ad) {
      const yeniSeviye = seviye + 1;
      const yeniSkor = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ rSeviye: yeniSeviye, rSkor: yeniSkor });
      baslatOyunu(yeniSeviye);
    } else {
      setMesaj('Yanlış! Rengini seçecektin.');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ rSeviye: seviye, rSkor: skor });
    }
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🌌 Frekans Kırılması</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Frekans Kırılması</h2>
            <p>Enerjinin İSMİNE değil, RENGİNE odaklanıp doğru seçeneğe tıkla!</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            {phase === 'play' && (
              <>
                <div style={{ fontSize: '50px', fontWeight: '900', color: yaziRengi.hex, margin: '30px 0', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                  {yaziMetni.ad}
                </div>
                <div className="cevaplar">
                  {secenekler.map((s, i) => (
                    <button key={i} className="cevap" style={{ fontSize: '16px' }} onClick={() => secimYap(s)}>
                      {s.ad}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="mesaj">{mesaj}</div>
            {phase === 'idle' && (
              <button className="buton kirmizi-btn" onClick={() => baslatOyunu()}>Başla</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
