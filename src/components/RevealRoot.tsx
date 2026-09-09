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
          // The end state is set as an inline style, not just a class. A
          // stylesheet rule can lose a cascade tie it should win - a transition
          // frozen mid-flight by a backgrounded tab left elements pinned at
          // opacity 0 forever in testing, even though the CSS was correct.
          // Inline style has no such failure mode: it's maximum specificity, so
          // the revealed state can never get stuck behind a stale cascade.
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.classList.add('is-in');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );
    nodes.forEach((n) => io.observe(n));

    // Safety net: if a tab is backgrounded mid-transition (mobile Safari does
    // this constantly on app-switch), re-assert the inline end state for
    // anything already marked revealed once the page is visible again.
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      document.querySelectorAll<HTMLElement>('[data-reveal].is-in').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // One delegated handler for every in-page anchor. Without it a fragment link
  // silently stops working the second time it is clicked: the hash is already
  // set, so the browser fires no navigation and nothing scrolls.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      history.replaceState(null, '', id ? `#${id}` : location.pathname);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
