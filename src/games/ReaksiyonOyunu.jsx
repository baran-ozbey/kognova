import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Type/tap reaction: a word appears, player must react correctly — YES (blue word) or NO (other colors)
// Twist: word color changes randomly; "DOĞRU" word might appear in red (trap)
const KELIMELER = ['DOĞRU', 'YANLIŞ', 'EVET', 'HAYIR', 'VAR', 'YOK'];
const RENKLER = ['#22d3ee', '#ef4444', '#f59e0b', '#10b981', '#a855f7'];

export default function ReaksiyonOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.rxSeviye ?? 1);
  const [skor, setSkor]     = useState(state.rxSkor ?? 0);

  const [kelime, setKelime]     = useState('');
  const [renk, setRenk]         = useState('#fff');
  const [hedefRenk, setHedefR]  = useState('#22d3ee'); // player must press YES only for this color
  const [zaman, setZaman]       = useState(100);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('');
  const [tur, setTur]           = useState(0);
  const timerRef = useRef(null);
  const aktifRef = useRef(false);

  const SURE = Math.max(3000 - seviye * 150, 1000);

  const baslatTur = useCallback((sv = seviye, hedef = hedefRenk) => {
    clearTimeout(timerRef.current);
    aktifRef.current = true;
    const k = KELIMELER[rastgele(0, KELIMELER.length - 1)];
    const r = RENKLER[rastgele(0, RENKLER.length - 1)];
    setKelime(k); setRenk(r);
    setZaman(100);
    setMesaj(`Sadece ${hedef === '#22d3ee' ? 'MAVİ' : 'KIRMIZI'} renkli kelime için EVET'e bas!`);
    setPhase('play');

    let prog = 100;
    const tick = 40;
    const step = (tick / SURE) * 100;
    const t = setInterval(() => {
      prog -= step;
      setZaman(Math.max(0, prog));
      if (prog <= 0) {
        clearInterval(t);
        if (!aktifRef.current) return;
        // Time up = should have been NO (non-target color)
        if (r !== hedef) {
          // correct — they didn't press
          nextTur(sv, hedef, true);
        } else {
          // missed YES
          aktifRef.current = false;
          setMesaj('Süre doldu! Basmana gerekiyordu.');
          setPhase('idle');
          hataYap(); oyunGuncelle({ rxSeviye: sv, rxSkor: skor });
        }
      }
    }, tick);
    timerRef.current = t;
  }, [seviye, hedefRenk, skor, SURE, hataYap, oyunGuncelle]);

  const nextTur = (sv, hedef, xpVer = false) => {
    aktifRef.current = false;
    clearTimeout(timerRef.current);
    if (xpVer) {
      const ys = sv + (tur % 5 === 4 ? 1 : 0);
      const ySk = skor + 10;
      if (tur % 5 === 4) { setSeviye(ys); oyunGuncelle({ rxSeviye: ys, rxSkor: ySk }); }
      setSkor(ySk);
      xpEkle(10);
    }
    setTur(t => t + 1);
    setTimeout(() => baslatTur(sv, hedef), 400);
  };

  const tepki = (evet) => {
    if (phase !== 'play' || !aktifRef.current) return;
    aktifRef.current = false;
    clearTimeout(timerRef.current);
    const dogru = evet ? (renk === hedefRenk) : (renk !== hedefRenk);
    if (dogru) {
      nextTur(seviye, hedefRenk, true);
    } else {
      setMesaj('Yanlış tepki! Rengi değil kelimeyi okudun 😵');
      setPhase('idle');
      hataYap(); oyunGuncelle({ rxSeviye: seviye, rxSkor: skor });
    }
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>⚡ Nöral Tepki</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Nöral Tepki</h2>
          <p>Kelimeyi değil, rengini görüp hızlıca doğru tepkiyi ver!</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ height: 4, width: '100%', background: '#ffffff15', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${zaman}%`, background: `hsl(${zaman * 1.2},80%,55%)`, transition: 'width 0.04s linear' }} />
              </div>
              <div style={{ fontSize: 46, fontWeight: 900, color: renk, marginBottom: 30, textShadow: `0 0 20px ${renk}` }}>
                {kelime}
              </div>
              <div style={{ display: 'flex', gap: 20, width: '100%' }}>
                <button className="buton mavi-btn" style={{ fontSize: 18 }} onClick={() => tepki(true)}>✅ EVET</button>
                <button className="buton kirmizi-btn" style={{ fontSize: 18 }} onClick={() => tepki(false)}>❌ HAYIR</button>
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && (
            <button className="buton" onClick={() => { setTur(0); baslatTur(seviye, hedefRenk); }}>Başla</button>
          )}
        </div>
      </div>
    </div></div>
  );
}
