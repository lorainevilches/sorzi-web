"use client";

import { useMemo, useState } from "react";
import { Dice5, Sparkles, Play } from "lucide-react";

import { LOTTERIES, type LotteryKey } from "~/config/lotteries";
import { generateGames } from "~/lib/generator";

/* -------------------------------------------------------
 Component
------------------------------------------------------- */
export default function GameGenerator() {
  const lotteryList = useMemo(() => Object.values(LOTTERIES), []);

  const [lotteryKey, setLotteryKey] = useState<LotteryKey>("mega_sena");
  const rules = LOTTERIES[lotteryKey];

  // dezenas sempre começam no mínimo da loteria
  const [dozens, setDozens] = useState<number>(rules.dozens.min);

  const [gamesCount, setGamesCount] = useState(5);
  const [games, setGames] = useState<number[][]>([]);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
   Regras UX
  ------------------------------------------------------- */
  function changeLottery(next: LotteryKey) {
    setLotteryKey(next);
    setGames([]);
    setError("");
    setDozens(LOTTERIES[next].dozens.min); // 🔒 sempre resetar
  }

  /* -------------------------------------------------------
   Ação principal
  ------------------------------------------------------- */
  function onGenerate() {
    setError("");
    try {
      setGames(generateGames(rules, gamesCount, dozens));
    } catch (e: any) {
      setGames([]);
      setError(e?.message ?? "Erro ao gerar.");
    }
  }

  /* -------------------------------------------------------
   Render
  ------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* ================= CONFIGURAÇÃO ================= */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card: Loteria */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-zinc-200">
            <Dice5 size={18} />
            <h3 className="font-semibold">Loteria</h3>
          </div>

          <select
            value={lotteryKey}
            onChange={(e) => changeLottery(e.target.value as LotteryKey)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          >
            {lotteryList.map((l) => (
              <option key={l.key} value={l.key}>
                {l.name}
              </option>
            ))}
          </select>

          <p className="mt-3 text-xs text-zinc-500">
            Intervalo {rules.range.min}–{rules.range.max} • Dezenas{" "}
            {rules.dozens.min}–{rules.dozens.max}
          </p>
        </div>

        {/* Card: Dezenas */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-zinc-200">
            <Sparkles size={18} />
            <h3 className="font-semibold">Dezenas</h3>
          </div>

          <input
            type="number"
            min={rules.dozens.min}
            max={rules.dozens.max}
            value={dozens}
            onChange={(e) => setDozens(Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Quantidade de números por jogo
          </p>
        </div>
      </div>

      {/* ================= RESUMO ================= */}
      <div className="rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
        <h3 className="mb-3 font-semibold text-zinc-100">
          Resumo da configuração
        </h3>

        <div className="grid gap-3 md:grid-cols-3 text-sm text-zinc-300">
          <div>
            <strong>Loteria:</strong> {rules.name}
          </div>
          <div>
            <strong>Dezenas:</strong> {dozens}
          </div>
          <div>
            <strong>Jogos:</strong> {gamesCount}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <input
            type="number"
            min={1}
            value={gamesCount}
            onChange={(e) => setGamesCount(Number(e.target.value))}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />

          <button
            onClick={onGenerate}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            <Play size={16} /> Gerar jogos
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* ================= RESULTADOS ================= */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200">Resultados</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {games.map((nums, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="mb-2 text-xs text-zinc-400">Jogo #{idx + 1}</div>

              <div className="flex flex-wrap gap-2">
                {nums.map((n) => (
                  <span
                    key={`${idx}-${n}`}
                    className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm font-semibold"
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!games.length && (
          <p className="text-sm text-zinc-500">
            Gere seus jogos para ver os números aqui.
          </p>
        )}
      </div>

      {/* 
        🔒 FUTURO (comentado propositalmente)
        - Card Estratégia (Orçamento / Quantidade)
        - Comparação automática
        - Premiação informativa
        - Valores e chances
      */}
    </div>
  );
}
