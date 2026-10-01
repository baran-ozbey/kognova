import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Scales puzzle: two sides shown with weights, add one weight to balance
const AGIRLIKLAR = [1, 2, 3, 4, 5, 6, 7, 8, 10];

export default function TartıOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.trtSeviye ?? 1);
  const [skor, setSkor]     = useState(state.trtSkor ?? 0);

  const [sol, setSol]           = useState([]);
  const [sag, setSag]           = useState([]);
  const [eksikTaraf, setEksik]  = useState('sag');
  const [dogruAgirlik, setDogru] = useState(0);
  const [secenekler, setSec]    = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Dengeyi kur!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const count = Math.min(1 + Math.floor(sv / 2), 4);
    const solArr = Array.from({ length: count }, () => AGIRLIKLAR[rastgele(0, AGIRLIKLAR.length - 1)]);
    const sagArr = Array.from({ length: count - 1 }, () => AGIRLIKLAR[rastgele(0, AGIRLIKLAR.length - 1)]);
    const solToplam = solArr.reduce((a, b) => a + b, 0);
    const sagToplam = sagArr.reduce((a, b) => a + b, 0);
    const eksik = solToplam - sagToplam;

    if (eksik <= 0 || eksik > 15) { baslatOyunu(sv); return; }

    const yanlis = new Set();
    while (yanlis.size < 3) {
      const r = eksik + rastgele(-3, 3);
      if (r > 0 && r !== eksik) yanlis.add(r);
    }

    setSol(solArr); setSag(sagArr);
    setEksik('sag');
    setDogru(eksik);
    setSec([eksik, ...[...yanlis]].sort(() => 0.5 - Math.random()));
    setMesaj('Sağ tarafa hangi ağırlık eklenmeli?');
    setPhase('play');
  }, [seviye]);

  const sec = (val) => {
    if (phase !== 'play') return;
    if (val === dogruAgirlik) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ trtSeviye: ys, trtSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj(`Yanlış! Eksik ağırlık ${dogruAgirlik} kg idi.`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ trtSeviye: seviye, trtSkor: skor });
    }
  };

  const ScaleSide = ({ items, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: 1 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {items.map((w, i) => (
          <div key={i} style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 700 }}>{w}</div>
        ))}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#22d3ee' }}>{items.reduce((a, b) => a + b, 0)}</div>
    </div>
  );

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>⚖️ Evren Terazisi</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Evren Terazisi</h2>
          <p>İki tarafı dengelemek için sağ tarafa hangi ağırlık eklenmelidir?</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ display: 'flex', gap: 20, width: '100%', marginBottom: 20, alignItems: 'flex-end' }}>
                <ScaleSide items={sol} label="SOL" />
                <div style={{ fontSize: 32 }}>⚖️</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', letterSpacing: 1 }}>SAĞ + ?</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {sag.map((w, i) => (
                      <div key={i} style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 700 }}>{w}</div>
                    ))}
                    <div style={{ borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 700, border: '2px dashed #8b5cf6', color: '#8b5cf6' }}>?</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#22d3ee' }}>{sag.reduce((a, b) => a + b, 0)} + ?</div>
                </div>
              </div>
              <div className="cevaplar">
                {secenekler.map((s, i) => (
                  <button key={i} className="cevap" onClick={() => sec(s)} style={{ fontSize: 20 }}>{s}</button>
                ))}
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton yesil-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
