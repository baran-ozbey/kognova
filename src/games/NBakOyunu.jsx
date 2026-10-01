import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// N-back task: show a letter every second. Player must say if the CURRENT letter matches the one N steps ago
const HARFLER = ['A','B','C','D','E','F','G','H','K','L','M','N'];

export default function NBakOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.nbSeviye ?? 1);
  const [skor, setSkor]     = useState(state.nbSkor ?? 0);

  const N = Math.min(1 + Math.floor(seviye / 3), 3);
  const [gecmis, setGecmis]   = useState([]);
  const [mevcut, setMevcut]   = useState('');
  const [tur, setTur]         = useState(0);
  const [phase, setPhase]     = useState('idle');
  const [mesaj, setMesaj]     = useState('');
  const [cevapVerildi, setCevapVerildi] = useState(false);
  const intervalRef = useRef(null);
  const gecmisRef   = useRef([]);
  const phaseRef    = useRef('idle');
  const cevRef      = useRef(false);

  const temizle = () => clearInterval(intervalRef.current);

  const baslatOyunu = useCallback((sv = seviye) => {
    temizle();
    gecmisRef.current = [];
    phaseRef.current = 'play';
    cevRef.current = true;
    setGecmis([]); setTur(0); setCevapVerildi(true);
    setPhase('play');
    setMesaj(`${N}-Geri: Şu anki harf, tam ${N} adım öncekiyle aynı mı?`);

    intervalRef.current = setInterval(() => {
      if (phaseRef.current !== 'play') return;
      
      // If they missed answering the previous one, and it was answerable
      if (!cevRef.current && gecmisRef.current.length > N) {
         hataYap();
         oyunGuncelle({ nbSeviye: seviye, nbSkor: skor });
      }

      const harf = HARFLER[rastgele(0, HARFLER.length - 1)];
      gecmisRef.current = [...gecmisRef.current, harf];
      setGecmis([...gecmisRef.current]);
      setMevcut(harf);
      
      // Allow answer only if we have enough history
      if (gecmisRef.current.length > N) {
        cevRef.current = false;
        setCevapVerildi(false);
      } else {
        cevRef.current = true;
        setCevapVerildi(true);
      }
      
      setTur(t => t + 1);
    }, 2000);
  }, [seviye, N, hataYap, oyunGuncelle, skor]);

  useEffect(() => () => temizle(), []);

  const yanit = (evet) => {
    if (phase !== 'play' || cevRef.current) return;
    cevRef.current = true;
    setCevapVerildi(true);

    const gecmisArr = gecmisRef.current;
    const nOnceki = gecmisArr.length > N ? gecmisArr[gecmisArr.length - 1 - N] : null;
    const gercekEslesme = nOnceki === gecmisArr[gecmisArr.length - 1];
    const dogru = evet === gercekEslesme;

    if (dogru) {
      const ySk = skor + 10;
      setSkor(ySk);
      xpEkle(10);
      oyunGuncelle({ nbSeviye: seviye, nbSkor: ySk });
      setMesaj('Doğru!');
    } else {
      hataYap();
      oyunGuncelle({ nbSeviye: seviye, nbSkor: skor });
      setMesaj('Yanlış!');
    }
  };

  const dur = () => {
    phaseRef.current = 'idle';
    setPhase('idle');
    temizle();
    const ys = seviye + 1;
    setSeviye(ys);
    oyunGuncelle({ nbSeviye: ys, nbSkor: skor });
    setMesaj(`Oyun bitti! Sonraki Seviye: ${ys}`);
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🔁 N-Geri Protokolü</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>N-Geri Protokolü</h2>
          <p>Şu anki sinyal, tam <strong>{N}</strong> adım öncekiyle aynı mı? Hızla karar ver!</p>
        </div>
        <div className="skor">
          <span>N = <strong>{N}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              {/* History strip */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                {gecmis.slice(-8).map((h, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i === gecmis.slice(-8).length - N - 1 ? '#f59e0b44' : '#ffffff12', border: i === gecmis.slice(-8).length - N - 1 ? '1px solid #f59e0b' : '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#ddd' }}>{h}</div>
                ))}
              </div>

              {/* Current */}
              <div style={{ fontSize: 72, fontWeight: 900, color: '#22d3ee', marginBottom: 24, textShadow: '0 0 30px #22d3ee' }}>
                {mevcut || '?'}
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <button className="buton yesil-btn" style={{ opacity: cevapVerildi ? 0.4 : 1 }} onClick={() => yanit(true)} disabled={cevapVerildi}>✅ AYNI</button>
                <button className="buton kirmizi-btn" style={{ opacity: cevapVerildi ? 0.4 : 1 }} onClick={() => yanit(false)} disabled={cevapVerildi}>❌ FARKLI</button>
              </div>
              <button onClick={dur} style={{ marginTop: 16, padding: '8px 20px', background: '#ffffff12', borderRadius: 10, color: 'white', cursor: 'pointer' }}>Bitir</button>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
