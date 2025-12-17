// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import GameGenerator from "~/components/GameGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
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

  /* =======================================================
     ESTADO COMPARTILHADO (Lifted State)
     Agora o Pai controla as configurações do jogo.
  ======================================================= */
  const [lotteryKey, setLotteryKey] = useState<LotteryKey>("mega_sena");
  const [gamesCount, setGamesCount] = useState(5);
  // Inicia com o mínimo da Mega Sena (6)
  const [dozens, setDozens] = useState<number>(
    LOTTERIES["mega_sena"].dozens.min
  );

  // Lógica inteligente de troca de loteria
  function handleLotteryChange(key: LotteryKey) {
    setLotteryKey(key);
    // Reseta as dezenas para o mínimo da nova loteria
    setDozens(LOTTERIES[key].dozens.min);
    // Limpa a tela para evitar confusão (resultados da loteria anterior)
    setResults([]);
    setEngineState("idle");
  }

  /* =======================================================
     HANDLERS
  ======================================================= */
  function handleResults(games: number[][]) {
    setResults(games);
    setEngineState("generated");
    setGenerationId((prev) => prev + 1);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Objeto auxiliar para passar props limpas para os componentes
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
          <header className="mb-8">
            <div className="relative h-12 w-40">
              {" "}
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
          </header>

          {/* ================= ENGINE STATES ================= */}
          <AnimatePresence mode="wait" initial={false}>
            {engineState === "idle" ? (
              <motion.section
                key="engine-idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex justify-center"
              >
                <motion.div
                  layout
                  className="w-full max-w-[560px] sorzi-panel sorzi-panel--core sorzi-zebra-edge p-6"
                >
                  {/* 👇 Usando as props compartilhadas */}
                  <GameGenerator mode="idle" {...sharedProps} />
                </motion.div>
              </motion.section>
            ) : (
              <motion.section
                key="engine-generated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-12 gap-6"
              >
                {/* Engine (esquerda) */}
                <motion.aside
                  layout
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="col-span-3 sorzi-panel sorzi-panel--core p-5"
                >
                  {/* 👇 Usando as props compartilhadas + onClear */}
                  <GameGenerator
                    mode="generated"
                    {...sharedProps}
                    onClear={() => {
                      setResults([]);
                      setEngineState("idle");
                    }}
                  />
                </motion.aside>

                {/* Sistema/Resultados (direita) */}
                <motion.section
                  layout
                  initial={{ x: 24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                  className="col-span-9 sorzi-panel p-6"
                >
                  <h2 className="sorzi-panel__title mb-4">Resultados</h2>

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
        <Link
          href="/help"
          className="fixed bottom-6 right-6 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl"
          title="Suporte"
        >
          <HelpCircle size={24} />
        </Link>
        <footer className="pb-10 text-center">
          <p className="text-zinc-500 text-sm">
            © 2025 Sorzi • Desenvolvido por{" "}
            <a href="https://ohmycodes.com.br">Oh My Codes</a>
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
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[70vh] overflow-y-auto pr-2"
    >
      {results.map((nums, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-xl border border-white/10 bg-black/40 p-4"
        >
          <div className="mb-2 text-xs text-zinc-400">Jogo #{idx + 1}</div>

          {/* bolinhas alinhadas (grid) */}
          <div className="grid grid-cols-6 gap-3">
            {nums.map((n) => (
              <span
                key={`${idx}-${n}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-sm font-semibold tracking-tight"
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
