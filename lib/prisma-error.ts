import { Prisma } from "@prisma/client";

/** Traduit une erreur Prisma en message compréhensible, sans exposer les détails internes. Log toujours l'erreur complète côté serveur. */
export function describePrismaError(err: unknown, context: string): string {
  console.error(`[${context}]`, err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "ce champ";
        return `Valeur déjà utilisée (${target}) — ex. un slug identique à un autre projet.`;
      }
      case "P2003":
        return "Référence invalide (ex. section supprimée) — rechargez la page et réessayez.";
      case "P2025":
        return "Élément introuvable — il a peut-être été supprimé entre-temps.";
      default:
        return `Erreur base de données (${err.code}).`;
    }
  }
  return "Erreur serveur inattendue.";
}
