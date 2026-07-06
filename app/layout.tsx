import type { Metadata } from "next";
import { Space_Grotesk, Six_Caps } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/ui/navbar";
import { PageViewTracker } from "@/components/ui/page-view-tracker";
import { PageLoader } from "@/components/ui/page-loader";
import { SITE_URL } from "@/lib/site-url";
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

export const metadata: Metadata = {
  title: {
    default: "Flores — Graphiste & Développeur Web Freelance",
    template: "%s — Flores",
  },
  description: "Allan, graphiste freelance & développeur web autodidacte. Identité visuelle, direction artistique, sites vitrines sur mesure, covers musicales, accompagnement créatif.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Flores",
    title: "Flores — Graphiste & Développeur Web Freelance",
    description: "Identité visuelle, direction artistique & développement web — des créations qui vous ressemblent vraiment.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Flores — Graphiste & Développeur Web" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flores — Graphiste & Développeur Web Freelance",
    description: "Identité visuelle, direction artistique & développement web — des créations qui vous ressemblent vraiment.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Allan",
  alternateName: "Flores",
  url: SITE_URL,
  jobTitle: "Graphiste & Développeur Web Freelance",
  description: "Graphiste freelance & développeur web autodidacte. Identité visuelle, direction artistique, sites vitrines sur mesure, covers musicales.",
  knowsAbout: ["Identité visuelle", "Direction artistique", "Développement web", "Cover art"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${sixCaps.variable}`}>
      <body style={{ fontFamily: "var(--font-poppins), sans-serif", background: "#0e0c0a" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <PageLoader />
          {children}
          <Navbar />
          <PageViewTracker />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
