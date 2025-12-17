"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportForm() {
  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "SUCESSO" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (status === "SUCESSO" && countdown === 0) {
      router.push("/");
    }
    return () => clearTimeout(timer);
  }, [status, countdown, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const response = await fetch("https://formspree.io/f/mqezzzor", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      setStatus("SUCESSO");
      form.reset();
    } else {
      setStatus("ERRO");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2 text-center">
        Suporte Sorzi
      </h2>

      {status === "SUCESSO" ? (
        <div className="bg-green-900/20 border border-green-900 text-green-400 p-6 rounded-lg text-center my-4">
          <p className="mb-4">
            Obrigada! Sua mensagem foi enviada com sucesso.
          </p>
          <p className="text-sm text-zinc-400">
            Você será redirecionado em{" "}
            <span className="font-bold text-white">{countdown}</span>{" "}
            segundos...
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 block mx-auto text-xs underline hover:text-white"
          >
            Voltar para a Home agora
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "ERRO" && (
            <p className="text-red-500 text-xs text-center">
              Ops! Algo deu errado. Tente novamente.
            </p>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">
              Mensagem
            </label>
            <textarea
              name="message"
              rows={4}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-600 outline-none resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition shadow-md"
          >
            Enviar Mensagem
          </button>
        </form>
      )}
    </section>
  );
}
