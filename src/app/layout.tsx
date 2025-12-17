import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorzi - Gerador de Loterias",
  description:
    "Gere jogos de loteria com segurança criptográfica e matemática precisa.",
  keywords: [
    "loteria",
    "mega-sena",
    "quina",
    "lotofacil",
    "mega da virada",
    "loterias da caixa",
    "gerador",
    "nextjs",
    "react",
  ],
  authors: [
    { name: "Loraine Vilches", url: "https://instagram.com/lorainevilches" },
  ],
  openGraph: {
    title: "Sorzi - Gerador de Loterias",
    description:
      "Engine matemática para geração de jogos de loteria da caixa economica federal.",
    url: "https://sorzi-engine.vercel.app",
    siteName: "Sorzi",
    images: [
      {
        url: "https://raw.githubusercontent.com/lorainevilches/sorzi-web/main/public/images/idv_white.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-421CZ8E058" />
      </body>
    </html>
  );
}
