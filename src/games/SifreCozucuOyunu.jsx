import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

export default function SifreCozucuOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.sfSeviye);
  const [skor, setSkor]     = useState(state.sfSkor);
  
  const [sifre, setSifre] = useState([]);
  const [tahmin, setTahmin] = useState('');
  const [gecmisTahminler, setGecmisTahminler] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [mesaj, setMesaj] = useState('3 Haneli Kuantum Koordinatını Bul!');
  const [denemeHakki, setDenemeHakki] = useState(5);

  const baslatOyunu = useCallback((seviyeOverride) => {
    const s = seviyeOverride || seviye;
    // Seviye arttıkça basamak sayısı artabilir ama mobilde zorlar. 3 basamakta tutup deneme hakkını azaltalım.
    const yeniSifre = [rastgele(0, 9), rastgele(0, 9), rastgele(0, 9)];
    setSifre(yeniSifre);
    setTahmin('');
    setGecmisTahminler([]);
    setDenemeHakki(Math.max(5 - Math.floor(s / 4), 3));
    setPhase('play');
    setMesaj('3 rakamlı koordinatı gir. (Örn: 123)');
  }, [seviye]);

  const tahminYap = () => {
    if (phase !== 'play' || tahmin.length !== 3) return;
    
    const tahminDizisi = tahmin.split('').map(Number);
    let tamDogru = 0;
    let yerYanlis = 0;
    
    const sifreKopya = [...sifre];
    const tahminKopya = [...tahminDizisi];
    
    // Tam doğruları bul (hem rakam hem yer)
    for(let i=0; i<3; i++) {
      if(tahminKopya[i] === sifreKopya[i]) {
        tamDogru++;
        sifreKopya[i] = -1;
        tahminKopya[i] = -2;
      }
    }
    
    // Sadece rakamı doğru olanları bul
    for(let i=0; i<3; i++) {
      const idx = sifreKopya.indexOf(tahminKopya[i]);
      if (idx !== -1) {
        yerYanlis++;
        sifreKopya[idx] = -1;
      }
    }
    
    const yeniGecmis = [...gecmisTahminler, { deger: tahmin, tam: tamDogru, yari: yerYanlis }];
    setGecmisTahminler(yeniGecmis);
    setTahmin('');
    
    if (tamDogru === 3) {
      setMesaj('ŞİFRE KIRILDI!');
      setPhase('idle');
      const yeniSeviye = seviye + 1;
      const yeniSkor = skor + 10 + (denemeHakki * 5); // Kalan hakka göre ekstra puan
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(20);
      oyunGuncelle({ sfSeviye: yeniSeviye, sfSkor: yeniSkor });
      setTimeout(() => baslatOyunu(yeniSeviye), 1500);
    } else {
      const yeniHak = denemeHakki - 1;
      setDenemeHakki(yeniHak);
      if (yeniHak === 0) {
        setMesaj(`BAŞARISIZ! Şifre ${sifre.join('')} idi.`);
        setPhase('idle');
        hataYap();
        oyunGuncelle({ sfSeviye: seviye, sfSkor: skor });
      }
    }
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🔐 Kuantum Kilidi</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Kuantum Kilidi</h2>
            <p>🔵: Tam isabet, 🌀: Enerji var ama koordinat yanlış.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani" style={{ justifyContent: 'flex-start' }}>
            
            {phase === 'play' && (
              <>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>Kalan Hak: <strong>{denemeHakki}</strong></div>
                
                <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
                  {gecmisTahminler.map((g, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff10', padding: '10px 15px', borderRadius: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{g.deger}</span>
                      <span>{Array(g.tam).fill('🔵').join('')}{Array(g.yari).fill('🌀').join('')}{g.tam===0&&g.yari===0&&'❌'}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input 
                    type="number" 
                    value={tahmin}
                    onChange={(e) => setTahmin(e.target.value.slice(0,3))}
                    onKeyDown={(e) => e.key === 'Enter' && tahminYap()}
                    style={{ fontSize: '24px', padding: '10px', width: '120px', textAlign: 'center', borderRadius: '12px', background: '#00000040', color: 'white', border: '2px solid #ffffff30' }}
                    placeholder="***"
                  />
                  <button className="buton turuncu-btn" style={{ margin: 0, width: 'auto', padding: '10px 25px' }} onClick={tahminYap}>Dene</button>
                </div>
              </>
            )}
            
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
