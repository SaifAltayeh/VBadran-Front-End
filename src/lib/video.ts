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
  return url.startsWith("data:video") || /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

export function mediaUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/media/")) {
    const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api").replace(/\/api\/?$/, "");
    return `${api}${url}`;
  }
  return url;
}
