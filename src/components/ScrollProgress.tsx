'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      },
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-retro-border/20">
      <div
        ref={barRef}
        className="h-full w-full bg-retro-primary origin-left scale-x-0"
      />
    </div>
  );
}
