"use client";

import { useMemo, useState } from "react";
import {
  LOTTERIES,
  type LotteryKey,
  type LotteryRules,
} from "~/config/lotteries";
import { generateGames } from "~/lib/generator";

type Mode = "count" | "budget";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function GameGenerator() {
  const lotteryOptions = useMemo(() => Object.values(LOTTERIES), []);

  // loteria selecionada
  const [lotteryKey, setLotteryKey] = useState<LotteryKey>("mega_sena");
  const rules: LotteryRules = LOTTERIES[lotteryKey];

  // modo de operação
  const [mode, setMode] = useState<Mode>("count");

  // inputs principais
  const [gamesCount, setGamesCount] = useState(5);
  const [budget, setBudget] = useState<number>(100);

  // dezenas (quantidade de números por jogo)
  const [dozens, setDozens] = useState<number>(
    () => LOTTERIES.mega_sena.dozens.min
  );

  // automação de comparação
  const [autoCompare, setAutoCompare] = useState(true);

  // resultados
  const [games, setGames] = useState<number[][]>([]);
  const [error, setError] = useState<string>("");

  // ao trocar de loteria, ajusta dezenas para o mínimo permitido, se necessário
  function onChangeLottery(nextKey: LotteryKey) {
    setLotteryKey(nextKey);
    const nextRules = LOTTERIES[nextKey];
    setGames([]);
    setError("");

    setDozens((current) => {
      if (current < nextRules.dozens.min) return nextRules.dozens.min;
      if (current > nextRules.dozens.max) return nextRules.dozens.max;
      return current;
    });
  }

  function getPriceFor(dozensValue: number) {
    return rules.prices?.[dozensValue] ?? null;
  }

  function computePossibleGamesByBudget(
    dozensValue: number,
    budgetValue: number
  ) {
    const price = getPriceFor(dozensValue);
    if (!price || price <= 0) {
      return { possible: 0, total: 0, price: null as number | null };
    }
    const possible = Math.floor(budgetValue / price);
    return { possible, total: possible * price, price };
  }

  function onGenerate() {
    setError("");

    try {
      if (mode === "count") {
        const result = generateGames(rules, gamesCount, dozens);
        setGames(result);
        return;
      }

      // modo orçamento
      const calc = computePossibleGamesByBudget(dozens, budget);

      if (!calc.price) {
        setGames([]);
        setError(
          "Preço não configurado para esta loteria e quantidade de dezenas. Preencha em src/config/lotteries.ts."
        );
        return;
      }

      if (calc.possible <= 0) {
        setGames([]);
        setError(
          "Com esse orçamento, não dá pra gerar nenhum jogo nessa configuração."
        );
        return;
      }

      const result = generateGames(rules, calc.possible, dozens);
      setGames(result);
    } catch (e: any) {
      setGames([]);
      setError(e?.message ?? "Erro ao gerar.");
    }
  }

  function onClear() {
    setError("");
    setGames([]);
  }

  async function copyAll() {
    if (!games.length) return;
    const text = games
      .map((g, i) => `Jogo #${i + 1}: ${g.join(" - ")}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
  }

  // infos para o painel
  const price = getPriceFor(dozens);
  const budgetCalc = computePossibleGamesByBudget(dozens, budget);

  // comparação automática (só quando modo orçamento estiver ligado)
  // Mostra quantos jogos dá para fazer variando dezenas dentro do permitido
  const compareRows =
    mode === "budget" && autoCompare
      ? Array.from(
          { length: rules.dozens.max - rules.dozens.min + 1 },
          (_, i) => rules.dozens.min + i
        ).map((d) => {
          const c = computePossibleGamesByBudget(d, budget);
          return { dozens: d, ...c };
        })
      : [];

  return (
    <div className="space-y-6">
      {/* CONTROLES */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* SELECT LOTERIA */}
          <div>
            <label className="block text-sm text-zinc-300">Loteria</label>
            <select
              value={lotteryKey}
              onChange={(e) => onChangeLottery(e.target.value as LotteryKey)}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
            >
              {lotteryOptions.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-zinc-500">
              Intervalo {rules.range.min}–{rules.range.max} • Dezenas{" "}
              {rules.dozens.min}–{rules.dozens.max}
            </p>
          </div>

          {/* DEZENAS */}
          <div>
            <label className="block text-sm text-zinc-300">
              Números por jogo (dezenas)
            </label>
            <input
              type="number"
              min={rules.dozens.min}
              max={rules.dozens.max}
              value={dozens}
              onChange={(e) => setDozens(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <p className="mt-2 text-xs text-zinc-500">
              {price ? (
                <>
                  Preço configurado:{" "}
                  <span className="text-zinc-200">{formatBRL(price)}</span>
                </>
              ) : (
                "Preço ainda não configurado para esta quantidade."
              )}
            </p>
          </div>
        </div>

        {/* MODO */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
            <p className="text-sm font-semibold text-zinc-200">Modo</p>

            <div className="mt-3 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "count"}
                  onChange={() => setMode("count")}
                  className="accent-zinc-200"
                />
                Quantidade de jogos
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "budget"}
                  onChange={() => setMode("budget")}
                  className="accent-zinc-200"
                />
                Orçamento (R$)
              </label>
            </div>
          </div>

          {/* INPUT DEPENDE DO MODO */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
            {mode === "count" ? (
              <>
                <label className="block text-sm font-semibold text-zinc-200">
                  Quantidade de jogos
                </label>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={gamesCount}
                  onChange={(e) => setGamesCount(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Gera exatamente a quantidade informada.
                </p>
              </>
            ) : (
              <>
                <label className="block text-sm font-semibold text-zinc-200">
                  Orçamento (R$)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  {budgetCalc.price ? (
                    <>
                      Com {formatBRL(budget)} você faz{" "}
                      <span className="text-zinc-200 font-semibold">
                        {budgetCalc.possible}
                      </span>{" "}
                      jogo(s) • Total:{" "}
                      <span className="text-zinc-200 font-semibold">
                        {formatBRL(budgetCalc.total)}
                      </span>
                    </>
                  ) : (
                    "Preencha o preço para habilitar este cálculo."
                  )}
                </p>

                <label className="mt-3 flex items-center gap-2 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={autoCompare}
                    onChange={(e) => setAutoCompare(e.target.checked)}
                    className="accent-zinc-200"
                  />
                  Comparação automática (por dezenas)
                </label>
              </>
            )}
          </div>
        </div>

        {/* AÇÕES */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onGenerate}
            className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
          >
            Gerar
          </button>

          <button
            onClick={onClear}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900/60"
          >
            Limpar
          </button>

          <button
            onClick={copyAll}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900/60"
          >
            Copiar tudo
          </button>
        </div>

        {/* ERRO */}
        {error ? (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* AVISO */}
        <div className="mt-4 text-xs text-zinc-500">
          <p>
            Aviso: informações e simulações são apenas informativas e não
            garantem prêmio.
          </p>
        </div>
      </div>

      {/* COMPARAÇÃO AUTOMÁTICA */}
      {mode === "budget" && autoCompare ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">
              Comparação por dezenas
            </h3>
            <span className="text-xs text-zinc-500">
              Base: {formatBRL(budget)}
            </span>
          </div>

          <div className="space-y-2">
            {compareRows.map((row) => (
              <div
                key={row.dozens}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2"
              >
                <div className="text-sm text-zinc-200">
                  {row.dozens} dezenas
                  <span className="ml-2 text-xs text-zinc-500">
                    {row.price
                      ? `• ${formatBRL(row.price)}/jogo`
                      : "• preço não configurado"}
                  </span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  {row.price ? `${row.possible} jogo(s)` : "—"}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Dica: se você desligar a automação, o Sorzi mostra apenas a
            quantidade de jogos da configuração escolhida.
          </p>
        </div>
      ) : null}

      {/* RESULTADOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-200">Resultados</h2>
          <span className="text-xs text-zinc-500">
            {rules.name} • {rules.range.min}–{rules.range.max} • dezenas{" "}
            {dozens}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {games.map((nums, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-200">
                  Jogo #{idx + 1}
                </div>
                <button
                  className="rounded-lg border border-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900/60"
                  onClick={() =>
                    navigator.clipboard.writeText(nums.join(" - "))
                  }
                >
                  Copiar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {nums.map((n) => (
                  <span
                    key={`${idx}-${n}`}
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-1 text-sm font-semibold"
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!games.length ? (
          <p className="text-sm text-zinc-500">Gere para aparecer aqui.</p>
        ) : null}
      </div>
    </div>
  );
}
