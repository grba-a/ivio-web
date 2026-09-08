'use client';
import { useEffect } from 'react';

/**
 * One observer for the whole page. Server components only need to add a
 * `data-reveal` attribute - they stay server components and ship no JS.
 * Elements are visible by default; the CSS only hides them once `data-js`
 * is on the root, so a failed hydration can never leave a blank page.
 */
export function RevealRoot() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${Number(el.dataset.revealDelay || 0)}ms`;
          el.classList.add('is-in');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return null;
}
