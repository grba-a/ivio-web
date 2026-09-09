import { REFERENCES } from '@/data/references';

/**
 * These are messages, not reviews - so they are shown as messages. No stars, no
 * carousel, no five-across grid of stock faces. The proof that Ivio is a person
 * is precisely that people write to him afterwards.
 *
 * Renders nothing at all while the list is empty. Inventing one is not an option.
 */
export function References() {
  if (REFERENCES.length === 0) return null;

  return (
    <section
      id="messages"
      data-section
      data-hour="dawn"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <p data-reveal className="font-mono text-[10px] tracking-[0.24em] text-[var(--dim)]">
          UNPROMPTED
        </p>
        <h2
          data-reveal
          data-reveal-delay="60"
          className="mt-5 max-w-[18ch] text-[clamp(2rem,6vw,3.2rem)] leading-[1.04] tracking-[-0.015em]"
        >
          What people write afterwards.
        </h2>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-12 lg:gap-8">
          {REFERENCES.map((r, i) => (
            <figure
              key={r.id}
              data-reveal
              data-reveal-delay={String(80 + i * 90)}
              className={`relative rounded-sm border p-6 sm:p-8 ${
                r.weight === 'lead' ? 'lg:col-span-7' : 'lg:col-span-5'
              }`}
              style={{ borderColor: 'var(--line)', background: 'color-mix(in oklab, var(--bg) 55%, #fff)' }}
            >
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-[var(--dim)]">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                {r.origin.toUpperCase()}
              </div>

              <blockquote
                className={`mt-5 leading-[1.6] ${
                  r.weight === 'lead'
                    ? 'text-[clamp(1.25rem,3.4vw,1.75rem)] tracking-[-0.01em]'
                    : 'text-[1.0625rem]'
                }`}
              >
                &ldquo;{r.body}&rdquo;
              </blockquote>

              <figcaption className="mt-6 font-mono text-[11px] tracking-[0.14em] text-[var(--dim)]">
                — {r.from.toUpperCase()}
              </figcaption>
            </figure>
          ))}
        </div>

        <p data-reveal className="mt-8 max-w-[60ch] font-mono text-[10px] leading-relaxed tracking-[0.1em] text-[var(--dim)]">
          MESSAGES SENT TO IVIO AFTER THE DAY, QUOTED AS RECEIVED.
        </p>
      </div>
    </section>
  );
}
