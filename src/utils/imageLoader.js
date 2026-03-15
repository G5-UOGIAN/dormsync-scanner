/**
 * Image loader with multi-format fallback, module-level cache, and lazy loading support.
 * Supports: .png, .jpg, .jpeg, .PNG, .JPG, .JPEG, .webp, .WEBP, .heic, .HEIC
 */

export const IMAGE_FORMATS = [
  'png', 'jpg', 'jpeg',
  'PNG', 'JPG', 'JPEG',
  'webp', 'WEBP',
  'heic', 'HEIC',
];

/** Module-level cache: basePath → resolved URL (or placeholder) */
const imageCache = new Map();

/** In-flight promises: basePath → Promise<string> — prevents duplicate probing */
const inflight = new Map();

export const getPlaceholderImage = (text = 'Image Not Available') =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f1f5f9" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14"%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;

/**
 * Probe formats sequentially and return the first URL that loads.
 * Result is cached so subsequent calls for the same basePath are instant.
 */
export const resolveImageUrl = (basePath) => {
  if (!basePath) return Promise.resolve(getPlaceholderImage('No Image'));

  // Cache hit
  if (imageCache.has(basePath)) return Promise.resolve(imageCache.get(basePath));

  // Dedupe in-flight
  if (inflight.has(basePath)) return inflight.get(basePath);

  const promise = new Promise((resolve) => {
    const tryNext = (index) => {
      if (index >= IMAGE_FORMATS.length) {
        const placeholder = getPlaceholderImage('Not Found');
        imageCache.set(basePath, placeholder);
        resolve(placeholder);
        return;
      }
      const url = `${basePath}.${IMAGE_FORMATS[index]}`;
      const img = new Image();
      img.onload = () => {
        imageCache.set(basePath, url);
        resolve(url);
      };
      img.onerror = () => tryNext(index + 1);
      img.src = url;
    };
    tryNext(0);
  }).finally(() => inflight.delete(basePath));

  inflight.set(basePath, promise);
  return promise;
};

/**
 * Synchronously return cached URL if available, otherwise null.
 * Useful for rendering: if cached, render immediately; otherwise trigger resolveImageUrl.
 */
export const getCachedImageUrl = (basePath) =>
  basePath ? (imageCache.get(basePath) ?? null) : null;

/**
 * onError handler — advances through formats and writes the winner to cache.
 * Falls back to placeholder when all formats are exhausted.
 */
export const handleImageErrorSimple = (e, basePath) => {
  const currentSrc = e.target.src;

  let currentIndex = -1;
  for (let i = 0; i < IMAGE_FORMATS.length; i++) {
    if (currentSrc.endsWith(`.${IMAGE_FORMATS[i]}`)) {
      currentIndex = i;
      break;
    }
  }

  const nextIndex = currentIndex + 1;

  if (nextIndex >= IMAGE_FORMATS.length) {
    const placeholder = getPlaceholderImage();
    imageCache.set(basePath, placeholder);
    e.target.src = placeholder;
    return;
  }

  const nextUrl = `${basePath}.${IMAGE_FORMATS[nextIndex]}`;
  e.target.src = nextUrl;

  // When this next attempt loads successfully, cache it
  e.target.onload = () => {
    imageCache.set(basePath, nextUrl);
    e.target.onload = null;
  };
};

// Legacy exports kept for compatibility
export const getImageUrl = async (path, filename) => {
  if (!filename) return getPlaceholderImage();
  return resolveImageUrl(`${path}${filename}`);
};

export const handleImageError = (e, basePath, currentFormatIndex, setFormatIndex) => {
  const nextIndex = currentFormatIndex + 1;
  if (nextIndex >= IMAGE_FORMATS.length) {
    e.target.src = getPlaceholderImage();
    return;
  }
  setFormatIndex(nextIndex);
  e.target.src = `${basePath}.${IMAGE_FORMATS[nextIndex]}`;
};

export default {
  getImageUrl,
  getPlaceholderImage,
  handleImageError,
  handleImageErrorSimple,
  resolveImageUrl,
  getCachedImageUrl,
  IMAGE_FORMATS,
};
