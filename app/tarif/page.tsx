import type { Metadata } from "next";
import { TarifPageContent } from "./tarif-content";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Tarifs des prestations de Flores : identité visuelle, logo, site vitrine, covers musicales, accompagnement streamers. Devis gratuit sous 24h, sans engagement.",
};

export default function TarifPage() {
  return <TarifPageContent />;
}
