import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

export default function MatematikOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.mSeviye);
  const [skor, setSkor]     = useState(state.mSkor);
  
  const [islem, setIslem] = useState('');
  const [dogruMu, setDogruMu] = useState(true);
  const [phase, setPhase] = useState('idle');
  const [mesaj, setMesaj] = useState('İşlem doğru mu yanlış mı? Hızlı ol!');

  const baslatOyunu = useCallback((seviyeOverride) => {
    const s = seviyeOverride || seviye;
    const zorlukMultiplier = Math.floor(s / 5) + 1;
    
    const num1 = rastgele(1 * zorlukMultiplier, 10 * zorlukMultiplier);
    const num2 = rastgele(1 * zorlukMultiplier, 10 * zorlukMultiplier);
    const gercekSonuc = num1 + num2;
    
    // %50 ihtimalle doğru, %50 ihtimalle yanlış sonuç göster
    const isDogru = Math.random() > 0.5;
    const gosterilenSonuc = isDogru ? gercekSonuc : gercekSonuc + rastgele(-3, 3) || gercekSonuc + 1;
    
    setIslem(`${num1} ⊕ ${num2} ≡ ${gosterilenSonuc}`);
    setDogruMu(isDogru);
    setMesaj('Kozmik denklem dengede mi?');
    setPhase('play');
  }, [seviye]);

  const secimYap = (kullaniciSecimi) => {
    if (phase !== 'play') return;
    
    if (kullaniciSecimi === dogruMu) {
      const yeniSeviye = seviye + 1;
      const yeniSkor = skor + 10;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(15);
      oyunGuncelle({ mSeviye: yeniSeviye, mSkor: yeniSkor });
      baslatOyunu(yeniSeviye);
    } else {
      setMesaj(`Yanlış! Doğru cevap ${dogruMu ? 'DOĞRU' : 'YANLIŞ'} olacaktı.`);
      setPhase('idle');
      hataYap();
      oyunGuncelle({ mSeviye: seviye, mSkor: skor });
    }
  };

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>⚡ Kozmik Denklem</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Kozmik Denklem</h2>
            <p>Yabancı sembollerle (⊕ toplama) kurulan enerji denklemi doğru mu?</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            {phase === 'play' && (
              <>
                <div style={{ fontSize: '45px', fontWeight: '800', margin: '40px 0', letterSpacing: '2px' }}>
                  {islem}
                </div>
                <div className="oyun-secenekleri">
                  <button className="secenek yesil-btn" style={{ fontSize: '24px' }} onClick={() => secimYap(true)}>DOĞRU</button>
                  <button className="secenek kirmizi-btn" style={{ fontSize: '24px' }} onClick={() => secimYap(false)}>YANLIŞ</button>
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
