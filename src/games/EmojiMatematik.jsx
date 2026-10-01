import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Emoji math: simple arithmetic using emoji icons as numbers
const EMOJI_NUMS = ['🔴','🟡','🟢','🔵','🟣'];

export default function EmojiMatematik({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.emSeviye ?? 1);
  const [skor, setSkor]     = useState(state.emSkor ?? 0);

  const [denklem, setDenklem]   = useState('');
  const [emojiDeger, setEmoji]  = useState({});
  const [dogruSonuc, setDogru]  = useState(0);
  const [secenekler, setSec]    = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Her emoji bir sayıyı temsil ediyor!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const adet = Math.min(2 + Math.floor(sv / 3), 4);
    const emojis = [...EMOJI_NUMS].sort(() => 0.5 - Math.random()).slice(0, adet);
    const degerler = {};
    emojis.forEach(e => { degerler[e] = rastgele(1, 9); });

    // Build a 2-operand expression
    const a = emojis[rastgele(0, emojis.length - 1)];
    const b = emojis[rastgele(0, emojis.length - 1)];
    const op = ['+', '-', '+'][rastgele(0, 2)];
    let sonuc = op === '+' ? degerler[a] + degerler[b] : degerler[a] - degerler[b];

    // Build hint lines (each emoji = value)
    const ipuclari = emojis.map(e => `${e} = ${degerler[e]}`).join('  ');
    const dk = `${a} ${op} ${b} = ?`;

    const yanlis = new Set();
    while (yanlis.size < 3) {
      const r = sonuc + rastgele(-3, 3);
      if (r !== sonuc) yanlis.add(r);
    }

    setEmoji(degerler);
    setDenklem(dk);
    setDogru(sonuc);
    setSec([sonuc, ...[...yanlis]].sort(() => 0.5 - Math.random()));
    setMesaj(ipuclari);
    setPhase('play');
  }, [seviye]);

  const sec = (val) => {
    if (phase !== 'play') return;
    if (val === dogruSonuc) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ emSeviye: ys, emSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj(`Yanlış! Cevap: ${dogruSonuc}`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ emSeviye: seviye, emSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🎭 Sembol Denklemleri</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Sembol Denklemleri</h2>
          <p>Her sembol bir değeri temsil eder. İpuçlarını kullanarak denklemi çöz!</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ background: '#ffffff08', borderRadius: 14, padding: '12px 18px', marginBottom: 16, textAlign: 'center', lineHeight: 2, fontSize: 15 }}>
                {mesaj}
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 24, letterSpacing: 4 }}>
                {denklem}
              </div>
              <div className="cevaplar">
                {secenekler.map((s, i) => (
                  <button key={i} className="cevap" onClick={() => sec(s)} style={{ fontSize: 22 }}>{s}</button>
                ))}
              </div>
            </>
          )}
          {phase === 'idle' && <div className="mesaj">{mesaj}</div>}
          {phase === 'idle' && <button className="buton pembe-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
