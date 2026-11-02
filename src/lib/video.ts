export function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "") || null;
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || parsed.pathname.split("/embed/")[1] || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function vimeoId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const match = parsed.pathname.match(/\/(\d+)/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

export function embedUrl(url: string) {
  const yt = youtubeId(url);
  if (yt) return `https://www.youtube.com/embed/${yt}`;
  const vimeo = vimeoId(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  if (/loom\.com\//i.test(url)) {
    return url.replace("/share/", "/embed/");
  }
  return null;
}

export function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}
