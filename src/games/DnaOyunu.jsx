import React, { useState, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { DNA_HARFLER, rastgele } from '../utils';

export default function DnaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye]     = useState(state.dnSeviye);
  const [skor, setSkor]         = useState(state.dnSkor);
  const [dizi, setDizi]         = useState([]);
  const [kullanici, setKullanici] = useState([]);
  const [mesaj, setMesaj]       = useState('Ezberle ve tekrar et.');
  const [phase, setPhase]       = useState('idle'); // idle | show | input
  const timerRef = useRef(null);

  const baslatOyunu = useCallback((seviyeOverride) => {
    const sv = seviyeOverride ?? seviye;
    let ha = 3 + Math.floor(sv / 2);
    if (ha > 10) ha = 10;
    const yeniDizi = Array.from({ length: ha }, () => DNA_HARFLER[rastgele(0, 3)]);
    setDizi(yeniDizi);
    setKullanici([]);
    setMesaj('Ezberle...');
    setPhase('show');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase('input');
      setMesaj('Diziyi tekrar et!');
    }, 2000 + ha * 200);
  }, [seviye]);

  const harfEkle = useCallback((h) => {
    if (phase !== 'input') return;
    const idx = kullanici.length;
    if (h !== dizi[idx]) {
      setMesaj('Yanlış Harf! Dizi bozuldu.');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ dnSeviye: seviye, dnSkor: skor });
      return;
    }
    const yeni = [...kullanici, h];
    setKullanici(yeni);
    if (yeni.length === dizi.length) {
      const yeniSeviye = seviye + 1;
      const yeniSkor   = skor + 15;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(20);
      oyunGuncelle({ dnSeviye: yeniSeviye, dnSkor: yeniSkor });
      setMesaj('Mükemmel hafıza!');
      setPhase('idle');
      setTimeout(() => baslatOyunu(yeniSeviye), 1200);
    }
  }, [phase, kullanici, dizi, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🧬 DNA Kodu</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>DNA Kodu</h2>
            <p>Kaybolmadan önce diziyi ezberle ve tekrar et.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            {phase === 'show' && (
              <div className="dna-kod">
                {dizi.join(' ')}
              </div>
            )}
            {phase === 'input' && (
              <div className="dna-giris">
                <div className="dna-girilen">
                  {kullanici.length > 0 ? kullanici.join(' ') : '─'}
                </div>
                <div className="cevaplar">
                  {DNA_HARFLER.map(h => (
                    <button key={h} className="cevap" onClick={() => harfEkle(h)}>{h}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="mesaj">{mesaj}</div>
            {phase === 'idle' && (
              <button
                className="buton sari-btn"
                onClick={() => baslatOyunu()}
              >
                {dizi.length === 0 ? 'Başla' : 'Tekrar Dene'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
