import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { GoogleTagManager } from "@next/third-parties/google";
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
    "Webinar GS1 & Euvic: połączenie standardów GS1 z cyfrową dokumentacją zdarzeń w transporcie. 02.07.2026, 14:00, online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.variable} ${sincerity.variable}`}>
      <GoogleTagManager gtmId="GTM-MTWKBGLT" />
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MTWKBGLT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
