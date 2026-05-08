import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const sincerity = localFont({
  src: "../public/fonts/Sincerity-Regular.otf",
  weight: "400",
  style: "normal",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Podpis na szkle – dowód dostawy nie do podważenia – Webinar GS1 & Euvic",
  description:
    "Webinar GS1 & Euvic: połączenie standardów GS1 z cyfrową dokumentacją zdarzeń w transporcie. 26.03.2026, 12:00, online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.variable} ${sincerity.variable}`}>
      <body>{children}</body>
    </html>
  );
}
