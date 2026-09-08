import media from '@/data/media.json';

type MediaId = keyof typeof media;

type Props = {
  id: MediaId;
  alt: string;
  /** Must reflect the real rendered width, or the browser picks the wrong tier. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Zero-JS responsive image.
 *
 * The blur-up placeholder rides on the element's own background, so the real
 * file simply paints over it - no onLoad handler, no client component, and it
 * still works with JavaScript disabled.
 */
export function Picture({ id, alt, sizes, className = '', priority = false }: Props) {
  const m = media[id];
  const srcSet = m.widths.map((w) => `/media/${id}-${w}.webp ${w}w`).join(', ');
  const fallback = m.widths[Math.min(2, m.widths.length - 1)];

  return (
    <img
      src={`/media/${id}-${fallback}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={m.width}
      height={m.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      style={{
        backgroundImage: `url("${m.lqip}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
