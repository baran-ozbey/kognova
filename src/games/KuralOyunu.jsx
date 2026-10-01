import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { RENKLER, RENK_ISIMLERI, rastgele } from '../utils';

export default function KuralOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye]   = useState(state.kSeviye);
  const [skor, setSkor]       = useState(state.kSkor);
  const [dogruMu, setDogruMu] = useState(false);
  const [sembolMetin, setSembolMetin] = useState('Yükleniyor...');
  const [sembolRenk, setSembolRenk]   = useState('#fff');
  const [mesaj, setMesaj]     = useState('Yazının rengi ile yazan kelime aynı mı?');
  const [phase, setPhase]     = useState('idle');

  const baslatOyunu = useCallback((seviyeOverride) => {
    const dm = Math.random() > 0.5;
    setDogruMu(dm);
    const ri = rastgele(0, RENKLER.length - 1);
    let ii = dm ? ri : rastgele(0, RENK_ISIMLERI.length - 1);
    if (!dm && ri === ii) ii = (ii + 1) % RENK_ISIMLERI.length;
    setSembolMetin(RENK_ISIMLERI[ii]);
    setSembolRenk(RENKLER[ri]);
    setMesaj('Yazının RENGİ ile yazılan KELİME aynı mı?');
    setPhase('play');
  }, []);

  const kuralCevap = useCallback((k) => {
    if (phase !== 'play') return;
    if (k === dogruMu) {
      const yeniSeviye = seviye + 1;
      const yeniSkor   = skor + 15;
      setSeviye(yeniSeviye);
      setSkor(yeniSkor);
      xpEkle(20);
      oyunGuncelle({ kSeviye: yeniSeviye, kSkor: yeniSkor });
      baslatOyunu(yeniSeviye);
    } else {
      setMesaj('Kafan karıştı! Hata yaptın.');
      setPhase('idle');
      hataYap();
      oyunGuncelle({ kSeviye: seviye, kSkor: skor });
    }
  }, [phase, dogruMu, seviye, skor, xpEkle, hataYap, oyunGuncelle, baslatOyunu]);

  return (
    <div className="screen">
      <div className="oyun">
        <div className="ust">
          <strong>🌀 Beyin Sabotajı</strong>
          <button className="geri" onClick={onBack}>← Menü</button>
        </div>
        <div className="oyun-kart">
          <div className="oyun-baslik">
            <h2>Beyin Sabotajı</h2>
            <p>Kurala güvenme. Kural değişebilir.</p>
          </div>
          <div className="skor">
            <span>Seviye <strong>{seviye}</strong></span>
            <span>Skor <strong>{skor}</strong></span>
          </div>
          <div className="oyun-alani">
            <div className="kural-kutu">{mesaj}</div>
            <div className="kural-sembol" style={{ color: sembolRenk }}>
              {sembolMetin}
            </div>
            {phase === 'play' && (
              <div className="secimler">
                <button className="buton yesil-btn" onClick={() => kuralCevap(true)}>✅ Doğru</button>
                <button className="buton kirmizi-btn" onClick={() => kuralCevap(false)}>❌ Yanlış</button>
              </div>
            )}
            {phase === 'idle' && (
              <button className="buton" onClick={() => baslatOyunu()}>
                {sembolMetin === 'Yükleniyor...' ? 'Başla' : 'Tekrar Dene'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
