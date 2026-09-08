import { Picture } from './Picture';

/**
 * The graduation photograph is the only hard, checkable credential in the whole
 * brief - the Rector's Award and a summa cum laude from the University of
 * Dubrovnik. It outranks any generic "licensed guide" badge.
 *
 * Flip this to false if Ivio would rather it stayed private; the section then
 * degrades to text with no claim attached.
 */
const SHOW_CREDENTIAL = true;

export function Ivio() {
  return (
    <section
      id="ivio"
      data-section
      data-hour="paper"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div data-reveal className="relative">
              <Picture
                id="ivio-graduation"
                alt="Ivio Bilić receiving his diploma and the Rector's Award at the University of Dubrovnik."
                sizes="(min-width: 1024px) 56vw, 92vw"
                className="w-full rounded-sm object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p data-reveal className="font-mono text-[10px] tracking-[0.24em] text-[var(--dim)]">
              WHO IS DRIVING
            </p>

            <h2 data-reveal data-reveal-delay="60" className="mt-5 text-[clamp(2.1rem,6.4vw,3.4rem)] leading-[1.04] tracking-[-0.015em]">
              Ivio Bilić
            </h2>

            <blockquote data-reveal data-reveal-delay="110" className="measure mt-7 border-l-2 pl-5 text-[1.125rem] leading-[1.6] italic" style={{ borderColor: 'var(--accent)' }}>
              “I want you to feel this coast the way I do — and to leave certain that you are coming
              back.”
            </blockquote>

            <p data-reveal data-reveal-delay="170" className="measure mt-7 text-[1.0625rem] leading-[1.72] text-[var(--dim)]">
              I grew up on this stretch of water, between Cavtat and the Elaphiti. I know which bay
              is calm when the wind turns, which cave lights up at which hour, and which street in
              the Old Town is worth walking at eight in the morning rather than at noon.
            </p>

            <p data-reveal data-reveal-delay="210" className="measure mt-5 text-[1.0625rem] leading-[1.72] text-[var(--dim)]">
              You will have the same person for the whole trip. That is the entire idea.
            </p>

            {SHOW_CREDENTIAL && (
              <div
                data-reveal
                data-reveal-delay="260"
                className="mt-9 rounded-sm border p-5"
                style={{ borderColor: 'var(--line)' }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">CREDENTIALS</p>
                <p className="mt-3 text-[15px] leading-relaxed">
                  <strong className="font-medium">University of Dubrovnik</strong> — graduated{' '}
                  <em>summa cum laude</em> and awarded the{' '}
                  <strong className="font-medium">Rector&rsquo;s Award</strong>, the university&rsquo;s
                  highest student distinction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
