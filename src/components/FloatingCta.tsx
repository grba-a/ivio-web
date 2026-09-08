'use client';
import { useEffect, useState } from 'react';
import { whatsapp, DEFAULT_MESSAGE } from '@/data/site';

/**
 * Appears once the hero is gone and stands down whenever the real booking CTA
 * is on screen - a floating pill parked on top of the button it duplicates is
 * worse than no floating pill.
 *
 * The "off screen" test is checkVisibility(), not a scrollY threshold: the
 * arithmetic version fires while the target is still perfectly visible.
 */
export function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const evaluate = () => {
      const hero = document.getElementById('top');
      const anchor = document.getElementById('shape');
      const heroGone = hero ? hero.getBoundingClientRect().bottom < 80 : false;

      let anchorVisible = false;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        const onScreen = r.top < window.innerHeight && r.bottom > 0;
        anchorVisible =
          onScreen && (typeof anchor.checkVisibility === 'function' ? anchor.checkVisibility() : true);
      }
      setShow(heroGone && !anchorVisible);
    };

    // Let the fade settle before re-measuring, or the pill flickers at the seam.
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(evaluate, 120);
      evaluate();
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <a
      href={whatsapp(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className="fixed bottom-5 right-4 z-40 inline-flex min-h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#e08b3c] px-6 text-[15px] font-medium text-[#101f26] shadow-[0_10px_36px_-10px_rgba(4,22,30,0.65)] transition-all duration-300 sm:bottom-7 sm:right-7"
      style={{
        opacity: show ? 1 : 0,
        transform: `translateY(${show ? '0' : '1.25rem'})`,
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.69-1.43 1.32-1.98 1.36-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.96s.74-2.1 1-2.39c.26-.29.57-.36.76-.36l.54.01c.17.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.32.02.51-.1.19-.15.31-.3.48l-.44.51c-.15.15-.3.31-.13.61.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.45.29.15.46.13.63-.08.17-.19.73-.85.92-1.15.19-.29.39-.24.65-.15.26.1 1.66.78 1.94.93.29.14.48.22.55.34.07.12.07.7-.18 1.38Z" />
      </svg>
      Message Ivio
    </a>
  );
}
