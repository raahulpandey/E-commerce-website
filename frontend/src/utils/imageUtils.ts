/**
 * Inline SVG placeholder used when product images fail to load.
 * Returns a data URL so no external request is needed.
 */
export function getImageFallback() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#f1f5f9"/>
    <rect x="150" y="120" width="100" height="80" rx="8" fill="#cbd5e1"/>
    <circle cx="170" cy="145" r="12" fill="#94a3b8"/>
    <polygon points="150,200 200,155 250,200" fill="#94a3b8"/>
    <rect x="130" y="200" width="140" height="16" rx="4" fill="#cbd5e1"/>
    <rect x="155" y="226" width="90" height="10" rx="4" fill="#e2e8f0"/>
    <text x="200" y="280" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#94a3b8">No Image</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Returns the best available image URL from a product's image array.
 * Falls back to thumbnail, then to inline SVG placeholder.
 */
export function getProductImage(images?: string[], thumbnail?: string): string {
  if (images?.length && images[0] && images[0].startsWith('http')) return images[0];
  if (thumbnail && thumbnail.startsWith('http')) return thumbnail;
  return getImageFallback();
}
