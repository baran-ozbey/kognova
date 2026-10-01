import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele, karistir } from '../utils';

export default function TrafikOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye]     = useState(state.tSeviye);
  const [skor, setSkor]         = useState(state.tSkor);
  const [sayilar, setSayilar]   = useState([]);     // doğru sıradaki sayılar
  const [gosterilen, setGosterilen] = useState([]); // ekranda karışık sıra
  const [adim, setAdim]         = useState(0);
  const [artanMi, setArtanMi]   = useState(true);
  const [mesaj, setMesaj]       = useState('Sayıları doğru yönde yakala.');
  const [phase, setPhase]       = useState('idle');
  const [secilmis, setSecilmis] = useState(new Set());

  const baslatOyunu = useCallback((seviyeOverride) => {
    const sv  = seviyeOverride ?? seviye;
    const artan = Math.random() >= 0.5;
    setArtanMi(artan);
    let sa = 3 + Math.floor(sv / 2);
    if (sa > 9) sa = 9;
    const liste = [];
    while (liste.length < sa) {
      const r = rastgele(1, 99);
      if (!liste.includes(r)) liste.push(r);
    }
    const sirali = artan
      ? [...liste].sort((a, b) => a - b)
      : [...liste].sort((a, b) => b - a);
    setAdim(0);
    setSayilar(sirali);
    setGosterilen(karistir(liste));
    setSecilmis(new Set());
    setMesaj(artan ? '📉 Küçükten büyüğe sırala!' : '📈 Büyükten küçüğe sırala!');
    setPhase('play');
  }, [seviye]);

  const trafikTikla = useCallback((s, idx) => {
    if (phase !== 'play') return;
    if (secilmis.has(idx)) return;

    if (s === sayilar[adim]) {
      const yeniSecilmis = new Set(secilmis);
      yeniSecilmis.add(idx);
      setSecilmis(yeniSecilmis);
      const yeniAdim = adim + 1;
      setAdim(yeniAdim);
      if (yeniAdim === sayilar.length) {
        const yeniSeviye = seviye + 1;
        const yeniSkor   = skor + 10;
        setSeviye(yeniSeviye);
        setSkor(yeniSkor);
        xpEkle(15);
        oyunGuncelle({ tSeviye: yeniSeviye, tSkor: yeniSkor });
        setMesaj('Harika Sıralama!');
        setPhase('idle');
        setTimeout(() => baslatOyunu(yeniSeviye), 1000);
      }
    } else {
      setMesaj('Yanlış sıra!');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ tSeviye: seviye, tSkor: skor });
    }
  }, [phase, secilmis, adim, sayilar, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🚦 Zihin Trafiği</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Zihin Trafiği</h2>
            <p>Sayıları kurala göre sırala!</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div
              style={{ color: artanMi ? '#22d3ee' : '#ec4899', fontWeight: 'bold', marginBottom: 10, fontSize: 15 }}
            >
              {phase !== 'idle' && (artanMi ? '📉 Mod: Küçükten Büyüğe' : '📈 Mod: Büyükten Küçüğe')}
            </div>
            <div className="siralama">
              {gosterilen.map((s, i) => (
                <div
                  key={i}
                  className="sayi"
                  style={
                    secilmis.has(i)
                      ? { background: '#10b981', opacity: 0.3 }
                      : phase === 'idle' && sayilar.length > 0
                      ? { background: '#ef4444' }
                      : {}
                  }
                  onClick={() => trafikTikla(s, i)}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="mesaj">{mesaj}</div>
            {phase === 'idle' && (
              <button className="buton mavi-btn" onClick={() => baslatOyunu()}>
                {sayilar.length === 0 ? 'Başla' : 'Tekrar Dene'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
