export type LotteryKey = "custom";

export type LotteryRules = {
  key: LotteryKey;
  name: string;
  min: number;
  max: number;
  minPicks: number;
  maxPicks: number;
  uniqueNumbers: boolean;
  sortAscending: boolean;
};

export const LOTTERIES: Record<LotteryKey, LotteryRules> = {
  custom: {
    key: "custom",
    name: "Personalizado (MVP)",
    min: 1,
    max: 60,
    minPicks: 1,
    maxPicks: 60,
    uniqueNumbers: true,
    sortAscending: true,
  },
};
