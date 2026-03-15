import { useRef, useState, useEffect } from 'react';
import { resolveImageUrl, getCachedImageUrl } from '../utils/imageLoader';

/**
 * LazyAvatar — renders a profile avatar that:
 *  1. Only starts loading when it enters the viewport (IntersectionObserver)
 *  2. Uses the module-level image cache so the same basePath is never probed twice
 *
 * Props:
 *  basePath  — path without extension, e.g. "/images/students/23021519-147"
 *  size      — Tailwind size classes, default "w-8 h-8"
 *  fallback  — React node shown while loading or when no basePath
 *  className — extra classes on the wrapper div
 */
const LazyAvatar = ({ basePath, size = 'w-8 h-8', fallback, className = '' }) => {
  const ref = useRef(null);
  const [src, setSrc] = useState(() => getCachedImageUrl(basePath));
  const [entered, setEntered] = useState(() => !!getCachedImageUrl(basePath));

  // Reset when basePath changes (e.g. list reorder after search)
  useEffect(() => {
    const cached = getCachedImageUrl(basePath);
    setSrc(cached);
    setEntered(!!cached);
  }, [basePath]);

  useEffect(() => {
    if (!basePath || src) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setEntered(true);
          resolveImageUrl(basePath).then(setSrc);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [basePath, src]);

  return (
    <div
      ref={ref}
      className={`${size} rounded-full bg-cyan-100 dark:bg-cyan-950 overflow-hidden flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0 ${className}`}
    >
      {src && entered ? (
        <img src={src} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyAvatar;
