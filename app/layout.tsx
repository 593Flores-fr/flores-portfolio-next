import type { Metadata } from "next";
import { Space_Grotesk, Six_Caps } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/ui/navbar";
import { PageViewTracker } from "@/components/ui/page-view-tracker";
import { PageLoader } from "@/components/ui/page-loader";
import "./globals.css";

// Space Grotesk : tech-forward, plus géométrique que Poppins — mix VTO/Flores
const spaceGrotesk = Space_Grotesk({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sixCaps = Six_Caps({
  variable: "--font-six-caps",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const BASE = process.env.NEXT_PUBLIC_URL ?? "https://flores.fr";

export const metadata: Metadata = {
  title: {
    default: "Flores — Graphiste & Développeur Web",
    template: "%s — Flores",
  },
  description: "Allan, graphiste freelance & développeur web autodidacte. Identité visuelle, direction artistique, covers, accompagnement créatif.",
  metadataBase: new URL(BASE),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE,
    siteName: "Flores",
    title: "Flores — Graphiste & Développeur Web",
    description: "Identité visuelle, direction artistique & développement web — des créations qui vous ressemblent vraiment.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Flores — Graphiste & Développeur Web" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flores — Graphiste & Développeur Web",
    description: "Identité visuelle, direction artistique & développement web — des créations qui vous ressemblent vraiment.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${sixCaps.variable}`}>
      <body style={{ fontFamily: "var(--font-poppins), sans-serif", background: "#0e0c0a" }}>
        <Providers>
          <PageLoader />
          {children}
          <Navbar />
          <PageViewTracker />
        </Providers>
        {/* UnicornStudio SDK */}
        <Script
          src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js"
          strategy="lazyOnload"
        />
        <Analytics />
      </body>
    </html>
  );
}
