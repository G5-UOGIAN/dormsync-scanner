/**
 * Utility for loading images with multiple format fallbacks
 * Supports: .png, .jpg, .jpeg, .PNG, .JPG, .JPEG, .webp, .WEBP, .heic, .HEIC
 */

// Supported image formats in order of preference
const IMAGE_FORMATS = [
  'png',
  'jpg',
  'jpeg',
  'PNG',
  'JPG',
  'JPEG',
  'webp',
  'WEBP',
  'heic',
  'HEIC'
];

/**
 * Get the fallback image URL (placeholder SVG)
 * @param {string} text - Text to display in placeholder
 * @returns {string} Data URL for placeholder SVG
 */
export const getPlaceholderImage = (text = 'Image Not Available') => {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f1f5f9" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14"%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
};

/**
 * Try to load an image with multiple format fallbacks
 * @param {string} basePath - Base path without extension (e.g., '/images/students/23021519-147')
 * @param {number} formatIndex - Current format index to try
 * @returns {Promise<string>} Resolves with working image URL or placeholder
 */
const tryLoadImage = (basePath, formatIndex = 0) => {
  return new Promise((resolve) => {
    if (formatIndex >= IMAGE_FORMATS.length) {
      // All formats failed, return placeholder
      resolve(getPlaceholderImage());
      return;
    }

    const format = IMAGE_FORMATS[formatIndex];
    const imageUrl = `${basePath}.${format}`;
    
    const img = new Image();
    
    img.onload = () => {
      // Image loaded successfully
      resolve(imageUrl);
    };
    
    img.onerror = () => {
      // Try next format
      tryLoadImage(basePath, formatIndex + 1).then(resolve);
    };
    
    img.src = imageUrl;
  });
};

/**
 * Get image URL with automatic format detection
 * @param {string} path - Base path to image folder
 * @param {string} filename - Filename without extension
 * @returns {Promise<string>} Promise that resolves with working image URL
 */
export const getImageUrl = async (path, filename) => {
  if (!filename) {
    return getPlaceholderImage();
  }
  
  const basePath = `${path}${filename}`;
  return await tryLoadImage(basePath);
};

/**
 * React hook-friendly image loader with fallback handling
 * Use this in onError handlers for <img> tags
 * @param {Event} e - Error event from img tag
 * @param {string} basePath - Base path without extension
 * @param {number} currentFormatIndex - Current format index (track in state)
 * @param {Function} setFormatIndex - State setter for format index
 */
export const handleImageError = (e, basePath, currentFormatIndex, setFormatIndex) => {
  const nextIndex = currentFormatIndex + 1;
  
  if (nextIndex >= IMAGE_FORMATS.length) {
    // All formats failed, show placeholder
    e.target.src = getPlaceholderImage();
    return;
  }
  
  // Try next format
  setFormatIndex(nextIndex);
  e.target.src = `${basePath}.${IMAGE_FORMATS[nextIndex]}`;
};

/**
 * Simple onError handler that tries all formats sequentially
 * Use this for simpler cases where you don't need state management
 * @param {Event} e - Error event from img tag
 * @param {string} basePath - Base path without extension
 */
export const handleImageErrorSimple = (e, basePath) => {
  const currentSrc = e.target.src;
  
  // Find current format index
  let currentIndex = -1;
  for (let i = 0; i < IMAGE_FORMATS.length; i++) {
    if (currentSrc.endsWith(`.${IMAGE_FORMATS[i]}`)) {
      currentIndex = i;
      break;
    }
  }
  
  const nextIndex = currentIndex + 1;
  
  if (nextIndex >= IMAGE_FORMATS.length) {
    // All formats failed, show placeholder
    e.target.src = getPlaceholderImage();
    return;
  }
  
  // Try next format
  e.target.src = `${basePath}.${IMAGE_FORMATS[nextIndex]}`;
};

export default {
  getImageUrl,
  getPlaceholderImage,
  handleImageError,
  handleImageErrorSimple,
  IMAGE_FORMATS
};
