"use client";

import { useMemo, useState } from "react";
import { Dice5, Sparkles, Play } from "lucide-react";

import { LOTTERIES, type LotteryKey } from "~/config/lotteries";
import { generateGames } from "~/lib/generator";

type Props = {
  // Ações do Pai
  onResults: (games: number[][]) => void;
  mode: "idle" | "generated";
  onClear?: () => void;

  // Estados que agora vêm do Pai (Lifted State)
  lotteryKey: LotteryKey;
  onLotteryChange: (key: LotteryKey) => void;
  dozens: number;
  onDozensChange: (val: number) => void;
  gamesCount: number;
  onGamesCountChange: (val: number) => void;
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export default function GameGenerator({
  onResults,
  mode,
  onClear,
  // Props de estado
  lotteryKey,
  onLotteryChange,
  dozens,
  onDozensChange,
  gamesCount,
  onGamesCountChange,
}: Props) {
  const lotteryList = useMemo(() => Object.values(LOTTERIES), []);

  // Derivamos as regras diretamente da prop selecionada
  const rules = LOTTERIES[lotteryKey];

  // O único estado local que sobra é o de erro visual
  const [error, setError] = useState("");

  /* -------------------------------------------------------
   Ação principal
  ------------------------------------------------------- */
  function handleGenerate() {
    setError("");
    try {
      // Usa os valores que vieram das props
      const result = generateGames(rules, gamesCount, dozens);
      onResults(result);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao gerar.");
    }
  }

  /* -------------------------------------------------------
   Render
  ------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* ================= CONFIGURAÇÃO ================= */}
      <div className="flex flex-col justify-between">
        {/* Card: Loteria */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-zinc-200">
            <Dice5 size={18} />
            <h3 className="font-semibold">Loteria</h3>
          </div>

          <select
            value={lotteryKey}
            onChange={(e) => onLotteryChange(e.target.value as LotteryKey)}
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

          <select
            value={dozens}
            onChange={(e) => onDozensChange(Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          >
            {Array.from(
              { length: rules.dozens.max - rules.dozens.min + 1 },
              (_, i) => {
                const value = rules.dozens.min + i;
                return (
                  <option key={value} value={value}>
                    {value} números
                  </option>
                );
              }
            )}
          </select>

          <p className="mt-2 text-xs text-zinc-500">
            Quantidade de números por jogo
          </p>
        </div>

        {/* ================= RESUMO / JOGOS ================= */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="mb-3 flex items-center gap-2 text-zinc-200">
            <Sparkles size={18} />
            <h3 className="font-semibold">Quantidade de jogos</h3>
          </div>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={gamesCount}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              onGamesCountChange(Number(v || 0));
            }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
          <div
            className={`mt-5 flex gap-3 ${
              mode === "idle" ? "items-center" : "flex-col"
            }`}
          >
            <button
              onClick={handleGenerate}
              className={`inline-flex items-center justify-center gap-2 rounded-xl
      bg-[var(--sorzi-accent)] px-6 py-3 text-sm font-semibold
      text-zinc-900 transition
      hover:brightness-110
      active:scale-[0.98]
      ${mode === "generated" ? "w-full" : ""}
    `}
            >
              <Play size={16} />
              {mode === "generated" ? "Gerar novamente" : "Gerar jogos"}
            </button>

            {mode === "generated" && onClear && (
              <button
                onClick={onClear}
                className="w-full rounded-xl border border-white/10
      bg-black/30 px-4 py-2 text-sm text-zinc-300
      hover:bg-black/40 transition"
              >
                Limpar resultados
              </button>
            )}
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
