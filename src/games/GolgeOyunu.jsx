import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { NESNELER, rastgele, karistir } from '../utils';

export default function GolgeOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye]   = useState(state.gSeviye);
  const [skor, setSkor]       = useState(state.gSkor);
  const [dogru, setDogru]     = useState(null);
  const [secenekler, setSecenekler] = useState([]);
  const [mesaj, setMesaj]     = useState('Başlamak için butona tıkla.');
  const [golgeFilter, setGolgeFilter] = useState('brightness(1)');
  const [phase, setPhase]     = useState('idle');
  const [ikonGoster, setIkonGoster] = useState('❓');

  const baslatOyunu = useCallback((seviyeOverride) => {
    const sv = seviyeOverride ?? seviye;
    setSecenekler([]);
    setPhase('show');
    const nesne = NESNELER[rastgele(0, NESNELER.length - 1)];
    setDogru(nesne);
    setIkonGoster(nesne.ikon);
    setGolgeFilter('brightness(1)');
    setMesaj('Nesneyi aklında tut... Kayboluyor!');

    setTimeout(() => {
      setGolgeFilter('brightness(0)');
      setMesaj('Bu silüet neye ait?');

      setTimeout(() => {
        const sl = [nesne];
        while (sl.length < 4) {
          const rn = NESNELER[rastgele(0, NESNELER.length - 1)];
          if (!sl.find(x => x.ad === rn.ad)) sl.push(rn);
        }
        setSecenekler(karistir(sl));
        setPhase('guess');
      }, 1500);
    }, 1500);
  }, [seviye]);

  const golgeCevapla = useCallback((ad, el) => {
    if (phase !== 'guess') return;
    if (ad === dogru.ad) {
      setGolgeFilter('brightness(1)');
      setMesaj('Doğru! Harika hafıza.');
      setSecenekler([]);
      setPhase('idle');
      const yeniSeviye = seviye + 1;
      const yeniSkor   = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ gSeviye: yeniSeviye, gSkor: yeniSkor });
      setTimeout(() => baslatOyunu(yeniSeviye), 1500);
    } else {
      setGolgeFilter('brightness(0.5)');
      setMesaj(`Yanlış! Doğru cevap: ${dogru.ad}`);
      setSecenekler([]);
      setPhase('idle');
      hataYap();
      oyunGuncelle({ gSeviye: seviye, gSkor: skor });
    }
  }, [phase, dogru, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🌑 Silüet Avcısı</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Silüet Avcısı</h2>
            <p>Gölgenin hangi nesneye ait olduğunu bul.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div className="golge" style={{ filter: golgeFilter }}>
              {ikonGoster}
            </div>
            <div className="mesaj">{mesaj}</div>
            {secenekler.length > 0 && (
              <div className="oyun-secenekleri">
                {secenekler.map(n => (
                  <button
                    key={n.ad}
                    className="secenek"
                    onClick={() => golgeCevapla(n.ad)}
                  >
                    {n.ad}
                  </button>
                ))}
              </div>
            )}
            {phase === 'idle' && (
              <button className="buton kirmizi-btn" onClick={() => baslatOyunu()}>
                {dogru === null ? 'Başla' : 'Sonraki Soru'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
