"use client";

import { useMemo, useState } from "react";
import { LOTTERIES } from "~/config/lotteries";
import { generateGames } from "~/lib/generator";

export default function GameGenerator() {
  const rules = useMemo(() => LOTTERIES.custom, []);
  const [gamesCount, setGamesCount] = useState(5);
  const [picks, setPicks] = useState(6);
  const [games, setGames] = useState<number[][]>([]);
  const [error, setError] = useState<string>("");

  function onGenerate() {
    setError("");
    try {
      const result = generateGames(rules, gamesCount, picks);
      setGames(result);
    } catch (e: any) {
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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-zinc-300">
              Quantidade de jogos
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={gamesCount}
              onChange={(e) => setGamesCount(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">
              Números por jogo
            </label>
            <input
              type="number"
              min={rules.minPicks}
              max={rules.maxPicks}
              value={picks}
              onChange={(e) => setPicks(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>
        </div>

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

        {error ? (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-200">Resultados</h2>
          <span className="text-xs text-zinc-500">
            Intervalo {rules.min}–{rules.max} • únicos • ordenados
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
                    key={n}
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
