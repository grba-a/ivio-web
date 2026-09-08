'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { SCENES } from '@/data/day';
import { SITE } from '@/data/site';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * The day bar is the whole navigation, the whole promise and the progress
 * indicator at once: five moments on one line, in order, the way the day runs.
 *
 * The marker is anchored to the scenes themselves, not to raw page scroll. Map
 * it to scroll and the dot drifts half a screen away from the label it is
 * supposed to be pointing at.
 */
export function DayBar() {
  const [active, setActive] = useState(0);
  const [overlay, setOverlay] = useState(true);
  const barRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const reduced = prefersReducedMotion();
    const el = barRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Anchors must clear the bar; publish its real height rather than guess.
      const publishHeight = () =>
        document.documentElement.style.setProperty('--bar-h', `${el.offsetHeight}px`);
      publishHeight();
      const ro = new ResizeObserver(publishHeight);
      ro.observe(el);

      const last = SCENES.length - 1;
      const place = (i: number, p: number) => {
        if (!markerRef.current || reduced) return;
        const pos = Math.min(1, Math.max(0, (i + p) / last));
        gsap.set(markerRef.current, { xPercent: -50, left: `${pos * 100}%` });
      };

      SCENES.forEach((scene, i) => {
        const target = document.getElementById(scene.id);
        if (!target) return;
        ScrollTrigger.create({
          trigger: target,
          start: 'top 60%',
          end: 'bottom 60%',
          onUpdate: (self) => place(i, self.progress),
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      // Over the hero the bar floats on the photograph instead of cutting a
      // solid strip through it. It only takes on the page palette once the
      // picture is behind you.
      const hero = document.getElementById('top');
      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top+=64',
          onToggle: (self) => setOverlay(self.isActive),
        });
      }

      // Every section - not just the five scenes - drives the chrome colour, so
      // the bar never sits in yesterday's palette over today's background.
      document.querySelectorAll<HTMLElement>('[data-section][data-hour]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) document.documentElement.dataset.active = section.dataset.hour;
          },
        });
      });

      return () => ro.disconnect();
    }, el);

    return () => ctx.revert();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const ink = overlay ? '#fdfaf4' : 'var(--chrome-ink)';
  const line = overlay ? 'rgba(255,255,255,0.38)' : 'var(--chrome-line)';

  return (
    <header
      ref={barRef}
      data-overlay={overlay || undefined}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: overlay ? 'transparent' : 'color-mix(in oklab, var(--chrome-bg) 90%, transparent)',
        color: ink,
        borderBottom: `1px solid ${overlay ? 'transparent' : 'var(--chrome-line)'}`,
        backdropFilter: overlay ? 'none' : 'blur(10px)',
      }}
    >
      {/* Legibility over the picture comes from a scrim that travels with the
          bar - never from dimming the photograph underneath it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[160%] transition-opacity duration-500"
        style={{
          opacity: overlay ? 1 : 0,
          background: 'linear-gradient(to bottom, rgba(4,18,25,0.72) 0%, rgba(4,18,25,0.34) 55%, transparent 100%)',
        }}
      />

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-6 sm:px-6 sm:py-3">
        <a href="#top" className="shrink-0 leading-none" aria-label={`${SITE.name} — back to top`}>
          <span className="font-display text-lg tracking-tight sm:text-xl">Ivio</span>
          <span className="ml-1.5 font-mono text-[9px] tracking-[0.22em] opacity-60 sm:text-[10px]">
            DUBROVNIK
          </span>
        </a>

        {/* Mobile: only the live label fits. Desktop: all five, in order. */}
        <p className="ml-auto font-mono text-[11px] tracking-[0.16em] tabular-nums sm:hidden">
          <span className="opacity-60">{SCENES[active].time}</span>
          <span className="mx-1.5 opacity-35">·</span>
          {SCENES[active].label.toUpperCase()}
        </p>

        <nav aria-label="The day" className="ml-auto hidden sm:block">
          <ul className="flex items-center gap-4 lg:gap-7">
            {SCENES.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={go(s.id)}
                    aria-current={on ? 'true' : undefined}
                    className="group flex items-center gap-1.5 py-1 font-mono text-[11px] tracking-[0.14em] transition-opacity sm:hover:opacity-100"
                    style={{ opacity: on ? 1 : 0.72 }}
                  >
                    <span
                      aria-hidden
                      className="h-1 w-1 rounded-full transition-all duration-300"
                      style={{
                        background: on ? 'var(--color-amber)' : 'currentColor',
                        opacity: on ? 1 : 0.4,
                        transform: on ? 'scale(1.35)' : 'scale(1)',
                      }}
                    />
                    <span className="tabular-nums opacity-70">{s.time}</span>
                    <span className="hidden lg:inline">{s.label.toUpperCase()}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

      </div>

      {/* The line itself. Ticks sit on it; the marker travels between them. */}
      <div className="relative mx-4 h-px sm:mx-6" style={{ background: line }}>
        {SCENES.map((s, i) => (
          <span
            key={s.id}
            aria-hidden
            className="absolute top-1/2 h-1.5 w-px -translate-y-1/2"
            style={{
              left: `${(i / (SCENES.length - 1)) * 100}%`,
              background: line,
            }}
          />
        ))}
        <span
          ref={markerRef}
          aria-hidden
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
          style={{ left: '0%', background: overlay ? 'var(--color-amber)' : 'var(--chrome-ink)' }}
        />
      </div>
    </header>
  );
}
