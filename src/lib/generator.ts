import type { LotteryRules } from "@/config/lotteries";

function cryptoIntInclusive(min: number, max: number) {
  // client-side only (GameGenerator é "use client")
  const range = max - min + 1;

  const buf = new Uint32Array(1);
  const maxUint32 = 0xffffffff;
  const limit = Math.floor(maxUint32 / range) * range;

  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0]!;
  } while (x >= limit);

  return min + (x % range);
}

export function generateGame(rules: LotteryRules, picks: number): number[] {
  const available = rules.max - rules.min + 1;

  if (picks < rules.minPicks || picks > rules.maxPicks) {
    throw new Error(
      `Quantidade de números deve estar entre ${rules.minPicks} e ${rules.maxPicks}.`
    );
  }

  if (rules.uniqueNumbers && picks > available) {
    throw new Error(
      `Não dá pra gerar ${picks} números únicos no intervalo ${rules.min}–${rules.max}.`
    );
  }

  const nums: number[] = [];
  const used = new Set<number>();

  while (nums.length < picks) {
    const n = cryptoIntInclusive(rules.min, rules.max);
    if (rules.uniqueNumbers) {
      if (used.has(n)) continue;
      used.add(n);
    }
    nums.push(n);
  }

  if (rules.sortAscending) nums.sort((a, b) => a - b);
  return nums;
}

export function generateGames(
  rules: LotteryRules,
  gamesCount: number,
  picks: number
): number[][] {
  if (!Number.isInteger(gamesCount) || gamesCount <= 0) {
    throw new Error("Quantidade de jogos inválida.");
  }
  return Array.from({ length: gamesCount }, () => generateGame(rules, picks));
}
