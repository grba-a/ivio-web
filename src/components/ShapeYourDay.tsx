'use client';

import { useMemo, useState } from 'react';
import { SITE, whatsapp, REASSURANCE } from '@/data/site';

const WANTS = [
  'Airport transfer',
  'Old Town walk',
  'A day on the boat',
  'Caves & snorkelling',
  'Sunset trip',
  'Not sure yet',
];
const SIZES = ['2 of us', '3–4', '5–6', '7+'];
const WHENS = ['This week', 'Next week', 'Later this season', 'Still deciding'];

const Chip = ({ on, children, ...rest }: React.ComponentProps<'button'> & { on: boolean }) => (
  <button
    type="button"
    aria-pressed={on}
    {...rest}
    className="min-h-11 rounded-full border px-4 text-[14px] transition-all duration-200 active:scale-[0.97]"
    style={{
      borderColor: on ? 'var(--accent)' : 'var(--line)',
      background: on ? 'var(--accent)' : 'transparent',
      color: on ? '#0f1f26' : 'var(--ink)',
      boxShadow: on ? '0 6px 16px -8px color-mix(in oklab, var(--accent) 70%, transparent)' : 'none',
    }}
  >
    {children}
  </button>
);

/** A numbered step marker on the connecting line - the same "one continuous
 *  line" motif as the day bar and the footer clock, just vertical here. */
const StepMark = ({ n, done }: { n: number; done: boolean }) => (
  <span
    aria-hidden
    className="absolute -left-[calc(1.375rem+1px)] flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-colors duration-300 sm:-left-10 sm:h-7 sm:w-7"
    style={{
      background: done ? 'var(--accent)' : 'var(--bg)',
      color: done ? '#0f1f26' : 'var(--dim)',
      border: `1px solid ${done ? 'var(--accent)' : 'var(--line)'}`,
    }}
  >
    {done ? '✓' : n}
  </span>
);

/**
 * There is no booking engine and no price list, so the only real lever left is
 * removing the "what do I even write" pause. Three taps compose the message and
 * hand it to WhatsApp already written. No backend, no calendar, no account.
 */
export function ShapeYourDay() {
  const [wants, setWants] = useState<string[]>([]);
  const [size, setSize] = useState('');
  const [when, setWhen] = useState('');

  const UNSURE = 'Not sure yet';
  const toggle = (w: string) =>
    setWants((prev) => {
      if (prev.includes(w)) return prev.filter((x) => x !== w);
      // "Not sure yet" contradicts every other option, so it is exclusive.
      if (w === UNSURE) return [UNSURE];
      return [...prev.filter((x) => x !== UNSURE), w];
    });

  const message = useMemo(() => {
    const unsureOnly = wants.length === 1 && wants[0] === UNSURE;
    const lines = ['Hi Ivio — I found your website.'];

    if (!wants.length || unsureOnly) {
      lines.push("We're not sure yet what we want — could you tell me what a day with you usually looks like?");
    } else {
      lines.push(`We're interested in: ${wants.join(', ')}.`);
      lines.push('Could you tell me what would work best?');
    }
    if (size) lines.push(`There are ${size.replace(' of us', '')} of us.`);
    if (when) lines.push(`Timing: ${when.toLowerCase()}.`);

    // The two things he always has to ask for anyway.
    lines.push('', 'My name: ', 'Exact dates: ');
    return lines.join('\n');
  }, [wants, size, when]);

  return (
    <section
      id="shape"
      data-section
      data-hour="ink"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p data-reveal className="font-mono text-[10px] tracking-[0.24em] text-[var(--dim)]">
              THE ONLY BOOKING STEP
            </p>
            <h2
              data-reveal
              data-reveal-delay="60"
              className="mt-5 text-[clamp(2.1rem,6.4vw,3.5rem)] leading-[1.03] tracking-[-0.015em]"
            >
              Shape your day.
            </h2>
            <p data-reveal data-reveal-delay="120" className="measure mt-6 text-[1.0625rem] leading-[1.72] text-[var(--dim)]">
              Tap what you fancy — it writes the message for you. I answer personally, usually the
              same day. Nothing is fixed until we both agree it.
            </p>

          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {/* The vertical rule is the same "one continuous line" device as
                the day bar up top and the clock down in the footer - here it
                just runs top to bottom instead of left to right, tying the
                three taps together into one visible sequence. */}
            <div data-reveal data-reveal-delay="80" className="relative space-y-9 pl-9 sm:pl-14">
              <div
                aria-hidden
                className="absolute top-3 bottom-3 left-3 w-px sm:left-6"
                style={{ background: 'var(--rule)' }}
              />

              {/* min-w-0 defeats the UA `min-width: min-content` on fieldset, which
                  otherwise stretches the whole column to the width of every chip. */}
              <fieldset className="relative min-w-0">
                <StepMark n={1} done={wants.length > 0} />
                <legend className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">
                  WHAT SOUNDS GOOD?
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {WANTS.map((w) => (
                    <Chip key={w} on={wants.includes(w)} onClick={() => toggle(w)}>
                      {w}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="relative min-w-0">
                <StepMark n={2} done={!!size} />
                <legend className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">
                  HOW MANY OF YOU?
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {SIZES.map((s) => (
                    <Chip key={s} on={size === s} onClick={() => setSize(size === s ? '' : s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="relative min-w-0">
                <StepMark n={3} done={!!when} />
                <legend className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">
                  WHEN?
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {WHENS.map((w) => (
                    <Chip key={w} on={when === w} onClick={() => setWhen(when === w ? '' : w)}>
                      {w}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* The composed message, read back as a chat bubble - the same
                shape it will actually take a few seconds from now. */}
            <div data-reveal data-reveal-delay="140" className="relative mt-11 pl-9 sm:pl-14">
              <span
                aria-hidden
                className="absolute left-3 top-4 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full sm:left-6 sm:h-7 sm:w-7"
                style={{ background: 'var(--accent)' }}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#0f1f26" aria-hidden>
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
                </svg>
              </span>
              <div
                className="relative rounded-2xl rounded-tl-sm border p-5 sm:p-6"
                style={{ borderColor: 'var(--line)', background: 'color-mix(in oklab, var(--bg) 60%, #fff)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--accent)', boxShadow: '0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)' }}
                  />
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">
                    WRITES ITSELF AS YOU TAP
                  </p>
                </div>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.65]">{message}</p>
              </div>
            </div>

            <div className="pl-9 sm:pl-14">
              <a
                data-reveal
                data-reveal-delay="180"
                href={whatsapp(message)}
                target="_blank"
                rel="noopener noreferrer"
                id="shape-send"
                className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-amber px-7 py-3.5 text-[16px] font-medium text-[#101f26] transition-transform active:scale-[0.99] sm:w-auto sm:hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.43 1.32-1.98 1.36-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.96s.74-2.1 1-2.39c.26-.29.57-.36.76-.36l.54.01c.17.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.32.02.51-.1.19-.15.31-.3.48l-.44.51c-.15.15-.3.31-.13.61.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.19.73-.85.92-1.15.19-.29.39-.24.65-.15.26.1 1.66.78 1.94.93.29.14.48.22.55.34.07.12.07.7-.18 1.38Z" />
                </svg>
                Send it on WhatsApp
              </a>

              <p data-reveal data-reveal-delay="200" className="measure mt-4 text-[13px] leading-relaxed text-[var(--dim)]">
                {REASSURANCE}
              </p>
            </div>

            <div data-reveal data-reveal-delay="240" className="mt-10 border-t pt-8 space-y-3 font-mono text-[11px] tracking-[0.1em]" style={{ borderColor: 'var(--rule)' }}>
              <a href={`tel:${SITE.phoneRaw}`} className="flex min-h-11 items-center gap-3">
                <span className="text-[var(--dim)]">CALL</span>
                <span>{SITE.phone}</span>
              </a>
              <a href={`mailto:${SITE.email}`} className="flex min-h-11 items-center gap-3">
                <span className="text-[var(--dim)]">MAIL</span>
                <span className="break-all">{SITE.email}</span>
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3"
              >
                <span className="text-[var(--dim)]">INSTAGRAM</span>
                <span>@iviobilic</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
