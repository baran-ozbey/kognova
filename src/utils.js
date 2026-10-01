export const NESNELER = [
  {ikon:"🍎",ad:"Elma"}, {ikon:"🚗",ad:"Araba"}, {ikon:"🚲",ad:"Bisiklet"},
  {ikon:"⚽",ad:"Top"}, {ikon:"🚀",ad:"Roket"}, {ikon:"🐱",ad:"Kedi"},
  {ikon:"🐶",ad:"Köpek"}, {ikon:"✈️",ad:"Uçak"}, {ikon:"🍕",ad:"Pizza"},
  {ikon:"🎸",ad:"Gitar"}, {ikon:"🌵",ad:"Kaktüs"}, {ikon:"💡",ad:"Ampul"},
  {ikon:"👑",ad:"Taç"}, {ikon:"🍔",ad:"Hamburger"}, {ikon:"⚓",ad:"Çapa"},
  {ikon:"🎧",ad:"Kulaklık"}, {ikon:"🎁",ad:"Hediye"}, {ikon:"🧊",ad:"Buz"},
  {ikon:"🍌",ad:"Muz"}, {ikon:"🍇",ad:"Üzüm"}, {ikon:"🍉",ad:"Karpuz"},
  {ikon:"🍓",ad:"Çilek"}, {ikon:"🍒",ad:"Kiraz"}, {ikon:"🍍",ad:"Ananas"},
  {ikon:"🥝",ad:"Kivi"}, {ikon:"🥥",ad:"Hindistan Cevizi"}, {ikon:"🥑",ad:"Avokado"},
  {ikon:"🥕",ad:"Havuç"}, {ikon:"🌽",ad:"Mısır"}, {ikon:"🌶️",ad:"Biber"},
  {ikon:"🧀",ad:"Peynir"}, {ikon:"🍞",ad:"Ekmek"}, {ikon:"🥞",ad:"Pankek"},
  {ikon:"🍳",ad:"Yumurta"}, {ikon:"🍦",ad:"Dondurma"}, {ikon:"🍩",ad:"Donut"},
  {ikon:"🍪",ad:"Kurabiye"}, {ikon:"🎂",ad:"Pasta"}, {ikon:"🍯",ad:"Bal"},
  {ikon:"🍵",ad:"Çay"}, {ikon:"☕",ad:"Kahve"}, {ikon:"🍺",ad:"Bira"},
  {ikon:"🏀",ad:"Basketbol"}, {ikon:"🏈",ad:"Futbol Topu"}, {ikon:"🎾",ad:"Tenis"},
  {ikon:"🏐",ad:"Voleybol"}, {ikon:"🏓",ad:"Masa Tenisi"}, {ikon:"🏸",ad:"Badminton"},
  {ikon:"🥊",ad:"Boks Eldiveni"}, {ikon:"🛹",ad:"Kaykay"}, {ikon:"🛼",ad:"Paten"},
  {ikon:"🎯",ad:"Hedef Tahtası"}, {ikon:"🎳",ad:"Bavling"}, {ikon:"🎹",ad:"Piyano"},
  {ikon:"🎷",ad:"Saksafon"}, {ikon:"🎺",ad:"Trompet"}, {ikon:"🎻",ad:"Keman"},
  {ikon:"🥁",ad:"Bateri"}, {ikon:"🎲",ad:"Zar"}, {ikon:"🧩",ad:"Yapboz"},
  {ikon:"🎨",ad:"Palet"}, {ikon:"📚",ad:"Kitap"}, {ikon:"✏️",ad:"Kurşun Kalem"},
  {ikon:"📌",ad:"Racon"}, {ikon:"📍",ad:"İğne"}, {ikon:"📎",ad:"Ataş"},
  {ikon:"📐",ad:"Ganyot"}, {ikon:"📏",ad:"Cetvel"}, {ikon:"✂️",ad:"Makas"},
  {ikon:"💻",ad:"Dizüstü Bilgisayar"}, {ikon:"🖥️",ad:"Masaüstü"}, {ikon:"🖨️",ad:"Yazıcı"},
  {ikon:"🖱️",ad:"Fare"}, {ikon:"💾",ad:"Disket"}, {ikon:"📷",ad:"Kamera"},
  {ikon:"📹",ad:"Video Kamera"}, {ikon:"📺",ad:"Televizyon"}, {ikon:"📻",ad:"Radyo"},
  {ikon:"🔋",ad:"Pil"}, {ikon:"🔌",ad:"Priz"}, {ikon:"🔦",ad:"Fener"},
  {ikon:"🔑",ad:"Anahtar"}, {ikon:"🔒",ad:"Kilit"}, {ikon:"🔓",ad:"Açık Kilit"},
  {ikon:"🔔",ad:"Zil"}, {ikon:"🧲",ad:"Mıknatıs"}, {ikon:"🧪",ad:"Deney Tüpü"},
  {ikon:"🔬",ad:"Mikroskop"}, {ikon:"🔭",ad:"Teleskop"}, {ikon:"📡",ad:"Anten"},
  {ikon:"💉",ad:"Şırınga"}, {ikon:"💊",ad:"Hap"}, {ikon:"🩺",ad:"Steteskop"},
  {ikon:"🚪",ad:"Kapı"}, {ikon:"🛏️",ad:"Yatak"}, {ikon:"🛋️",ad:"Koltuk"},
  {ikon:"🚽",ad:"Tuvalet"}, {ikon:"🚿",ad:"Duş"}, {ikon:"🛁",ad:"Küvet"},
];

export const RENKLER      = ["#ef4444","#3b82f6","#10b981","#f59e0b"];
export const RENK_ISIMLERI = ["Kırmızı", "Mavi", "Yeşil", "Sarı"];
export const DNA_HARFLER  = ["A","T","G","C"];

export function rastgele(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function karistir(dizi) {
  const y = [...dizi];
  for (let i = y.length - 1; i > 0; i--) {
    const j = rastgele(0, i);
    [y[i], y[j]] = [y[j], y[i]];
  }
  return y;
}

const STORAGE_KEY = "zihinVerileri";

export function verileriKaydet(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

export function verileriYukle() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
