import type { Scene as SceneType } from '@/data/day';
import media from '@/data/media.json';
import { Picture } from './Picture';
import { RouteLine } from './RouteLine';
import { SceneVideo } from './SceneVideo';
import { whatsapp } from '@/data/site';

const ALT: Record<string, string> = {
  'cove-turquoise-boat': 'A small boat moored in clear turquoise water below a stone house and pines.',
  'coast-outboard': 'The view past the outboard engine towards a pine-covered shore.',
  'islet-sun-clouds': 'Sun breaking through cloud over a small islet, a boat anchored beside it.',
  'cleft-guests': 'Four guests standing at the mouth of a narrow cleft in a limestone cliff.',
  'swimmers-noodles': 'Two swimmers with floats in bright turquoise water beneath a wooded hillside.',
  'sunset-sun-horizon': 'The sun sitting on the horizon behind a headland, its light on the water.',
  'sunset-from-boat': 'Sunset seen from the deck of the boat, another boat silhouetted on the water.',
  'helm-open-sea': "The view forward from the boat's helm, bow pointed at open sea and distant islands.",
  'boat-alone-blue': 'The boat lying alone on deep blue water off a rocky point.',
  'shore-boats-mountains': 'Boats moored off a rocky shore with the mountains behind Dubrovnik in the distance.',
  'bluecave-guests': 'Two guests swimming inside the Blue Cave, the water glowing electric blue around them.',
  'freediver-cave': 'A freediver silhouetted against the lit mouth of a sea cave.',
  'sunset-wake': 'Sunset from the moving boat, the wake running back towards the sun.',
  'sunset-boat-silhouette': 'Another boat in silhouette against an orange sky, the sea gone to silver.',
  'sunset-red-cloud': 'A red band of cloud burning over the horizon after the sun has dropped.',
};

const alt = (id: string) => ALT[id] ?? 'The coast around Dubrovnik.';

/** Support frames sit half a step down and in, so the pair reads as one picture. */
const Support = ({ id, className }: { id: keyof typeof media; className: string }) => (
  <Picture
    id={id}
    alt={alt(id)}
    sizes="(min-width: 1024px) 22vw, 42vw"
    className={`h-full w-full rounded-sm object-cover shadow-[0_18px_50px_-24px_rgba(4,22,30,0.7)] ${className}`}
  />
);

export function Scene({ scene, index }: { scene: SceneType; index: number }) {
  const flipped = index % 2 === 1;
  const { media: m } = scene;

  return (
    <section
      id={scene.id}
      data-section
      data-hour={scene.hour}
      className="bg-bg text-ink"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* --- words --- */}
          <div
            className={`lg:sticky lg:col-span-5 ${flipped ? 'lg:order-2 lg:col-start-8' : ''}`}
            style={{ top: 'calc(var(--bar-h, 4rem) + 4rem)' }}
          >
            <div data-reveal className="flex items-baseline gap-3">
              <span className="font-mono text-sm tabular-nums tracking-[0.12em] text-[var(--accent)]">
                {scene.time}
              </span>
              <span aria-hidden className="h-px flex-1 max-w-16" style={{ background: 'var(--rule)' }} />
              <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--dim)]">
                {scene.label.toUpperCase()}
              </span>
            </div>

            <h2
              data-reveal
              data-reveal-delay="60"
              className="mt-5 text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02] tracking-[-0.015em]"
            >
              {scene.title}
            </h2>

            <p data-reveal data-reveal-delay="120" className="measure mt-6 text-[1.0625rem] leading-[1.72]">
              {scene.body}
            </p>

            <div
              data-reveal
              data-reveal-delay="160"
              className="mt-9 flex items-baseline gap-4 border-t pt-6"
              style={{ borderColor: 'var(--rule)' }}
            >
              <p className="font-display text-[clamp(2.6rem,9vw,3.8rem)] leading-[0.8] tabular-nums" style={{ color: 'var(--accent)' }}>
                {scene.figure.value}
                {scene.figure.unit && (
                  <span className="ml-1 font-mono text-[0.9rem] tracking-[0.06em] align-baseline">
                    {scene.figure.unit}
                  </span>
                )}
              </p>
              <p className="max-w-[22ch] text-[13px] leading-[1.5] text-[var(--dim)]">{scene.figure.caption}</p>
            </div>

            <ul data-reveal data-reveal-delay="200" className="mt-8 space-y-2.5">
              {scene.facts.map((f) => (
                <li key={f} className="flex gap-3 font-mono text-[11px] leading-relaxed tracking-[0.06em] text-[var(--dim)]">
                  <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0" style={{ background: 'var(--accent)' }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              data-reveal
              data-reveal-delay="260"
              href={whatsapp(scene.ask)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-full border px-6 text-[15px] transition-[gap] sm:hover:gap-4"
              style={{ borderColor: 'var(--accent)', color: 'var(--ink)' }}
            >
              {scene.cta}
              <span aria-hidden style={{ color: 'var(--accent)' }}>→</span>
            </a>
          </div>

          {/* --- picture --- */}
          <div className={`lg:col-span-6 ${flipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}>
            {m.kind === 'route' && (
              <div data-reveal className="rounded-sm border px-4 py-8 sm:px-8 sm:py-12" style={{ borderColor: 'var(--rule)' }}>
                <RouteLine route={m.route} className="h-auto w-full" />
              </div>
            )}

            {m.kind === 'photo' && (
              <div data-reveal className="relative">
                <Picture
                  id={m.lead as keyof typeof media}
                  alt={alt(m.lead)}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className="w-full rounded-sm object-cover shadow-[0_28px_70px_-32px_rgba(4,22,30,0.75)]"
                />
                {m.support?.[0] && (
                  <div
                    className="mt-4 grid gap-3 sm:gap-4"
                    style={{ gridTemplateColumns: `repeat(${Math.min(3, m.support.length)}, minmax(0, 1fr))` }}
                  >
                    {m.support.slice(0, 3).map((s) => (
                      <Support key={s} id={s as keyof typeof media} className="aspect-[3/4]" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {m.kind === 'video' && (
              <div data-reveal>
                <SceneVideo
                  id={m.lead as 'cave-glide' | 'coast-run'}
                  label="Gliding into a sea cave, the water lit electric blue from below."
                  className="w-full rounded-sm object-cover shadow-[0_28px_70px_-32px_rgba(0,0,0,0.85)]"
                />
                {m.support?.[0] && (
                  <div
                    className="mt-4 grid gap-3 sm:gap-4"
                    style={{ gridTemplateColumns: `repeat(${Math.min(3, m.support.length)}, minmax(0, 1fr))` }}
                  >
                    {m.support.slice(0, 3).map((s) => (
                      <Support key={s} id={s as keyof typeof media} className="aspect-[3/4]" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
