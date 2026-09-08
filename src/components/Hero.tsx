import media from '@/data/media.json';
import { whatsapp, DEFAULT_MESSAGE } from '@/data/site';

const MOBILE = 'islet-sun-clouds';
const DESKTOP = 'hero-islet-gold';

const srcset = (id: keyof typeof media) =>
  media[id].widths.map((w) => `/media/${id}-${w}.webp ${w}w`).join(', ');

/**
 * Art-directed rather than cropped: the same islet, the same light, shot both
 * ways. A 4:3 landscape squeezed into a 9:16 phone throws away most of the
 * frame, and this page will be read on a phone far more often than not.
 *
 * The intro is CSS keyframes. Running the H1 through GSAP costs ~5s of mobile
 * LCP for an animation the browser can do before hydration.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-section
      data-hour="ink"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={srcset(DESKTOP)} sizes="100vw" />
        <img
          src={`/media/${MOBILE}-1080.webp`}
          srcSet={srcset(MOBILE)}
          sizes="100vw"
          width={media[MOBILE].width}
          height={media[MOBILE].height}
          alt="A pine-covered islet off Dubrovnik in the late afternoon, a small boat moored alongside it."
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          style={{ backgroundImage: `url("${media[MOBILE].lqip}")`, backgroundSize: 'cover' }}
        />
      </picture>

      {/* Two layers instead of one heavy scrim.
          Measured over the real pixels, a single full-frame scrim strong enough
          to carry the headline (>4.5:1) flattens the sky and the sun into mud.
          So: a vertical wash that keeps the top of the picture almost clean,
          plus a plate anchored to the bottom-left corner where the type
          actually sits. The islet, the sun and the water stay photographs. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(4,18,25,0.86) 0%, rgba(4,18,25,0.55) 26%, rgba(4,18,25,0.12) 56%, rgba(4,18,25,0.30) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-[30%] -z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(4,18,25,0.80) 0%, rgba(4,18,25,0.62) 30%, rgba(4,18,25,0.28) 58%, transparent 82%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 26%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 26%)',
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-28 sm:px-6 sm:pb-20">
        <p
          className="rise font-mono text-[10px] tracking-[0.28em] text-[#cfe3e0] sm:text-xs"
          style={{ animationDelay: '80ms' }}
        >
          DUBROVNIK · CAVTAT · ELAPHITI
        </p>

        <h1
          className="rise mt-5 max-w-[17ch] text-[clamp(2.6rem,10.5vw,6.5rem)] leading-[0.94] tracking-[-0.02em] text-[#fdfaf4]"
          style={{ animationDelay: '160ms' }}
        >
          One local.
          <br />
          Your entire
          <br />
          {/* The payoff word carries the brand orange as a lighter tint. The
              solid #e08b3c stays reserved for filled buttons, so "filled means
              clickable" survives and the headline still reads over the photo. */}
          <span
            className="italic"
            style={{ fontVariationSettings: '"WONK" 1, "SOFT" 40', color: '#f4c294' }}
          >
            Dubrovnik.
          </span>
        </h1>

        <p
          className="rise measure mt-6 text-[1.0625rem] leading-relaxed text-[#dfe9e6] sm:mt-7 sm:text-lg"
          style={{ animationDelay: '260ms' }}
        >
          The ride from the airport, the walls before the crowds, the boat, the caves, the last
          light. One person. One number.
        </p>

        <div
          className="rise mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
          style={{ animationDelay: '360ms' }}
        >
          <a
            href={whatsapp(DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#e08b3c] px-7 text-[15px] font-medium text-[#101f26] transition-transform active:scale-[0.98] sm:hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.43 1.32-1.98 1.36-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.96s.74-2.1 1-2.39c.26-.29.57-.36.76-.36l.54.01c.17.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.32.02.51-.1.19-.15.31-.3.48l-.44.51c-.15.15-.3.31-.13.61.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.19.73-.85.92-1.15.19-.29.39-.24.65-.15.26.1 1.66.78 1.94.93.29.14.48.22.55.34.07.12.07.7-.18 1.38Z" />
            </svg>
            Message Ivio on WhatsApp
          </a>
          <a
            href="#airport"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 text-[15px] text-[#e8f0ee] transition-colors sm:hover:border-white/70"
          >
            See the day
          </a>
        </div>

        <p
          className="rise mt-9 font-mono text-[10px] leading-relaxed tracking-[0.16em] text-[#a9c2c0] sm:mt-12"
          style={{ animationDelay: '460ms' }}
        >
          ONE DAY, FROM 06:40 TO 19:50 ↓
        </p>
      </div>
    </section>
  );
}
