const IMAGE_MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const DOCUMENT_MIME_EXT: Record<string, string> = {
  "application/pdf": "pdf",
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 Mo
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 Mo

const ALL_MIME_EXT = { ...IMAGE_MIME_EXT, ...DOCUMENT_MIME_EXT };

/** Valide un upload (type MIME réel + taille) avant de l'envoyer vers Vercel Blob. Renvoie un message d'erreur, ou null si valide. */
export function validateUpload(file: File, kind: "image" | "document"): string | null {
  const allowed = kind === "image" ? IMAGE_MIME_EXT : ALL_MIME_EXT;
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;

  if (!(file.type in allowed)) {
    return kind === "image"
      ? "Type de fichier non autorisé (images uniquement : PNG, JPEG, WebP, GIF, AVIF)."
      : "Type de fichier non autorisé (images ou PDF uniquement).";
  }
  if (file.size > maxBytes) {
    return `Fichier trop volumineux (max ${Math.round(maxBytes / 1024 / 1024)} Mo).`;
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
