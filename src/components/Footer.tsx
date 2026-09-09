'use client';

import { useEffect, useState } from 'react';
import { SITE, SOCIALS, whatsapp } from '@/data/site';
import { SCENES } from '@/data/day';
import { dubrovnikNow } from '@/lib/time';

/**
 * The page is one day, so the footer is the end of it - and it closes the loop
 * by telling you where in that day Dubrovnik actually is right now.
 *
 * The header's line tracks your scroll. This one tracks the clock. Same
 * instrument, two different readings.
 */
const WHERE: [number, number, string][] = [
  [0, 6, "asleep. The coast is dark and the sea is flat — write anyway, I read it at six."],
  [6, 8, 'on the road to Čilipi, watching an arrivals board.'],
  [8, 11, 'inside the walls, in the two hours before the ships.'],
  [11, 14, 'somewhere past Koločep with the throttle open.'],
  [14, 17, 'under, in a cave that only lights up at this hour.'],
  [17, 19, 'back on deck, everybody drying off.'],
  [19, 22, 'cutting the engine for the sunset.'],
  [22, 24, 'tying up in the dark, answering messages.'],
];

export function Footer() {
  // Rendered client-side only - the clock cannot be known at build time. The
  // placeholder is monospaced and tabular, so the swap costs zero layout shift.
  const [now, setNow] = useState<ReturnType<typeof dubrovnikNow> | null>(null);

  useEffect(() => {
    const tick = () => setNow(dubrovnikNow());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const where = now ? WHERE.find(([a, b]) => now.h >= a && now.h < b)?.[2] : null;
  const dayFraction = now?.fraction ?? 0;

  return (
    <footer
      data-section
      data-hour="ink"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 sm:pt-28">
        <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--dim)]">
          RIGHT NOW IN DUBROVNIK
        </p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <span
            className="font-mono text-[clamp(3.4rem,13vw,7rem)] leading-[0.85] tabular-nums"
            style={{ color: 'var(--accent)' }}
            aria-live="off"
          >
            {now?.label ?? '--:--'}
          </span>
          <p className="max-w-[34ch] text-[1.0625rem] leading-[1.55] text-[var(--dim)]">
            {now ? (
              <>
                I&rsquo;m probably <span style={{ color: 'var(--ink)' }}>{where}</span>
              </>
            ) : (
              <span className="opacity-0">I&rsquo;m probably somewhere out there.</span>
            )}
          </p>
        </div>

        {/* The day line again - this time reading the clock, not your scroll. */}
        <div className="relative mt-12 h-px" style={{ background: 'var(--rule)' }}>
          {SCENES.map((s) => {
            const [hh, mm] = s.time.split(':').map(Number);
            return (
              <span
                key={s.id}
                aria-hidden
                className="absolute top-1/2 h-2 w-px -translate-y-1/2"
                style={{ left: `${((hh * 60 + mm) / 1440) * 100}%`, background: 'var(--tick)' }}
              />
            );
          })}
          <span
            aria-hidden
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left] duration-1000"
            style={{ left: `${dayFraction * 100}%`, background: 'var(--accent)', opacity: now ? 1 : 0 }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[9px] tracking-[0.18em] text-[var(--dim)]">
          <span>00:00</span>
          <span className="hidden sm:inline">12:00</span>
          <span>24:00</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <p className="font-display text-[clamp(1.9rem,5vw,2.6rem)] leading-none">Ivio Bilić</p>
            <p className="mt-4 max-w-[26ch] text-[15px] leading-relaxed text-[var(--dim)]">
              One local for the whole of it — the airport, the walls, the boat, the sea, the last
              light.
            </p>
            <a
              href={whatsapp('Hi Ivio — I found your website and I have a question.')}
              target="_blank"
              rel="noopener noreferrer"
              id="footer-cta"
              className="mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-amber px-6 text-[15px] font-medium text-[#101f26]"
            >
              Start a message
            </a>
          </div>

          <div className="sm:col-span-3 sm:col-start-7">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">REACH ME</p>
            <ul className="mt-4 space-y-3 font-mono text-[11px] tracking-[0.08em]">
              <li>
                <a href={`tel:${SITE.phoneRaw}`} className="inline-flex min-h-11 items-center">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center break-all">
                  {SITE.email}
                </a>
              </li>
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2"
                  >
                    <span className="text-[var(--dim)]">{s.label.toUpperCase()}</span>
                    <span>{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">WHERE</p>
            <ul className="mt-4 space-y-2 font-mono text-[11px] leading-relaxed tracking-[0.08em]">
              {SITE.areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-2 border-t pt-6 font-mono text-[9px] tracking-[0.18em] text-[var(--dim)] sm:flex-row sm:justify-between"
          style={{ borderColor: 'var(--rule)' }}
        >
          <span>© {new Date().getFullYear()} IVIO BILIĆ</span>
          <span>DUBROVNIK, CROATIA</span>
        </div>
      </div>
    </footer>
  );
}
