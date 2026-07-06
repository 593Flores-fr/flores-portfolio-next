const IMAGE_MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg", // certains outils envoient ce type non-standard
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/bmp": "bmp",
  // Pas de image/svg+xml : Next/Image refuse par défaut les SVG distants (dangerouslyAllowSVG
  // non activé, à raison — cf. audit sécurité) donc l'image casserait dès qu'utilisée ailleurs.
};

const DOCUMENT_MIME_EXT: Record<string, string> = {
  "application/pdf": "pdf",
};

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 Mo — visuels pro haute résolution
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 Mo

const ALL_MIME_EXT = { ...IMAGE_MIME_EXT, ...DOCUMENT_MIME_EXT };

const HEIC_TYPES = ["image/heic", "image/heif"];

/** Valide un upload (type MIME réel + taille) avant de l'envoyer vers Vercel Blob. Renvoie un message d'erreur, ou null si valide. */
export function validateUpload(file: File, kind: "image" | "document"): string | null {
  const allowed = kind === "image" ? IMAGE_MIME_EXT : ALL_MIME_EXT;
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;

  if (!(file.type in allowed)) {
    if (kind === "image" && HEIC_TYPES.includes(file.type)) {
      return "Format HEIC/HEIF non affichable dans la plupart des navigateurs — convertissez en JPG ou PNG avant d'uploader.";
    }
    return kind === "image"
      ? `Type de fichier non autorisé (${file.type || "inconnu"}) — utilisez PNG, JPEG, WebP, GIF, BMP ou AVIF.`
      : `Type de fichier non autorisé (${file.type || "inconnu"}) — images ou PDF uniquement.`;
  }
  if (file.size > maxBytes) {
    return `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo, max ${Math.round(maxBytes / 1024 / 1024)} Mo).`;
  }
  return null;
}

/** Génère un nom de fichier sûr pour le stockage (le nom original reste affiché depuis la colonne DB dédiée). */
export function safeFilename(file: File): string {
  const ext = ALL_MIME_EXT[file.type] ?? "bin";
  return `${crypto.randomUUID()}.${ext}`;
}

/** Nom lisible mais assaini (pour la bibliothèque, où le nom d'origine sert d'affichage — pas de colonne DB séparée). */
export function safeLibraryFilename(file: File): string {
  const base = file.name.split(/[/\\]/).pop() ?? "file";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 60) || "file";
  return `${Date.now()}-${cleaned}`;
}
