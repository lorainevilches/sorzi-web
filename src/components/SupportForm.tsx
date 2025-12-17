"use client";

export default function SupportForm() {
  return (
    <section className="max-w-md mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Suporte Sorzi</h2>
      <p className="text-zinc-400 text-sm mb-6">
        Encontrou um erro ou tem uma sugestão? Mande uma mensagem para a nossa
        equipe.
      </p>

      {/* SUBSTITUA O CÓDIGO ABAIXO PELA SUA ID DO FORMSPREE */}
      <form
        action="https://formspree.io/f/mqezzzor"
        method="POST"
        className="space-y-4"
      >
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Seu Nome
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1">
            Seu E-mail
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition duration-300 shadow-md"
        >
          Enviar Mensagem
        </button>
      </form>
    </section>
  );
}
