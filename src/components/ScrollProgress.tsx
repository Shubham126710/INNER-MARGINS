'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!barRef.current) return;
      const docEl = document.documentElement;
      const body = document.body;
      const scrollingEl = document.scrollingElement || docEl;

      const scrollTop = window.scrollY || scrollingEl.scrollTop || (body ? body.scrollTop : 0) || 0;
      const scrollHeight = Math.max(
        scrollingEl.scrollHeight,
        docEl ? docEl.scrollHeight : 0,
        body ? body.scrollHeight : 0
      );
      const clientHeight = window.innerHeight || scrollingEl.clientHeight || 1;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 2) {
        barRef.current.style.transform = 'scaleX(0)';
        ticking = false;
        return;
      }

      // Handle subpixel rounding on high-DPI displays so it accurately reaches 100%
      let progress: number;
      if (scrollTop <= 1) {
        progress = 0;
      } else if (maxScroll - scrollTop <= 2) {
        progress = 1;
      } else {
        progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      }

      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    };

    // Calculate immediately on mount / route change
    updateProgress();
    const rafId = window.requestAnimationFrame(updateProgress);

    // Timers for async content hydration / data fetching (e.g. About page 800ms simulated load)
    const timer1 = setTimeout(updateProgress, 100);
    const timer2 = setTimeout(updateProgress, 500);
    const timer3 = setTimeout(updateProgress, 1000);

    // Passive scroll & resize listeners
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Handle document fonts ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateProgress).catch(() => {});
    }

    // Observe DOM mutations & height changes dynamically
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(onScrollOrResize);
      resizeObserver.observe(document.body);
      if (document.documentElement) {
        resizeObserver.observe(document.documentElement);
      }
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none bg-retro-surface/80 border-b border-retro-border/20 backdrop-blur-xs"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-retro-primary will-change-transform"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: '0 50%',
        }}
      />
    </div>
  );
}
