"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import GameGenerator from "~/components/GameGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Settings2, Eye } from "lucide-react";
import Link from "next/link";
import { LOTTERIES, type LotteryKey } from "~/config/lotteries";

const Background = dynamic(() => import("~/components/Background"), {
  ssr: false,
});

type EngineState = "idle" | "generated";

export default function Page() {
  const [engineState, setEngineState] = useState<EngineState>("idle");
  const [results, setResults] = useState<number[][]>([]);
  const [generationId, setGenerationId] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [lotteryKey, setLotteryKey] = useState<LotteryKey>("mega_sena");
  const [gamesCount, setGamesCount] = useState(5);
  const [dozens, setDozens] = useState<number>(
    LOTTERIES["mega_sena"].dozens.min
  );

  // Controle de visibilidade para Mobile
  const [showSettings, setShowSettings] = useState(true);

  function handleLotteryChange(key: LotteryKey) {
    setLotteryKey(key);
    setDozens(LOTTERIES[key].dozens.min);
    setResults([]);
    setEngineState("idle");
    setShowSettings(true);
  }

  function handleResults(games: number[][]) {
    setResults(games);
    setEngineState("generated");
    setGenerationId((prev) => prev + 1);
    // No Mobile, após gerar, foca nos resultados
    setShowSettings(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sharedProps = {
    lotteryKey,
    onLotteryChange: handleLotteryChange,
    dozens,
    onDozensChange: setDozens,
    gamesCount,
    onGamesCountChange: setGamesCount,
    onResults: handleResults,
  };

  return (
    <>
      <Background />

      <main className="relative min-h-screen text-zinc-100">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          {/* Header */}
          <header className="mb-8 flex justify-between items-start">
            <div>
              <div className="relative h-12 w-40">
                <Image
                  src="/images/idv_white.png"
                  alt="Sorzi Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Geração e simulação de jogos
              </p>
            </div>
          </header>

          <AnimatePresence mode="wait" initial={false}>
            {engineState === "idle" ? (
              <motion.section
                key="engine-idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-[560px] sorzi-panel sorzi-panel--core sorzi-zebra-edge p-6">
                  <GameGenerator mode="idle" {...sharedProps} />
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="engine-generated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* LADO ESQUERDO: ENGINE / CONFIGURAÇÕES */}
                <motion.aside
                  className={`col-span-1 lg:col-span-3 sorzi-panel sorzi-panel--core p-5 
                    ${showSettings ? "block" : "hidden lg:block"}`}
                >
                  {/* Cabeçalho do Painel no Mobile */}
                  <div className="flex lg:hidden justify-between items-center mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Configurações
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex items-center gap-2 text-xs text-blue-400 font-medium"
                    >
                      <Eye size={14} /> Ver Resultados
                    </button>
                  </div>

                  <GameGenerator
                    mode="generated"
                    {...sharedProps}
                    onClear={() => {
                      setResults([]);
                      setEngineState("idle");
                      setShowSettings(true);
                    }}
                  />
                </motion.aside>

                {/* LADO DIREITO: RESULTADOS */}
                <motion.section
                  className={`col-span-1 lg:col-span-9 sorzi-panel p-6 
                    ${!showSettings ? "block" : "hidden lg:block"}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="sorzi-panel__title">Resultados</h2>

                    {/* Botão para voltar ao painel no Mobile */}
                    <button
                      onClick={() => setShowSettings(true)}
                      className="lg:hidden flex items-center gap-2 text-xs bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-zinc-200"
                    >
                      <Settings2 size={14} /> Ajustar Jogos
                    </button>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-sm sorzi-muted">
                      Nenhum resultado disponível.
                    </div>
                  ) : (
                    <ResultsGrid key={generationId} results={results} />
                  )}
                </motion.section>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Help */}
        <Link
          href="/suporte"
          className="fixed bottom-6 right-6 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl z-50"
          title="Suporte"
        >
          <HelpCircle size={24} />
        </Link>

        {/* Footer */}
        <footer className="pb-10 text-center px-6">
          <p className="text-zinc-500 text-sm">
            © 2025 Sorzi • Desenvolvido por{" "}
            <a
              href="https://ohmycodes.com.br"
              className="hover:text-zinc-300 transition-colors"
            >
              Oh My Codes
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}

function ResultsGrid({ results }: { results: number[][] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 max-h-[70vh] overflow-y-auto pr-2"
    >
      {results.map((nums, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="rounded-xl border border-white/10 bg-black/40 p-4 shadow-inner"
        >
          <div className="mb-3 text-xs text-zinc-500 font-medium tracking-tight">
            Jogo #{idx + 1}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {nums.map((n) => (
              <span
                key={`${idx}-${n}`}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-xs sm:text-sm font-bold text-white shadow-sm"
              >
                {String(n).padStart(2, "0")}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
