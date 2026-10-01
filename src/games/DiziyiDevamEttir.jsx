import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Number sequence: show N numbers following a rule, player picks the next one
const RULES = [
  { ad: '+2', fn: (a) => a + 2 },
  { ad: '+3', fn: (a) => a + 3 },
  { ad: '×2', fn: (a) => a * 2 },
  { ad: '-1', fn: (a) => a - 1 },
  { ad: '+5', fn: (a) => a + 5 },
  { ad: '×3 küçük', fn: (a) => a + 4 },
];

export default function DiziyiDevamEttir({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.ddSeviye ?? 1);
  const [skor, setSkor]     = useState(state.ddSkor ?? 0);

  const [dizi, setDizi]         = useState([]);
  const [dogruCevap, setDogru]  = useState(0);
  const [secenekler, setSec]    = useState([]);
  const [phase, setPhase]       = useState('idle');
  const [mesaj, setMesaj]       = useState('Örüntüyü bul, eksik sayıyı tamamla!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const kural = RULES[rastgele(0, RULES.length - 1)];
    const uzunluk = Math.min(3 + Math.floor(sv / 2), 6);
    const baslangic = rastgele(1, 10);
    const seq = [baslangic];
    for (let i = 1; i <= uzunluk; i++) seq.push(kural.fn(seq[seq.length - 1]));
    const dogru = seq[seq.length - 1];
    setDizi(seq.slice(0, -1));
    setDogru(dogru);
    const yanlis = new Set();
    while (yanlis.size < 3) {
      const r = dogru + rastgele(-5, 5);
      if (r !== dogru) yanlis.add(r);
    }
    setSec([dogru, ...[...yanlis]].sort(() => 0.5 - Math.random()));
    setMesaj('Sıradaki sayı nedir?');
    setPhase('play');
  }, [seviye]);

  const sec = (val) => {
    if (phase !== 'play') return;
    if (val === dogruCevap) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ ddSeviye: ys, ddSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj(`Yanlış! Doğru cevap: ${dogruCevap}`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ ddSeviye: seviye, ddSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🔢 Zaman Dizisi</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Zaman Dizisi</h2>
          <p>Sayı dizisinin gizli kuralını çöz ve sıradaki sayıyı bul.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && (
            <>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
                {dizi.map((n, i) => (
                  <React.Fragment key={i}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#f9a8d4', minWidth: 40, textAlign: 'center' }}>{n}</div>
                    {i < dizi.length - 1 && <span style={{ color: '#ffffff40', fontSize: 20 }}>→</span>}
                  </React.Fragment>
                ))}
                <span style={{ color: '#ffffff40', fontSize: 20 }}>→</span>
                <div style={{ width: 48, height: 48, borderRadius: 12, border: '3px dashed #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#8b5cf6' }}>?</div>
              </div>
              <div className="cevaplar">
                {secenekler.map((s, i) => (
                  <button key={i} className="cevap" onClick={() => sec(s)} style={{ fontSize: 22 }}>{s}</button>
                ))}
              </div>
            </>
          )}
          <div className="mesaj">{mesaj}</div>
          {phase === 'idle' && <button className="buton turuncu-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
