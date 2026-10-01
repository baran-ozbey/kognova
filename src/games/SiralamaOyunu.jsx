import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const RENKLER = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];

export default function SiralamaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.sSeviye);
  const [skor, setSkor]     = useState(state.sSkor);
  
  const [dizi, setDizi] = useState([]);
  const [kullaniciDizisi, setKullaniciDizisi] = useState([]);
  const [aktifRenk, setAktifRenk] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle, gosteriyor, bekliyor
  const [mesaj, setMesaj] = useState('Sırayı akılda tut ve tekrarla!');

  const diziyiGoster = useCallback(async (yeniDizi) => {
    setPhase('gosteriyor');
    setMesaj('Dikkatle izle...');
    
    // Biraz bekle
    await new Promise(r => setTimeout(r, 800));
    
    for (let i = 0; i < yeniDizi.length; i++) {
      setAktifRenk(yeniDizi[i]);
      await new Promise(r => setTimeout(r, 600)); // Renk yanık kalma süresi
      setAktifRenk(null);
      await new Promise(r => setTimeout(r, 200)); // Ara boşluk
    }
    
    setPhase('bekliyor');
    setMesaj('Sıra Sende!');
  }, []);

  const baslatOyunu = useCallback((seviyeOverride) => {
    const s = seviyeOverride || seviye;
    const uzunluk = Math.min(3 + s, 10);
    
    const yeniDizi = Array.from({length: uzunluk}, () => rastgele(0, 3));
    setDizi(yeniDizi);
    setKullaniciDizisi([]);
    diziyiGoster(yeniDizi);
  }, [seviye, diziyiGoster]);

  const renkTikla = (idx) => {
    if (phase !== 'bekliyor') return;
    
    setAktifRenk(idx);
    setTimeout(() => setAktifRenk(null), 200);
    
    const yeniKullaniciDizisi = [...kullaniciDizisi, idx];
    setKullaniciDizisi(yeniKullaniciDizisi);
    
    // Doğru yolda mı?
    const dogruMu = yeniKullaniciDizisi.every((val, index) => val === dizi[index]);
    
    if (!dogruMu) {
      setMesaj('Yanlış sıra!');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ sSeviye: seviye, sSkor: skor });
    } else if (yeniKullaniciDizisi.length === dizi.length) {
      setPhase('idle');
      const yeniSeviye = seviye + 1;
      const yeniSkor = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ sSeviye: yeniSeviye, sSkor: yeniSkor });
      setTimeout(() => baslatOyunu(yeniSeviye), 1000);
    }
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🪐 Yörünge Hafızası</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Yörünge Hafızası</h2>
            <p>Gezegenlerin titreşim sırasını ezberle ve aynı sırayla aktifleştir.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '20px', maxWidth: '300px', margin: 'auto' }}>
              {RENKLER.map((renk, idx) => (
                <div 
                  key={idx}
                  onClick={() => renkTikla(idx)}
                  style={{
                    backgroundColor: renk,
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    opacity: (aktifRenk === idx) ? 1 : 0.4,
                    transform: (aktifRenk === idx) ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: (aktifRenk === idx) ? `0 0 35px ${renk}, inset 0 -10px 20px rgba(0,0,0,0.5)` : `inset 0 -10px 20px rgba(0,0,0,0.5)`,
                    transition: 'all 0.2s ease',
                    cursor: phase === 'bekliyor' ? 'pointer' : 'default'
                  }}
                />
              ))}
            </div>
            
            <div className="mesaj">{mesaj}</div>
            {phase === 'idle' && (
              <button className="buton mavi-btn" onClick={() => baslatOyunu()}>Başla</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
