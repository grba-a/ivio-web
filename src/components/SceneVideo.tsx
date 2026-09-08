'use client';
import { useEffect, useRef } from 'react';
import video from '@/data/video.json';

type Props = { id: keyof typeof video; className?: string; label: string };

/**
 * Plays only while on screen. An always-running background loop burns battery
 * and mobile data for a scene nobody is looking at. With reduced motion the
 * poster stands in and the file is never fetched.
 */
export function SceneVideo({ id, className = '', label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const meta = video[id];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      width={meta.width}
      height={meta.height}
      poster={`/media/${id}-poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      <source src={`/media/${id}.mp4`} type="video/mp4" />
    </video>
  );
}
