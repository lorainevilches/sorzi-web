"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base */}
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Textura ultra sutil */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:32px_32px]" />
    </div>
  );
}
