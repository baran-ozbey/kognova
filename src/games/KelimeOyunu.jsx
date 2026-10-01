import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const KELIMELER = ['KORTEKS', 'SİNAPS', 'NEBULA', 'GALAKSİ', 'NÖRON', 'KUANTUM', 'EVREN', 'KOZMİK', 'PARALEL', 'ZAMAN', 'ENERJİ', 'MADDE', 'HİPOTEZ'];

export default function KelimeOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.klSeviye);
  const [skor, setSkor]     = useState(state.klSkor);
  
  const [kelime, setKelime] = useState('');
  const [karisikHarfler, setKarisikHarfler] = useState([]);
  const [secilenHarfler, setSecilenHarfler] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [mesaj, setMesaj] = useState('Karışık harflerden anlamlı kelimeyi bul!');

  const baslatOyunu = useCallback((seviyeOverride) => {
    let secilenKelime = KELIMELER[rastgele(0, KELIMELER.length - 1)];
    
    setKelime(secilenKelime);
    
    // Harfleri karıştır
    let harfler = secilenKelime.split('');
    let karisik = [...harfler].sort(() => 0.5 - Math.random());
    while (karisik.join('') === secilenKelime && secilenKelime.length > 1) {
      karisik = [...harfler].sort(() => 0.5 - Math.random());
    }
    
    setKarisikHarfler(karisik.map((h, i) => ({ id: i, harf: h })));
    setSecilenHarfler([]);
    setMesaj('Harflere sırayla tıkla!');
    setPhase('play');
  }, []);

  const harfTikla = (harfObj) => {
    if (phase !== 'play') return;
    
    const yeniSecilenler = [...secilenHarfler, harfObj];
    setSecilenHarfler(yeniSecilenler);
    
    const guncelKarisik = karisikHarfler.filter(h => h.id !== harfObj.id);
    setKarisikHarfler(guncelKarisik);
    
    if (guncelKarisik.length === 0) {
      const olusanKelime = yeniSecilenler.map(h => h.harf).join('');
      if (olusanKelime === kelime) {
        setMesaj('Tebrikler! Kelime doğru.');
        setPhase('idle');
        const yeniSeviye = seviye + 1;
        const yeniSkor = skor + 15;
        setSeviye(yeniSeviye);
        setSkor(yeniSkor);
        xpEkle(15);
        oyunGuncelle({ klSeviye: yeniSeviye, klSkor: yeniSkor });
        setTimeout(() => baslatOyunu(yeniSeviye), 1000);
      } else {
        setMesaj(`Yanlış! Doğrusu: ${kelime} olacaktı.`);
        setPhase('idle');
        hataYap();
        oyunGuncelle({ klSeviye: seviye, klSkor: skor });
      }
    }
  };
  
  const secimiGeriAl = () => {
    if (secilenHarfler.length === 0 || phase !== 'play') return;
    const sonSecilen = secilenHarfler[secilenHarfler.length - 1];
    setSecilenHarfler(secilenHarfler.slice(0, -1));
    setKarisikHarfler([...karisikHarfler, sonSecilen]);
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🧬 Zihin Şifreleri</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Zihin Şifreleri</h2>
            <p>Boyutlara dağılmış harf parçalarını birleştir.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            
            {phase === 'play' && (
              <>
                {/* Cevap Kutusu */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', minHeight: '60px' }}>
                  {kelime.split('').map((_, i) => {
                    const secilen = secilenHarfler[i];
                    return (
                      <div key={i} style={{ width: '50px', height: '60px', borderBottom: '4px solid #ffffff40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                        {secilen ? secilen.harf : ''}
                      </div>
                    );
                  })}
                </div>
                
                {/* Karışık Harfler */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
                  {karisikHarfler.map(h => (
                    <button 
                      key={h.id} 
                      className="buton turuncu-btn" 
                      style={{ width: '55px', height: '55px', margin: 0, padding: 0, fontSize: '26px' }} 
                      onClick={() => harfTikla(h)}
                    >
                      {h.harf}
                    </button>
                  ))}
                </div>
                
                {secilenHarfler.length > 0 && (
                  <button style={{ padding: '10px 20px', background: '#ffffff15', borderRadius: '10px', color: 'white' }} onClick={secimiGeriAl}>
                    Geri Al
                  </button>
                )}
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
