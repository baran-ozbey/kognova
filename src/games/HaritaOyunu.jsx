import React, { useState, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const BOYUT_KUCUK = 9;
const BOYUT_BUYUK = 16;

export default function HaritaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye]     = useState(state.hSeviye);
  const [skor, setSkor]         = useState(state.hSkor);
  const [aktif, setAktif]       = useState([]);
  const [secilen, setSecilen]   = useState([]);
  const [kareDurumlar, setKareDurumlar] = useState([]);
  const [mesaj, setMesaj]       = useState('Başlamak için butona tıkla.');
  const [phase, setPhase]       = useState('idle'); // idle | show | guess
  const timerRef = useRef(null);

  const boyut = seviye > 4 ? BOYUT_BUYUK : BOYUT_KUCUK;
  const sutun = boyut === BOYUT_KUCUK ? 3 : 4;

  const baslatOyunu = useCallback((seviyeOverride) => {
    const sv = seviyeOverride ?? seviye;
    const bd = sv > 4 ? BOYUT_BUYUK : BOYUT_KUCUK;
    const as = 3 + Math.floor(sv / 2);
    const yeniAktif = [];
    while (yeniAktif.length < as) {
      const r = rastgele(0, bd - 1);
      if (!yeniAktif.includes(r)) yeniAktif.push(r);
    }
    const kareler = Array(bd).fill('normal');
    yeniAktif.forEach(i => (kareler[i] = 'parlak'));
    setAktif(yeniAktif);
    setSecilen([]);
    setKareDurumlar(kareler);
    setMesaj('Yanan kareleri aklında tut!');
    setPhase('show');

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setKareDurumlar(Array(bd).fill('normal'));
      setMesaj('Hangi kareler yanmıştı?');
      setPhase('guess');
    }, 1500);
  }, [seviye]);

  const haritaTikla = useCallback((idx) => {
    if (phase !== 'guess') return;
    if (secilen.includes(idx)) return;

    const yeniSecilen = [...secilen, idx];
    setSecilen(yeniSecilen);

    if (!aktif.includes(idx)) {
      // Yanlış
      setKareDurumlar(prev => {
        const k = [...prev]; k[idx] = 'yanlis'; return k;
      });
      setMesaj('Yanlış kare! Oyun bitti.');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ hSeviye: seviye, hSkor: skor });
    } else {
      setKareDurumlar(prev => {
        const k = [...prev]; k[idx] = 'parlak'; return k;
      });
      if (yeniSecilen.length === aktif.length) {
        // Tüm doğrular seçildi
        const yeniSeviye = seviye + 1;
        const yeniSkor   = skor + 10;
        setSeviye(yeniSeviye);
        setSkor(yeniSkor);
        xpEkle(15);
        oyunGuncelle({ hSeviye: yeniSeviye, hSkor: yeniSkor });
        setMesaj('Tebrikler! Seviye Atladın.');
        setPhase('idle');
        setTimeout(() => baslatOyunu(yeniSeviye), 1200);
      }
    }
  }, [phase, secilen, aktif, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🌌 Anlık Evren</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Anlık Evren</h2>
            <p>Gezegenlerin konumunu hafızanda tut.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div
              className="matriks"
              style={{ gridTemplateColumns: `repeat(${sutun}, 1fr)` }}
            >
              {Array(boyut).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`kare${kareDurumlar[i] === 'parlak' ? ' parlak' : ''}`}
                  style={kareDurumlar[i] === 'yanlis' ? { background: '#ef4444' } : {}}
                  onClick={() => haritaTikla(i)}
                />
              ))}
            </div>
            <div className="mesaj">{mesaj}</div>
            {phase === 'idle' && (
              <button className="buton" onClick={() => baslatOyunu()}>
                {aktif.length === 0 ? 'Başla' : 'Tekrar Dene'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
