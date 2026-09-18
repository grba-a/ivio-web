'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase, type Review } from '@/lib/supabase';

const MAX_NAME = 60;
const MAX_BODY = 600;
const AUTOPLAY_MS = 4500;

function StarIcon({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill={filled ? 'var(--accent)' : 'var(--line)'}>
      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
    </svg>
  );
}

/** Read-only rating display, e.g. under a quote - not the picker. */
function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < count} size={size} />
      ))}
    </span>
  );
}

/**
 * Replaces the old curated "messages" section: this one is open to anyone,
 * live the moment it's submitted. That trades away "provably real" for
 * "actually current" - a deliberate call, not an oversight. Bad ones get
 * pulled by hand in the Supabase table editor, not gated before they show.
 */
export function Reviews() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [index, setIndex] = useState(0);
  const reducedMotion = useRef(false);

  const [name, setName] = useState('');
  const [stars, setStars] = useState(0);
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [starTouched, setStarTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []));
  }, []);

  // Restarting the timer on every index change - whatever set it, autoplay,
  // a dot click, or a fresh submission - gives each review the same full
  // look before it advances, instead of a stale interval cutting one short.
  useEffect(() => {
    if (reducedMotion.current || !reviews || reviews.length <= 1) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % reviews.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, reviews]);

  async function submit() {
    if (honeypot) {
      setName('');
      setBody('');
      setStars(0);
      return;
    }
    setStarTouched(true);
    if (!name.trim() || !body.trim() || stars < 1) return;

    setStatus('sending');
    const { data, error } = await supabase
      .from('reviews')
      .insert({ name: name.trim().slice(0, MAX_NAME), stars, body: body.trim().slice(0, MAX_BODY) })
      .select()
      .single();

    if (error || !data) {
      setStatus('error');
      return;
    }

    setReviews((prev) => [data, ...(prev ?? [])]);
    setIndex(0);
    setName('');
    setBody('');
    setStars(0);
    setStarTouched(false);
    setStatus('sent');
  }

  const current = reviews && reviews.length > 0 ? reviews[index] : null;

  return (
    <section id="reviews" data-section data-hour="dawn" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28">
        <p data-reveal className="font-mono text-[10px] tracking-[0.24em] text-[var(--dim)]">
          OPEN TO EVERYONE
        </p>
        <h2
          data-reveal
          data-reveal-delay="60"
          className="mt-5 max-w-[18ch] text-[clamp(2rem,6vw,3.2rem)] leading-[1.04] tracking-[-0.015em]"
        >
          What people write afterwards.
        </h2>

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <figure
              className="relative flex min-h-[240px] flex-col justify-center rounded-sm border p-6 sm:p-8"
              style={{ borderColor: 'var(--line)', background: 'color-mix(in oklab, var(--bg) 55%, #fff)' }}
            >
              {current ? (
                <>
                  <Stars count={current.stars} size={16} />
                  <blockquote className="mt-5 text-[clamp(1.25rem,3.4vw,1.75rem)] leading-[1.5] tracking-[-0.01em]">
                    &ldquo;{current.body}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 font-mono text-[11px] tracking-[0.14em] text-[var(--dim)]">
                    — {current.name.toUpperCase()}
                  </figcaption>
                </>
              ) : (
                <p className="text-[1.0625rem] text-[var(--dim)]">
                  {reviews === null ? 'Loading…' : 'Be the first to write one →'}
                </p>
              )}

              {reviews && reviews.length > 1 && (
                <div className="mt-6 flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show review ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className="h-1.5 w-1.5 rounded-full transition-colors"
                      style={{ background: i === index ? 'var(--accent)' : 'var(--line)' }}
                    />
                  ))}
                </div>
              )}
            </figure>

            <p className="mt-6 max-w-[60ch] font-mono text-[10px] leading-relaxed tracking-[0.1em] text-[var(--dim)]">
              WRITTEN DIRECTLY ON THIS PAGE, LIVE, BY WHOEVER WANTS TO.
            </p>
          </div>

          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">WRITE YOURS</p>

            <div className="mt-4 flex flex-col gap-3">
              {/* Honeypot: real visitors never see or fill this. */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_NAME}
                className="min-h-11 rounded-lg border px-4 text-[15px]"
                style={{ borderColor: 'var(--line)', background: 'var(--bg)', color: 'var(--ink)' }}
              />

              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      onClick={() => setStars(n)}
                      className="p-1"
                    >
                      <StarIcon filled={stars >= n} size={22} />
                    </button>
                  ))}
                </div>
                {starTouched && stars < 1 && (
                  <p className="mt-1 text-[12px]" style={{ color: 'var(--accent)' }}>
                    Tap a star to rate your day.
                  </p>
                )}
              </div>

              <textarea
                placeholder="How was your day?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={MAX_BODY}
                rows={4}
                className="rounded-lg border px-4 py-3 text-[15px] leading-relaxed"
                style={{ borderColor: 'var(--line)', background: 'var(--bg)', color: 'var(--ink)' }}
              />

              <button
                type="button"
                onClick={submit}
                disabled={status === 'sending'}
                className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber px-7 text-[15px] font-medium text-[#101f26] transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                {status === 'sending' ? 'Posting…' : 'Post it'}
              </button>

              {status === 'sent' && (
                <p className="text-[13px]" style={{ color: 'var(--dim)' }}>
                  Thanks — it&apos;s live above.
                </p>
              )}
              {status === 'error' && (
                <p className="text-[13px]" style={{ color: 'var(--accent)' }}>
                  Something went wrong — try again in a moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
