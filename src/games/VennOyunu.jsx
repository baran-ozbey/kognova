import React, { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { rastgele } from '../utils';

// Venn diagram logic: two overlapping circles with items; find item in intersection
const KATEGORILER = [
  { a: 'Meyveler', b: 'Kırmızı Şeyler', itemsA: ['🍌','🍇','🥝','🍈'], itemsB: ['🚗','🔴','🎈'], both: ['🍎','🍓','🍒'] },
  { a: 'Uçabilen', b: '4 Bacaklı', itemsA: ['✈️','🚁','🪁'], itemsB: ['🐮','🐖','🐕'], both: ['🦅','🦆','🦉'] },
  { a: 'Yuvarlak', b: 'Yenilebilir', itemsA: ['🌙','💫','⭕'], itemsB: ['🥕','🥦','🥚'], both: ['🍊','🍉','🍇'] },
  { a: 'Müzik Aleti', b: 'Üflenerek Çalınan', itemsA: ['🥁','🎹','🎸'], itemsB: ['🎺','📯'], both: ['🎷','🪘'] },
];

export default function VennOyunu({ onBack }) {
  const { state, xpEkle, hataYap, oyunGuncelle } = useGame();
  const [seviye, setSeviye] = useState(state.vnSeviye ?? 1);
  const [skor, setSkor]     = useState(state.vnSkor ?? 0);

  const [kategori, setKategori]   = useState(null);
  const [secenekler, setSec]      = useState([]);
  const [dogruSet, setDogruSet]   = useState(new Set());
  const [phase, setPhase]         = useState('idle');
  const [mesaj, setMesaj]         = useState('İki kategoriye de ait olanı bul!');

  const baslatOyunu = useCallback((sv = seviye) => {
    const kat = KATEGORILER[rastgele(0, KATEGORILER.length - 1)];
    const dogru = kat.both[rastgele(0, kat.both.length - 1)];
    const yanlis = [
      kat.itemsA[rastgele(0, kat.itemsA.length - 1)],
      kat.itemsB[rastgele(0, kat.itemsB.length - 1)],
      kat.itemsA[rastgele(0, kat.itemsA.length - 1)],
    ].filter((x, i, a) => a.indexOf(x) === i && x !== dogru).slice(0, 3);

    setKategori(kat);
    setSec([dogru, ...yanlis].sort(() => 0.5 - Math.random()));
    setDogruSet(new Set([dogru]));
    setMesaj(`Hem "${kat.a}" hem "${kat.b}" olan hangisi?`);
    setPhase('play');
  }, [seviye]);

  const sec = (val) => {
    if (phase !== 'play') return;
    if (dogruSet.has(val)) {
      const ys = seviye + 1, ySk = skor + 10;
      setSeviye(ys); setSkor(ySk);
      xpEkle(15); oyunGuncelle({ vnSeviye: ys, vnSkor: ySk });
      baslatOyunu(ys);
    } else {
      setMesaj(`Yanlış! Her iki kategoriye de ait değil.`);
      setPhase('idle');
      hataYap(); oyunGuncelle({ vnSeviye: seviye, vnSkor: skor });
    }
  };

  return (
    <div className="screen"><div className="oyun">
      <div className="ust">
        <strong>🔵 Kesişim Noktası</strong>
        <button className="geri" onClick={onBack}>← Menü</button>
      </div>
      <div className="oyun-kart">
        <div className="oyun-baslik">
          <h2>Kesişim Noktası</h2>
          <p>İki kategorinin kesiştiği noktaya ait nesneyi bul.</p>
        </div>
        <div className="skor">
          <span>Seviye <strong>{seviye}</strong></span>
          <span>Skor <strong>{skor}</strong></span>
        </div>
        <div className="oyun-alani">
          {phase === 'play' && kategori && (
            <>
              {/* Venn visual */}
              <div style={{ position: 'relative', width: 220, height: 100, marginBottom: 20 }}>
                <div style={{ position: 'absolute', left: 0, top: 5, width: 120, height: 90, borderRadius: '50%', border: '2px solid #22d3ee', background: '#22d3ee11', display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 11, color: '#22d3ee', fontWeight: 700 }}>
                  {kategori.a}
                </div>
                <div style={{ position: 'absolute', right: 0, top: 5, width: 120, height: 90, borderRadius: '50%', border: '2px solid #ec4899', background: '#ec489911', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12, fontSize: 11, color: '#ec4899', fontWeight: 700 }}>
                  {kategori.b}
                </div>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 20, color: '#ffffff60' }}>∩</div>
              </div>
              <div className="mesaj" style={{ marginBottom: 20 }}>{mesaj}</div>
              <div className="oyun-secenekleri">
                {secenekler.map((s, i) => (
                  <button key={i} className="secenek" onClick={() => sec(s)} style={{ fontSize: 28 }}>{s}</button>
                ))}
              </div>
            </>
          )}
          {phase === 'idle' && <div className="mesaj">{mesaj}</div>}
          {phase === 'idle' && <button className="buton mavi-btn" onClick={() => baslatOyunu()}>Başla</button>}
        </div>
      </div>
    </div></div>
  );
}
