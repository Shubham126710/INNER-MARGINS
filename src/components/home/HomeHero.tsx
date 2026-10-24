'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';
import { Greeting } from '@/components/Greeting';
import Magnetic from '@/components/Magnetic';

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(
        '.hero-title',
        {
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: 'expo.out',
        }
      )
        .from(
          '.hero-desc',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          '-=0.4'
        )
        .from(
          '.hero-btn',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: 'back.out(1.5)',
          },
          '-=0.3'
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative py-16 lg:py-28 overflow-hidden border-b border-retro-border/30 bg-retro-bg"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
        <h1 className="hero-title text-4xl md:text-5xl lg:text-7xl font-heading uppercase text-retro-text mb-6 tracking-tight">
          Inner Margins
        </h1>

        <div className="hero-desc">
          <p className="text-sm md:text-base text-retro-text/80 font-body max-w-xl mx-auto leading-relaxed mb-2">
            <Greeting />
          </p>
          <p className="text-sm md:text-base text-retro-primary font-body max-w-xl mx-auto leading-relaxed">
            System memory synchronized. Awaiting input<span className="blink-cursor" />
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md mx-auto">
          <div className="hero-btn w-full sm:w-auto">
            <Magnetic strength={0.3}>
              <Link
                href="/journals"
                className="btn-primary no-underline w-full sm:w-auto shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-retro-primary"
              >
                Press Start To Remember
              </Link>
            </Magnetic>
          </div>

          <div className="hero-btn w-full sm:w-auto">
            <Magnetic strength={0.3}>
              <Link
                href="/write"
                className="btn-secondary no-underline w-full sm:w-auto shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-retro-primary"
              >
                New Transmission
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
