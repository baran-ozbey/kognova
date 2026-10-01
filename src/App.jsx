import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import Menu               from './screens/Menu';
import HaritaOyunu        from './games/HaritaOyunu';
import TrafikOyunu        from './games/TrafikOyunu';
import GolgeOyunu         from './games/GolgeOyunu';
import KuralOyunu         from './games/KuralOyunu';
import DesenOyunu         from './games/DesenOyunu';
import DnaOyunu           from './games/DnaOyunu';
import HafizaOyunu        from './games/HafizaOyunu';
import StroopOyunu        from './games/StroopOyunu';
import MatematikOyunu     from './games/MatematikOyunu';
import FarkiBulOyunu      from './games/FarkiBulOyunu';
import SiralamaOyunu      from './games/SiralamaOyunu';
import SifreCozucuOyunu   from './games/SifreCozucuOyunu';
import KelimeOyunu        from './games/KelimeOyunu';
import SaymacaOyunu       from './games/SaymacaOyunu';
import AynaOyunu          from './games/AynaOyunu';
import TempoOyunu         from './games/TempoOyunu';
import BinaryOyunu        from './games/BinaryOyunu';
import DiziyiDevamEttir   from './games/DiziyiDevamEttir';
import HedefOyunu         from './games/HedefOyunu';
import AciOyunu           from './games/AciOyunu';
import TartıOyunu         from './games/TartıOyunu';
import RotasyonOyunu      from './games/RotasyonOyunu';
import ReaksiyonOyunu     from './games/ReaksiyonOyunu';
import SaatOyunu          from './games/SaatOyunu';
import EmojiMatematik     from './games/EmojiMatematik';
import VennOyunu          from './games/VennOyunu';
import YolHaritasiOyunu   from './games/YolHaritasiOyunu';
import TuhafOlanOyunu     from './games/TuhafOlanOyunu';
import RenkSiralamaOyunu  from './games/RenkSiralamaOyunu';
import DusenSayilar       from './games/DusenSayilar';
import NBakOyunu          from './games/NBakOyunu';
import PusulaOyunu        from './games/PusulaOyunu';

const OYUN_HARITASI = {
  menu:               null,
  haritaOyunu:        HaritaOyunu,
  trafikOyunu:        TrafikOyunu,
  golgeOyunu:         GolgeOyunu,
  kuralOyunu:         KuralOyunu,
  desenOyunu:         DesenOyunu,
  dnaOyunu:           DnaOyunu,
  hafizaOyunu:        HafizaOyunu,
  stroopOyunu:        StroopOyunu,
  matematikOyunu:     MatematikOyunu,
  farkiBulOyunu:      FarkiBulOyunu,
  siralamaOyunu:      SiralamaOyunu,
  sifreCozucuOyunu:   SifreCozucuOyunu,
  kelimeOyunu:        KelimeOyunu,
  saymacaOyunu:       SaymacaOyunu,
  aynaOyunu:          AynaOyunu,
  tempoOyunu:         TempoOyunu,
  binaryOyunu:        BinaryOyunu,
  diziyiDevamEttir:   DiziyiDevamEttir,
  hedefOyunu:         HedefOyunu,
  iziSurOyunu:        AciOyunu,
  tartiOyunu:         TartıOyunu,
  rotasyonOyunu:      RotasyonOyunu,
  reaksiyonOyunu:     ReaksiyonOyunu,
  saatOyunu:          SaatOyunu,
  emojiMatematik:     EmojiMatematik,
  vennOyunu:          VennOyunu,
  yolHaritasiOyunu:   YolHaritasiOyunu,
  tuhafOlanOyunu:     TuhafOlanOyunu,
  renkSiralamaOyunu:  RenkSiralamaOyunu,
  dusenSayilar:       DusenSayilar,
  nBakOyunu:          NBakOyunu,
  pusulaOyunu:        PusulaOyunu,
};

function AppInner() {
  const [aktifEkran, setAktifEkran] = useState('menu');

  const oyunAc  = (id) => setAktifEkran(id);
  const menuDon = ()   => setAktifEkran('menu');

  const AktifOyun = OYUN_HARITASI[aktifEkran];

  return (
    <>
      {aktifEkran === 'menu'
        ? <Menu onOyunSec={oyunAc} />
        : AktifOyun
          ? <AktifOyun onBack={menuDon} />
          : <Menu onOyunSec={oyunAc} />
      }
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
