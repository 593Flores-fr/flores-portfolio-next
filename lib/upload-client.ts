import { upload } from "@vercel/blob/client";
import { validateUpload, safeFilename, safeLibraryFilename } from "@/lib/upload-validation";

/**
 * Upload direct navigateur → Vercel Blob. Contourne la limite de taille de requête des
 * fonctions serverless Vercel (~4.5 Mo) : le fichier ne transite jamais par notre serveur,
 * seul un jeton d'autorisation à courte durée de vie est échangé (voir handleUploadUrl).
 */
async function uploadToBlob(pathname: string, file: File, handleUploadUrl: string): Promise<string> {
  const blob = await upload(pathname, file, { access: "public", handleUploadUrl });
  return blob.url;
}

/** Image "asset" (hero, about, couverture/logo portfolio…) — nom de fichier opaque. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const err = validateUpload(file, "image");
  if (err) throw new Error(err);
  return uploadToBlob(`${folder}/${safeFilename(file)}`, file, `/api/admin/about-image?folder=${encodeURIComponent(folder)}`);
}

/** Image de la bibliothèque — nom de fichier lisible conservé pour l'affichage. */
export async function uploadLibraryImage(file: File): Promise<string> {
  const err = validateUpload(file, "image");
  if (err) throw new Error(err);
  return uploadToBlob(`library/${safeLibraryFilename(file)}`, file, "/api/admin/image-library");
}

/** Livrable client (image ou PDF) — le nom d'origine est envoyé séparément à la création en DB. */
export async function uploadDeliverable(file: File, projectId: string): Promise<string> {
  const err = validateUpload(file, "document");
  if (err) throw new Error(err);
  return uploadToBlob(`deliverables/${projectId}/${safeFilename(file)}`, file, "/api/admin/deliverables/upload-token");
}

/** Image de moodboard. */
export async function uploadMoodboardImage(file: File, projectId: string): Promise<string> {
  const err = validateUpload(file, "image");
  if (err) throw new Error(err);
  return uploadToBlob(`moodboard/${projectId}/${safeFilename(file)}`, file, "/api/admin/moodboard/upload-token");
}

/** Avatar de profil (client ou admin). */
export async function uploadAvatar(file: File): Promise<string> {
  const err = validateUpload(file, "image");
  if (err) throw new Error(err);
  return uploadToBlob(`avatars/${safeFilename(file)}`, file, "/api/profile/avatar/upload-token");
}
