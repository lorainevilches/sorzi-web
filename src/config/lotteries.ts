// src/config/lotteries.ts

/**
 * Tipos
 * Mantemos compatibilidade com o MVP atual
 * e já preparamos para múltiplas loterias, prêmios e preços.
 */

export type LotteryKey =
  | "custom"
  | "mega_sena"
  | "quina"
  | "lotofacil"
  | "lotomania"
  | "dupla_sena"
  | "mais_milionaria";

export type PrizeRule = {
  hits: number; // quantidade de acertos
  name: string; // nome do prêmio (informativo)
};

export type PriceTable = {
  // chave = quantidade de dezenas
  // valor = preço da aposta
  [dozens: number]: number | null;
};

export type LotteryRules = {
  key: LotteryKey;
  name: string;

  // intervalo de números sorteáveis
  range: {
    min: number;
    max: number;
  };

  // dezenas permitidas por jogo
  dozens: {
    min: number;
    max: number;
  };

  // regras de premiação (informativo)
  prizes: PrizeRule[];

  // tabela de preços (VOCÊ PREENCHE)
  prices: PriceTable;

  // comportamento
  uniqueNumbers: boolean;
  sortAscending: boolean;
};

/**
 * Configuração das loterias do Sorzi
 * Preços deixados como null ou comentados
 * para preenchimento manual posterior.
 */

export const LOTTERIES: Record<LotteryKey, LotteryRules> = {
  custom: {
    key: "custom",
    name: "Personalizado",

    range: { min: 1, max: 60 },
    dozens: { min: 1, max: 60 },

    prizes: [],

    prices: {},

    uniqueNumbers: true,
    sortAscending: true,
  },

  mega_sena: {
    key: "mega_sena",
    name: "Mega-Sena",

    range: { min: 1, max: 60 },
    dozens: { min: 6, max: 20 },

    prizes: [
      { hits: 6, name: "Sena" },
      { hits: 5, name: "Quina" },
      { hits: 4, name: "Quadra" },
    ],

    prices: {
      6: null, // R$ 6,00
      // 7: null,
      // ...
      // 20: null
    },

    uniqueNumbers: true,
    sortAscending: true,
  },

  quina: {
    key: "quina",
    name: "Quina",

    range: { min: 1, max: 80 },
    dozens: { min: 5, max: 15 },

    prizes: [
      { hits: 5, name: "Quina" },
      { hits: 4, name: "Quadra" },
      { hits: 3, name: "Terno" },
      { hits: 2, name: "Duque" },
    ],

    prices: {
      5: null,
    },

    uniqueNumbers: true,
    sortAscending: true,
  },

  lotofacil: {
    key: "lotofacil",
    name: "Lotofácil",

    range: { min: 1, max: 25 },
    dozens: { min: 15, max: 20 },

    prizes: [
      { hits: 15, name: "15 acertos" },
      { hits: 14, name: "14 acertos" },
      { hits: 13, name: "13 acertos" },
      { hits: 12, name: "12 acertos" },
      { hits: 11, name: "11 acertos" },
    ],

    prices: {
      15: null,
    },

    uniqueNumbers: true,
    sortAscending: true,
  },

  lotomania: {
    key: "lotomania",
    name: "Lotomania",

    range: { min: 0, max: 99 },
    dozens: { min: 50, max: 50 },

    prizes: [
      { hits: 20, name: "20 acertos" },
      { hits: 19, name: "19 acertos" },
      { hits: 18, name: "18 acertos" },
      { hits: 0, name: "Nenhum acerto" },
    ],

    prices: {
      50: null,
    },

    uniqueNumbers: true,
    sortAscending: true,
  },

  dupla_sena: {
    key: "dupla_sena",
    name: "Dupla Sena",

    range: { min: 1, max: 50 },
    dozens: { min: 6, max: 15 },

    prizes: [
      { hits: 6, name: "Sena" },
      { hits: 5, name: "Quina" },
      { hits: 4, name: "Quadra" },
      { hits: 3, name: "Terno" },
    ],

    prices: {
      6: null,
    },

    uniqueNumbers: true,
    sortAscending: true,
  },

  mais_milionaria: {
    key: "mais_milionaria",
    name: "+Milionária",

    range: { min: 1, max: 50 },
    dozens: { min: 6, max: 6 },

    prizes: [{ hits: 6, name: "6 números + trevos" }],

    prices: {
      6: null,
    },

    uniqueNumbers: true,
    sortAscending: true,
  },
};
