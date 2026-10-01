import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { verileriKaydet, verileriYukle } from '../utils';

const initialState = {
  xp: 0, seri: 0, dogru: 0, cevap: 0,
  hSeviye: 1, hSkor: 0,
  tSeviye: 1, tSkor: 0,
  gSeviye: 1, gSkor: 0,
  kSeviye: 1, kSkor: 0,
  dSeviye: 1, dSkor: 0,
  dnSeviye: 1, dnSkor: 0,
  hfSeviye: 1, hfSkor: 0,
  rSeviye: 1, rSkor: 0,
  mSeviye: 1, mSkor: 0,
  fSeviye: 1, fSkor: 0,
  sSeviye: 1, sSkor: 0,
  sfSeviye: 1, sfSkor: 0,
  klSeviye: 1, klSkor: 0,
  ksSeviye: 1, ksSkor: 0,
  // Yeni 16 oyun
  aySeviye: 1, aySkor: 0,
  tmpSeviye: 1, tmpSkor: 0,
  bnSeviye: 1, bnSkor: 0,
  ddSeviye: 1, ddSkor: 0,
  hdfSeviye: 1, hdfSkor: 0,
  izSeviye: 1, izSkor: 0,
  trtSeviye: 1, trtSkor: 0,
  rotSeviye: 1, rotSkor: 0,
  rxSeviye: 1, rxSkor: 0,
  saSeviye: 1, saSkor: 0,
  emSeviye: 1, emSkor: 0,
  vnSeviye: 1, vnSkor: 0,
  yhSeviye: 1, yhSkor: 0,
  toSeviye: 1, toSkor: 0,
  rksSeviye: 1, rksSkor: 0,
  dsSeviye: 1, dsSkor: 0,
  nbSeviye: 1, nbSkor: 0,
  pusSeviye: 1, pusSkor: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':    return { ...state, ...action.payload };
    case 'XP_EKLE':
      return { ...state, xp: state.xp + action.amount, dogru: state.dogru + 1, cevap: state.cevap + 1, seri: state.seri + 1 };
    case 'HATA':
      return { ...state, cevap: state.cevap + 1, seri: 0 };
    case 'OYUN_GUNCELLE':
      return { ...state, ...action.payload };
    default: return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = verileriYukle();
    if (saved) dispatch({ type: 'LOAD', payload: saved });
  }, []);

  useEffect(() => {
    verileriKaydet(state);
  }, [state]);

  const xpEkle = useCallback((amount) => dispatch({ type: 'XP_EKLE', amount }), []);
  const hataYap = useCallback(() => dispatch({ type: 'HATA' }), []);
  const oyunGuncelle = useCallback((payload) => dispatch({ type: 'OYUN_GUNCELLE', payload }), []);

  return (
    <GameContext.Provider value={{ state, xpEkle, hataYap, oyunGuncelle }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

export function seviyeHesapla(xp) {
  const seviye = Math.floor(xp / 100) + 1;
  const ilerlemePct = xp - (seviye - 1) * 100;
  const kalan = 100 - ilerlemePct;
  return { seviye, ilerlemePct, kalan };
}
