"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Movimento lento */}
      <div className="absolute inset-0 animate-slow-gradient bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,80,0.06),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.04),transparent_35%)]" />

      {/* Zebra abstrata */}
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(120deg,transparent_0%,white_10%,transparent_20%,transparent_30%,white_40%,transparent_50%)] bg-[length:400%_400%] animate-zebra" />
    </div>
  );
}
