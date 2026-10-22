'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';
import Magnetic from '@/components/Magnetic';

export default function HomeCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.cta-content', {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 border-t border-retro-border/40 bg-retro-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,var(--retro-text)_0%,transparent_70%)] pointer-events-none" />
      <div className="cta-content max-w-4xl mx-auto px-6 lg:px-12 text-center relative">
        <div className="inline-flex justify-center items-center w-16 h-16 mb-8 border border-retro-text/20 bg-retro-surface/50 rotate-45 transition-transform hover:rotate-90 duration-500">
          <div className="w-8 h-8 border border-retro-primary/50 relative -rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-retro-text animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-heading uppercase mb-4 text-retro-text opacity-90 tracking-tight">
          Awaiting new input...
        </h2>
        <p className="font-mono text-sm mb-10 max-w-md mx-auto text-retro-text/60 leading-relaxed uppercase tracking-wide">
          Record a thought. Unload the cache. Save state.
        </p>
        <Magnetic strength={0.3}>
          <Link href="/write" className="btn-primary no-underline text-xs tracking-widest">
            Initiate Sequence
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
