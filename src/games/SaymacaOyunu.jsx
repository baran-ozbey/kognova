import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

export default function SaymacaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.ksSeviye);
  const [skor, setSkor]     = useState(state.ksSkor);
  
  const [sekiller, setSekiller] = useState([]);
  const [hedef, setHedef] = useState(0);
  const [hedefRenk, setHedefRenk] = useState('');
  const [phase, setPhase] = useState('idle');
  const [mesaj, setMesaj] = useState('Ekrandaki belirtilen renkleri say!');
  
  const renkIsimleri = {
    '#ef4444': 'KIRMIZI',
    '#3b82f6': 'MAVİ',
    '#22c55e': 'YEŞİL',
    '#eab308': 'SARI'
  };

  const baslatOyunu = useCallback((seviyeOverride) => {
    const s = seviyeOverride || seviye;
    const adet = Math.min(10 + s * 3, 35);
    
    const renklerArr = Object.keys(renkIsimleri);
    const uretilenSekiller = [];
    
    const renkSayilari = { '#ef4444': 0, '#3b82f6': 0, '#22c55e': 0, '#eab308': 0 };
    
    for(let i=0; i<adet; i++) {
      const r = renklerArr[rastgele(0, 3)];
      renkSayilari[r]++;
      uretilenSekiller.push({
        id: i,
        renk: r,
        left: rastgele(0, 85) + '%',
        top: rastgele(0, 85) + '%',
        boyut: rastgele(15, 30) + 'px',
        sekil: '50%', // Sadece yuvarlak yıldızlar
        rot: rastgele(0, 180) + 'deg',
        glow: rastgele(10, 25) + 'px'
      });
    }
    
    // Hedef rengi seç (en az 1 tane olanlardan)
    const mevcutRenkler = Object.keys(renkSayilari).filter(r => renkSayilari[r] > 0);
    const secilenRenk = mevcutRenkler[rastgele(0, mevcutRenkler.length - 1)];
    
    setSekiller(uretilenSekiller);
    setHedefRenk(secilenRenk);
    setHedef(renkSayilari[secilenRenk]);
    setMesaj(`Evrende kaç tane ${renkIsimleri[secilenRenk]} yıldız tozu var?`);
    setPhase('play');
  }, [seviye]);

  const tahminYap = (tahminSayisi) => {
    if (phase !== 'play') return;
    
    if (tahminSayisi === hedef) {
      setMesaj('Doğru!');
      setPhase('idle');
      const yeniSeviye = seviye + 1;
      const yeniSkor = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ ksSeviye: yeniSeviye, ksSkor: yeniSkor });
      setTimeout(() => baslatOyunu(yeniSeviye), 1000);
    } else {
      setMesaj(`Yanlış! Tam olarak ${hedef} tane ${renkIsimleri[hedefRenk]} vardı.`);
      setPhase('idle');
      hataYap();
      oyunGuncelle({ ksSeviye: seviye, ksSkor: skor });
    }
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>✨ Yıldız Tozu Avı</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Yıldız Tozu Avı</h2>
            <p>Kozmik kaosun içinde hedeflenen enerjiyi (rengi) say.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani" style={{ minHeight: '400px' }}>
            
            {phase === 'play' && (
              <>
                <div style={{ position: 'relative', width: '100%', height: '250px', background: '#00000040', borderRadius: '15px', overflow: 'hidden', border: '1px solid #ffffff20', marginBottom: '20px' }}>
                  {sekiller.map(s => (
                    <div key={s.id} style={{
                      position: 'absolute',
                      left: s.left,
                      top: s.top,
                      width: s.boyut,
                      height: s.boyut,
                      backgroundColor: s.renk,
                      borderRadius: s.sekil,
                      transform: `rotate(${s.rot})`,
                      boxShadow: `0 0 ${s.glow} ${s.renk}, inset 0 0 5px #fff`
                    }} />
                  ))}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', width: '100%' }}>
                  {[...Array(5)].map((_, i) => {
                    // Butonlar arasına doğru cevabı da sakla
                    const fark = i - 2;
                    let sayi = hedef + fark;
                    if (sayi < 0) sayi = Math.floor(Math.random() * 10) + 1;
                    
                    return (
                      <button key={i} className="buton pembe-btn" style={{ margin: 0, padding: '15px 5px', fontSize: '20px' }} onClick={() => tahminYap(sayi)}>
                        {sayi}
                      </button>
                    );
                  }).sort(() => 0.5 - Math.random())} 
                </div>
              </>
            )}
            
            <div className="mesaj" style={{ marginTop: '15px' }}>{mesaj}</div>
            {phase === 'idle' && (
              <button className="buton sari-btn" onClick={() => baslatOyunu()}>Başla</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
