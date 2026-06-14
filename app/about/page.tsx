import type { Metadata } from "next";
import { AboutPageContent } from "./about-content";

export const metadata: Metadata = {
  title: "À propos",
  description: "Allan — graphiste freelance autodidacte depuis 5 ans, membre de V.T.O Studio. Identité visuelle, direction artistique & développement web, des créations qui ont un caractère propre.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
