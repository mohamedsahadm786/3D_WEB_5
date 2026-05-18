import { resolveImage, isVideo } from '@/lib/images';
import Placeholder from './Placeholder';

interface ImgProps {
  /** "folder/name" without extension — see changes/content-and-assets.md §7. */
  name: string;
  alt?: string;
  fit?: 'cover' | 'contain';
  rounded?: boolean;
  tint?: [string, string];
  fallback?: string;
  className?: string;
}

/*
 * Renders the real photo, a looping muted video, or a sized placeholder.
 * Drop a correctly-named file into src/images/<folder>/ and it appears — no code change.
 */
export default function Img({
  name,
  alt = '',
  fit = 'cover',
  rounded = false,
  tint,
  fallback,
  className = '',
}: ImgProps) {
  const url = resolveImage(name);
  const radius = rounded ? 'rounded-full' : '';
  const objectFit = fit === 'cover' ? 'object-cover' : 'object-contain';

  if (!url) {
    return (
      <Placeholder
        label={fallback ?? name.split('/').pop()}
        tint={tint}
        rounded={rounded}
        className={className}
      />
    );
  }

  if (isVideo(name)) {
    return (
      <video
        className={`h-full w-full ${objectFit} ${radius} ${className}`}
        src={url}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <img
      className={`h-full w-full ${objectFit} ${radius} ${className}`}
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
