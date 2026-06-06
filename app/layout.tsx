import type { Metadata } from "next";
import { Poppins, Six_Caps } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { Dock } from "@/components/ui/dock";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sixCaps = Six_Caps({
  variable: "--font-six-caps",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flores — Graphiste & Développeur Web",
  description: "Allan, graphiste freelance & développeur web autodidacte. Identité visuelle, direction artistique, covers, accompagnement créatif.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${sixCaps.variable}`}>
      <body style={{ fontFamily: "var(--font-poppins), sans-serif", background: "#060a0e" }}>
        <Providers>
          {children}
          <Dock />
        </Providers>
        {/* UnicornStudio SDK */}
        <Script
          src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
