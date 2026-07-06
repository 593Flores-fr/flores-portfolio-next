/**
 * URL publique du site. Ordre de résolution :
 * 1. NEXT_PUBLIC_URL — à définir explicitement une fois un domaine custom acheté
 * 2. VERCEL_PROJECT_PRODUCTION_URL — rempli automatiquement par Vercel (domaine de prod actuel)
 * 3. localhost — dev local
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
