import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getPlaceholderImage } from '../utils/imageLoader';

const IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'webp', 'WEBP', 'heic', 'HEIC'];

const resolveImageUrl = (basePath) => {
  return new Promise((resolve) => {
    const tryNext = (index) => {
      if (index >= IMAGE_FORMATS.length) {
        resolve(getPlaceholderImage('Image Not Found'));
        return;
      }
      const url = `${basePath}.${IMAGE_FORMATS[index]}`;
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => tryNext(index + 1);
      img.src = url;
    };
    tryNext(0);
  });
};

const FullscreenImageViewer = ({ basePath, alt, onClose }) => {
  const [resolvedSrc, setResolvedSrc] = useState(null);

  useEffect(() => {
    if (!basePath) return;
    resolveImageUrl(basePath).then(setResolvedSrc);
  }, [basePath]);

  if (!basePath) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 h-9 w-9"
      >
        <X size={20} />
      </Button>
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={alt || 'Full size image'}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="text-white text-sm">Loading...</div>
      )}
    </div>
  );
};

export default FullscreenImageViewer;
