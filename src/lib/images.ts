/*
 * Image resolver.
 * Eagerly imports every file under src/images/** and builds a lookup keyed by
 * "<folder>/<name>" without extension, lower-cased. See changes/content-and-assets.md §6.
 */
const modules = import.meta.glob('../images/**/*.{png,jpg,jpeg,webp,avif,svg,gif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

const map = new Map<string, string>();
const videoSet = new Set<string>();

for (const path in modules) {
  // path looks like ../images/hero/home-hero-product-image.webp
  const m = path.match(/images\/([^/]+)\/([^/]+)\.[^.]+$/);
  if (!m) continue;
  const key = `${m[1]}/${m[2]}`.toLowerCase();
  map.set(key, modules[path]);
  if (VIDEO_EXT.test(path)) videoSet.add(key);
}

/** Returns the resolved URL for "folder/name" (no extension), or undefined. */
export function resolveImage(name: string): string | undefined {
  return map.get(name.toLowerCase());
}

/** True when the resolved asset is a video file. */
export function isVideo(name: string): boolean {
  return videoSet.has(name.toLowerCase());
}
