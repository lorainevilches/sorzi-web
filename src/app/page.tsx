import Background from "~/components/Background";
import GameGenerator from "~/components/GameGenerator";

export default function Page() {
  return (
    <>
      <Background />
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Gerador de Números de Loteria
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400">
            Gere seus números de loteria de forma rápida e fácil!
          </p>

          <div className="mt-8">
            <GameGenerator />
          </div>

          <p className="mt-10 text-xs text-zinc-500">
            Nota: isso é aleatório para praticidade — não aumenta chance de
            prêmio.
          </p>
        </div>
      </main>
    </>
  );
}
