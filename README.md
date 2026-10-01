# 🧠 KogNova

> Beyninin sınırlarını zorla. 32 özgün meydan okuma.

**KogNova**, 32 farklı beyin egzersizi oyunundan oluşan bir web uygulamasıdır. React + Vite ile geliştirilmiştir.

## 🎮 Oyunlar (32 Adet)

| # | Oyun | Açıklama |
|---|------|----------|
| 1 | 🌌 Anlık Evren | Evrenin değişen düzenini hafızanda tut |
| 2 | 🚦 Zihin Trafiği | Sayıları doğru yönde yakala |
| 3 | 👤 Silüet Avcısı | Nesneyi sadece gölgesinden tanı |
| 4 | 🌀 Beyin Sabotajı | Değişen kurallara anında uyum sağla |
| 5 | 🔮 Örüntü Avcısı | Gizli düzeni keşfet |
| 6 | 🧬 DNA Kodu | Kodu kaybolmadan önce ezberle |
| 7 | 🧠 Nöron Eşleşmesi | Kozmik sinapsları birbiriyle eşle |
| 8 | 🌌 Frekans Kırılması | Enerjinin rengine odaklan, ismine değil |
| 9 | ⚡ Kozmik Denklem | Yabancı sembollerle enerjiyi dengele |
| 10 | 👁️ Kozmik Sapma | Paralel evrendeki tek farklılığı bul |
| 11 | 🪐 Yörünge Hafızası | Gezegenlerin titreşim sırasını hatırla |
| 12 | 🔐 Kuantum Kilidi | Karanlık madde koordinatlarını çöz |
| 13 | 🧬 Zihin Şifreleri | Dağılmış boyut parçalarını birleştir |
| 14 | ✨ Yıldız Tozu Avı | Kaosun içindeki hedef enerjiyi say |
| 15 | 🪞 Ayna Boyutu | Sol yarının aynasını sağ tarafa çiz |
| 16 | 🎵 Ritim Frekansı | Evrenin titreşim desenini ezberle |
| 17 | 💻 Galaktik Kod | İkili kodu ondalığa çevir |
| 18 | 🔢 Zaman Dizisi | Gizli kuralı bul, sıradaki sayıyı seç |
| 19 | 🎯 Astro Hedef | Süzülen enerji küresine zamanında tıkla |
| 20 | 📐 Kozmik Açı | Yıldızlar arasındaki açıyı tahmin et |
| 21 | ⚖️ Evren Terazisi | İki tarafı dengeleyecek ağırlığı bul |
| 22 | 🔄 Uzamsal Rotasyon | Şeklin döndürülmüş halini seç |
| 23 | ⚡ Nöral Tepki | Kelimeyi değil, rengini görüp tepki ver |
| 24 | 🕰️ Zaman Okuması | Kozmik saatin gösterdiği zamanı oku |
| 25 | 🎭 Sembol Denklemleri | Her sembol bir değer — denklemi çöz! |
| 26 | 🔵 Kesişim Noktası | İki kategoriye birden ait olanı bul |
| 27 | 🗺️ Galaksi Yolu | Işıklı yolu ezberle, karanlıkta çiz |
| 28 | 🧩 Anomali Tespiti | Mantıkça gruba uymayan öğeyi bul |
| 29 | 🌈 Spektrum Sıralaması | Tonları koyudan açığa doğru sırala |
| 30 | 🌠 Düşen Sayılar | Kurala uygun sayılara dokun, ötekine hayır |
| 31 | 🔁 N-Geri Protokolü | Sinyal N adım öncekiyle aynı mı? |
| 32 | 🧭 Kozmik Pusula | Uzaysal dönüşleri takip edip yönü bul |

## 🚀 Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## 🌐 GitHub Pages'e Deploy

1. Repoyu GitHub'a push edin
2. **Settings → Pages → Source** kısmında **GitHub Actions** seçin
3. Her `main` branch push'unda otomatik olarak deploy olur

> **Not:** `vite.config.js` içindeki `base` değerini kendi repo adınızla eşleştirin.  
> Örnek: Repo adı `kognova` ise `base: '/kognova/'` olmalı.

## 🛠️ Teknoloji

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- Vanilla CSS (glassmorphism + dark mode)
- GitHub Actions CI/CD
- LocalStorage ile ilerleme kaydetme

## 📁 Proje Yapısı

```
src/
├── App.jsx               # Ana router (32 oyun)
├── main.jsx              # ReactDOM entry
├── index.css             # Global stiller
├── utils.js              # Yardımcı fonksiyonlar & sabitler
├── context/
│   └── GameContext.jsx   # Global oyun state (XP, seri, istatistik)
├── components/
│   └── Toast.jsx         # Bildirim bileşeni
├── screens/
│   └── Menu.jsx          # Ana menü ekranı
└── games/
    ├── HaritaOyunu.jsx   # Anlık Evren
    ├── TrafikOyunu.jsx   # Zihin Trafiği
    ├── GolgeOyunu.jsx    # Silüet Avcısı
    ├── KuralOyunu.jsx    # Beyin Sabotajı
    ├── DesenOyunu.jsx    # Örüntü Avcısı
    ├── DnaOyunu.jsx      # DNA Kodu
    ├── HafizaOyunu.jsx   # Nöron Eşleşmesi
    ├── StroopOyunu.jsx   # Frekans Kırılması
    ├── MatematikOyunu.jsx# Kozmik Denklem
    ├── FarkiBulOyunu.jsx # Kozmik Sapma
    ├── SiralamaOyunu.jsx # Yörünge Hafızası
    ├── SifreCozucuOyunu.jsx # Kuantum Kilidi
    ├── KelimeOyunu.jsx   # Zihin Şifreleri
    ├── SaymacaOyunu.jsx  # Yıldız Tozu Avı
    ├── AynaOyunu.jsx     # Ayna Boyutu
    ├── TempoOyunu.jsx    # Ritim Frekansı
    ├── BinaryOyunu.jsx   # Galaktik Kod
    ├── DiziyiDevamEttir.jsx # Zaman Dizisi
    ├── HedefOyunu.jsx    # Astro Hedef
    ├── AciOyunu.jsx      # Kozmik Açı
    ├── TartıOyunu.jsx    # Evren Terazisi
    ├── RotasyonOyunu.jsx # Uzamsal Rotasyon
    ├── ReaksiyonOyunu.jsx# Nöral Tepki
    ├── SaatOyunu.jsx     # Zaman Okuması
    ├── EmojiMatematik.jsx# Sembol Denklemleri
    ├── VennOyunu.jsx     # Kesişim Noktası
    ├── YolHaritasiOyunu.jsx # Galaksi Yolu
    ├── TuhafOlanOyunu.jsx# Anomali Tespiti
    ├── RenkSiralamaOyunu.jsx # Spektrum Sıralaması
    ├── DusenSayilar.jsx  # Düşen Sayılar
    ├── NBakOyunu.jsx     # N-Geri Protokolü
    └── PusulaOyunu.jsx   # Kozmik Pusula
```

## 📄 Lisans

MIT
