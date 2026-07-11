export type TextBlock = { type: "text"; title?: string; text: string };
export type ImageFormat = "standard" | "carre" | "large" | "banniere";
export type TextImageBlock = { type: "textImage"; title?: string; text: string; image: string; imagePosition: "left" | "right"; imageFormat?: ImageFormat };
export type CarouselBlock = { type: "carousel"; images: string[] };
export type VideoBlock = { type: "video"; url: string; caption?: string };
export type StatsBlock = { type: "stats"; items: { value: string; label: string }[] };

export type PortfolioBlock = TextBlock | TextImageBlock | CarouselBlock | VideoBlock | StatsBlock;

export function toBlockArray(val: unknown): PortfolioBlock[] {
  if (!Array.isArray(val)) return [];
  return val.filter((b): b is PortfolioBlock =>
    b && typeof b === "object" && typeof (b as { type?: unknown }).type === "string"
  );
}

export function emptyBlock(type: PortfolioBlock["type"]): PortfolioBlock {
  switch (type) {
    case "text": return { type: "text", title: "", text: "" };
    case "textImage": return { type: "textImage", title: "", text: "", image: "", imagePosition: "right", imageFormat: "standard" };
    case "carousel": return { type: "carousel", images: [] };
    case "video": return { type: "video", url: "", caption: "" };
    case "stats": return { type: "stats", items: [{ value: "", label: "" }] };
  }
}

/** Convertit un lien YouTube/Vimeo en URL embed. Renvoie null si le format n'est pas reconnu (fichier vidéo direct probable). */
export function resolveVideoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
