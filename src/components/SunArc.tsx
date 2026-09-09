'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { dubrovnikNow } from '@/lib/time';

const W = 340;
const H = 60;
const ARC = `M 8 50 Q ${W / 2} 4 ${W - 8} 50`;

/**
 * A live instrument, not a decoration: the dot sits at today's real position
 * between the 06:40 start and 19:50 close of the page's own day, in Dubrovnik
 * time. Same clock as the footer, same line motif as the day bar - this is
 * that idea's first appearance, right in the hero, so the promise ("one day,
 * start to finish") is legible in two seconds rather than proven only after
 * a long scroll.
 *
 * Motion follows the "Premium" personality (350-600ms, cubic-bezier(0.4,0,0.2,1),
 * no overshoot) from the motion-design skill: primary = the arc drawing in,
 * secondary = the dot's glow arriving with it, ambient = a slow breathing
 * pulse once settled. Entrance duration sits in the "dramatic reveal" band
 * (600-1200ms) appropriate for a hero-level element seen once per visit.
 */
export function SunArc({ className = '' }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dot, setDot] = useState<{ x: number; y: number } | null>(null);
  const [now, setNow] = useState<ReturnType<typeof dubrovnikNow> | null>(null);

  useLayoutEffect(() => {
    const place = () => {
      const path = pathRef.current;
      if (!path) return;
      const t = dubrovnikNow();
      setNow(t);
      // The day runs 06:40-19:50 on this page; clamp outside that so the dot
      // never wanders off the drawn arc during the night.
      const dayStart = 6 * 60 + 40;
      const dayEnd = 19 * 60 + 50;
      const minutes = Math.min(dayEnd, Math.max(dayStart, t.h * 60 + t.m));
      const frac = (minutes - dayStart) / (dayEnd - dayStart);
      const len = path.getTotalLength();
      const p = path.getPointAtLength(len * frac);
      setDot({ x: p.x, y: p.y });
    };
    place();
    const id = setInterval(place, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`sun-arc ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" style={{ maxWidth: `${W}px` }}>
        <path
          ref={pathRef}
          d={ARC}
          fill="none"
          stroke="#f4c294"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d={ARC}
          fill="none"
          stroke="#f4c294"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          className="sun-arc__draw"
        />
        {dot && (
          // Position travels through --sun-x/--sun-y, not a direct transform:
          // the entrance keyframes also animate transform, and a CSS animation
          // always wins that property over a plain inline value - setting the
          // custom properties instead lets both compose correctly.
          <g
            className="sun-arc__dot"
            style={{ '--sun-x': `${dot.x}px`, '--sun-y': `${dot.y}px` } as React.CSSProperties}
          >
            <circle r="7" fill="#e08b3c" opacity="0.22" className="sun-arc__glow" />
            <circle r="3.2" fill="#f4c294" />
          </g>
        )}
      </svg>
      {/* Always rendered - with JS off, or before the clock resolves, this is
          exactly the static line the hero used to close on. Progressive
          enhancement, not a replacement that can leave no-JS readers with
          nothing. */}
      <p className="sun-arc__label font-mono text-[10px] leading-relaxed tracking-[0.16em] text-[#a9c2c0]">
        {now ? `${now.label} IN DUBROVNIK, RIGHT NOW ↓` : 'ONE DAY, FROM 06:40 TO 19:50 ↓'}
      </p>
    </div>
  );
}
