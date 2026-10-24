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
      const docElement = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || docElement.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(
        docElement.scrollHeight,
        body.scrollHeight,
        docElement.offsetHeight,
        body.offsetHeight
      );
      const clientHeight = window.innerHeight || docElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      const progress = maxScroll > 2 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Calculate immediately on mount / route change
    updateProgress();

    // Listen to scroll and resize with passive listeners
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Observe document body for DOM changes (async data loading, images, tip-tap)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onScrollOrResize);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-retro-border/20"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-retro-primary origin-left scale-x-0 will-change-transform"
      />
    </div>
  );
}
