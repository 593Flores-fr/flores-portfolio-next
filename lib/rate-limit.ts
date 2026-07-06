import prisma from "@/lib/prisma";

/**
 * Limite le nombre d'appels pour une clé sur une fenêtre glissante (comptage stocké en DB —
 * pas de Redis dans la stack). Enregistre le hit uniquement s'il est encore autorisé.
 */
export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  const count = await prisma.rateLimitHit.count({ where: { key, createdAt: { gte: since } } });
  if (count >= limit) return false;
  await prisma.rateLimitHit.create({ data: { key } });

  // Purge opportuniste des vieilles entrées (pas de cron dispo) — ~1% des appels
  if (Math.random() < 0.01) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    prisma.rateLimitHit.deleteMany({ where: { createdAt: { lt: cutoff } } }).catch(() => {});
  }

  return true;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}
