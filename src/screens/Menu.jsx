import React from 'react';
import { useGame, seviyeHesapla } from '../context/GameContext';

const OYUNLAR = [
  // Orijinal 6
  { id: 'haritaOyunu',       ikon: '🌌', ad: 'Anlık Evren',       aciklama: 'Evrenin değişen düzenini hafızanda tut.',    renk: 'mor' },
  { id: 'trafikOyunu',       ikon: '🚦', ad: 'Zihin Trafiği',      aciklama: 'Sayıları doğru yönde yakala.',               renk: 'mavi' },
  { id: 'golgeOyunu',        ikon: '👤', ad: 'Silüet Avcısı',      aciklama: 'Nesneyi sadece gölgesinden tanı.',           renk: 'pembe' },
  { id: 'kuralOyunu',        ikon: '🌀', ad: 'Beyin Sabotajı',     aciklama: 'Değişen kurallara anında uyum sağla.',       renk: 'yesil' },
  { id: 'desenOyunu',        ikon: '🔮', ad: 'Örüntü Avcısı',      aciklama: 'Gizli düzeni keşfet.',                      renk: 'turuncu' },
  { id: 'dnaOyunu',          ikon: '🧬', ad: 'DNA Kodu',           aciklama: 'Kodu kaybolmadan önce ezberle.',             renk: 'sari' },
  // Önceki 8
  { id: 'hafizaOyunu',       ikon: '🧠', ad: 'Nöron Eşleşmesi',   aciklama: 'Kozmik sinapsları birbiriyle eşle.',         renk: 'mor' },
  { id: 'stroopOyunu',       ikon: '🌌', ad: 'Frekans Kırılması',  aciklama: 'Enerjinin rengine odaklan, ismine değil.',   renk: 'mavi' },
  { id: 'matematikOyunu',    ikon: '⚡',  ad: 'Kozmik Denklem',    aciklama: 'Yabancı sembollerle enerjiyi dengele.',      renk: 'pembe' },
  { id: 'farkiBulOyunu',     ikon: '👁️', ad: 'Kozmik Sapma',      aciklama: 'Paralel evrendeki tek farklılığı bul.',      renk: 'yesil' },
  { id: 'siralamaOyunu',     ikon: '🪐', ad: 'Yörünge Hafızası',   aciklama: 'Gezegenlerin titreşim sırasını hatırla.',    renk: 'mavi' },
  { id: 'sifreCozucuOyunu',  ikon: '🔐', ad: 'Kuantum Kilidi',     aciklama: 'Karanlık madde koordinatlarını çöz.',        renk: 'turuncu' },
  { id: 'kelimeOyunu',       ikon: '🧬', ad: 'Zihin Şifreleri',    aciklama: 'Dağılmış boyut parçalarını birleştir.',      renk: 'mor' },
  { id: 'saymacaOyunu',      ikon: '✨', ad: 'Yıldız Tozu Avı',    aciklama: 'Kaosun içindeki hedef enerjiyi say.',        renk: 'sari' },
  // Yeni 16
  { id: 'aynaOyunu',         ikon: '🪞', ad: 'Ayna Boyutu',        aciklama: 'Sol yarının aynasını sağ tarafa çiz.',       renk: 'mavi' },
  { id: 'tempoOyunu',        ikon: '🎵', ad: 'Ritim Frekansı',     aciklama: 'Evrenin titreşim desenini ezberle.',         renk: 'pembe' },
  { id: 'binaryOyunu',       ikon: '💻', ad: 'Galaktik Kod',       aciklama: 'İkili kodu ondalığa çevir.',                renk: 'yesil' },
  { id: 'diziyiDevamEttir',  ikon: '🔢', ad: 'Zaman Dizisi',       aciklama: 'Gizli kuralı bul, sıradaki sayıyı seç.',    renk: 'turuncu' },
  { id: 'hedefOyunu',        ikon: '🎯', ad: 'Astro Hedef',        aciklama: 'Süzülen enerji küresine zamanında tıkla.',   renk: 'kirmizi' },
  { id: 'iziSurOyunu',       ikon: '📐', ad: 'Kozmik Açı',         aciklama: 'Yıldızlar arasındaki açıyı tahmin et.',     renk: 'sari' },
  { id: 'tartiOyunu',        ikon: '⚖️', ad: 'Evren Terazisi',     aciklama: 'İki tarafı dengeleyecek ağırlığı bul.',     renk: 'mor' },
  { id: 'rotasyonOyunu',     ikon: '🔄', ad: 'Uzamsal Rotasyon',   aciklama: 'Şeklin döndürülmüş halini seç.',            renk: 'mavi' },
  { id: 'reaksiyonOyunu',    ikon: '⚡',  ad: 'Nöral Tepki',        aciklama: 'Kelimeyi değil, rengini görüp tepki ver.',  renk: 'kirmizi' },
  { id: 'saatOyunu',         ikon: '🕰️', ad: 'Zaman Okuması',      aciklama: 'Kozmik saatin gösterdiği zamanı oku.',      renk: 'yesil' },
  { id: 'emojiMatematik',    ikon: '🎭', ad: 'Sembol Denklemleri', aciklama: 'Her sembol bir değer — denklemi çöz!',       renk: 'turuncu' },
  { id: 'vennOyunu',         ikon: '🔵', ad: 'Kesişim Noktası',    aciklama: 'İki kategoriye birden ait olanı bul.',       renk: 'mavi' },
  { id: 'yolHaritasiOyunu',  ikon: '🗺️', ad: 'Galaksi Yolu',      aciklama: 'Işıklı yolu ezberle, karanlıkta çiz.',      renk: 'sari' },
  { id: 'tuhafOlanOyunu',    ikon: '🧩', ad: 'Anomali Tespiti',    aciklama: 'Mantıkça gruba uymayan ögeyî bul.',          renk: 'pembe' },
  { id: 'renkSiralamaOyunu', ikon: '🌈', ad: 'Spektrum Sıralaması',aciklama: 'Tonları koyudan açığa doğru sırala.',       renk: 'mor' },
  { id: 'dusenSayilar',      ikon: '🌠', ad: 'Düşen Sayılar',      aciklama: 'Kurala uygun sayılara dokun, ötekine hayır.',renk: 'mavi' },
  { id: 'nBakOyunu',         ikon: '🔁', ad: 'N-Geri Protokolü',   aciklama: 'Sinyal N adım öncekiyle aynı mı?',          renk: 'yesil' },
  // 32. Oyun
  { id: 'pusulaOyunu',       ikon: '🧭', ad: 'Kozmik Pusula',      aciklama: 'Uzaysal dönüşleri takip edip yönü bul.',     renk: 'turuncu' },
];

const DAL_BILGI = [
  { cls: 'dal-1', ikon: '🧠', ad: 'Anlık Evren',   id: 'haritaOyunu' },
  { cls: 'dal-2', ikon: '🔢', ad: 'Zihin Trafiği', id: 'trafikOyunu' },
  { cls: 'dal-3', ikon: '🌑', ad: 'Silüet Avcısı', id: 'golgeOyunu' },
  { cls: 'dal-4', ikon: '🌀', ad: 'Sabotaj',        id: 'kuralOyunu' },
  { cls: 'dal-5', ikon: '🔮', ad: 'Örüntü',         id: 'desenOyunu' },
  { cls: 'dal-6', ikon: '🧬', ad: 'DNA Kodu',       id: 'dnaOyunu' },
];

export default function Menu({ onOyunSec }) {
  const { state } = useGame();
  const { seviye, ilerlemePct, kalan } = seviyeHesapla(state.xp);
  const basari = state.cevap > 0 ? Math.round((state.dogru / state.cevap) * 100) : 0;

  return (
    <div className="screen">
      <div className="baslangic">
        <span className="buyuk-logo">🧠</span>
        <h1>KogNova</h1>
        <p>Beyninin sınırlarını zorla. 32 özgün meydan okuma.</p>
      </div>

      <div className="icerik">
        {/* --- Profil --- */}
        <div className="profil">
          <h2>Zihin Seviyesi <span>{seviye}</span></h2>
          <p>Sonraki seviyeye {kalan} XP kaldı</p>
          <div className="seviye-bar">
            <div className="seviye-dolgu" style={{ width: `${ilerlemePct}%` }} />
          </div>
          <div className="istatistik">
            <div><strong>{state.xp}</strong><span>XP</span></div>
            <div><strong>{state.seri}</strong><span>Seri</span></div>
            <div><strong>{basari}%</strong><span>Başarı</span></div>
          </div>
        </div>

        {/* --- Harita --- */}
        <h2 className="baslik">🌌 Zihin Haritası</h2>
        <div className="harita" role="navigation" aria-label="Oyun haritası">
          {/* Yıldızlar */}
          <div className="yildiz" style={{ left: '10%', top: '12%', animationDelay: '0s' }}>✦</div>
          <div className="yildiz" style={{ left: '75%', top: '8%',  animationDelay: '1s' }}>✦</div>
          <div className="yildiz" style={{ left: '88%', top: '45%', animationDelay: '0.5s' }}>·</div>
          <div className="yildiz" style={{ left: '18%', top: '55%', animationDelay: '1.5s' }}>·</div>
          <div className="yildiz" style={{ left: '52%', top: '65%', animationDelay: '2s' }}>✦</div>
          {/* Yollar */}
          <div className="yol yol-1" />
          <div className="yol yol-2" />
          <div className="yol yol-3" />
          <div className="yol yol-4" />
          {/* Dallar */}
          {DAL_BILGI.map(d => (
            <button
              key={d.id}
              className={`dal ${d.cls}`}
              onClick={() => onOyunSec(d.id)}
              aria-label={d.ad}
            >
              {d.ikon}
              <span>{d.ad}</span>
            </button>
          ))}
        </div>

        {/* --- Hızlı Oyunlar --- */}
        <h2 className="baslik">⚡ Hızlı Oyunlar</h2>
        <div className="kartlar">
          {OYUNLAR.map(o => (
            <button
              key={o.id}
              className={`kart ${o.renk}`}
              onClick={() => onOyunSec(o.id)}
            >
              <div className="ikon">{o.ikon}</div>
              <h3>{o.ad}</h3>
              <p>{o.aciklama}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
