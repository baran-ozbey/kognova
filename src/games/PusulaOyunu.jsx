import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

const YONLER = [
  { ad: 'KUZEY', aci: 0, ikon: '⬆️' },
  { ad: 'DOĞU', aci: 90, ikon: '➡️' },
  { ad: 'GÜNEY', aci: 180, ikon: '⬇️' },
  { ad: 'BATI', aci: 270, ikon: '⬅️' },
];

export default function PusulaOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.pusSeviye ?? 1);
  const [skor, setSkor]     = useState(state.pusSkor ?? 0);

  const [baslangic, setBaslangic] = useState(null);
  const [rotalar, setRotalar]     = useState([]);
  const [dogruYon, setDogru]      = useState(null);
  const [phase, setPhase]         = useState('idle');
  const [mesaj, setMesaj]         = useState('Gemi başlangıç yönünden yola çıkıyor. Manevraları takip edip son baktığı yönü bul!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const bas = YONLER[rastgele(0, 3)];
    const adimSayisi = Math.min(2 + Math.floor(sv / 2), 6);
    const rotaList = [];
    let currentAci = bas.aci;

    for (let i = 0; i < adimSayisi; i++) {
      const yonDegisim = rastgele(0, 1) === 0 ? 90 : -90; // Sağ (90) veya Sol (-90)
      let donus = yonDegisim === 90 ? (rastgele(0, 1) === 0 ? 'SAĞA 90°' : 'SAĞA ÇEYREK') : (rastgele(0, 1) === 0 ? 'SOLA 90°' : 'SOLA ÇEYREK');
      
      // Zorluk artarsa 180 derece dönüşler eklenebilir
      if (sv > 4 && rastgele(0, 2) === 0) {
        const yari = rastgele(0, 1) === 0 ? 180 : -180;
        donus = 'GERİYE DÖN (180°)';
        currentAci += yari;
      } else {
        currentAci += yonDegisim;
      }

      rotaList.push(donus);
    }

    currentAci = ((currentAci % 360) + 360) % 360; // Pozitif ve 0-359 arası
    const sonucYon = YONLER.find(y => y.aci === currentAci);

    setBaslangic(bas);
    setRotalar(rotaList);
    setDogru(sonucYon);
    setPhase('play');
    setMesaj('Son durumda gemi hangi yöne bakıyor?');
  }, [seviye]);

  const sec = (secilen) => {
    if (phase !== 'play') return;
    if (secilen.ad === dogruYon.ad) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ pusSeviye: ys, pusSkor: ySk });
      setMesaj('Doğru rota! 🧭');
      setPhase('idle');
      setTimeout(() => baslatOyunu(ys), 1200);
    } else {
      setMesaj(`Yanlış! Gemi ${dogruYon.ad} yönüne bakıyordu.`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ pusSeviye: seviye, pusSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🧭 Kozmik Pusula</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Kozmik Pusula</h2>
          <p>Gemi önce <strong>Başlangıç</strong> yönüne bakıyor. Manevralar bitince hangi yöne baktığını bul.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && baslangic && (
            <>
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, letterSpacing: 2 }}>BAŞLANGIÇ YÖNÜ</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#22d3ee', textShadow: '0 0 15px #22d3ee' }}>
                  {baslangic.ad} {baslangic.ikon}
                </div>
              </div>

              <div style={{ background: '#ffffff0a', border: '1px solid #ffffff1a', borderRadius: 16, padding: '15px 25px', marginBottom: 25, width: '100%' }}>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12, textAlign: 'center', letterSpacing: 1 }}>MANEVRALAR (Sırayla Uygula)</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rotalar.map((r, i) => (
                    <li key={i} style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#8b5cf6', minWidth: '24px' }}>{i + 1}.</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="oyun-secenekleri">
                {YONLER.map((y, i) => (
                  <button key={i} className="secenek" onClick={() => sec(y)} style={{ fontSize: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 26 }}>{y.ikon}</span>
                    {y.ad}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton mavi-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
