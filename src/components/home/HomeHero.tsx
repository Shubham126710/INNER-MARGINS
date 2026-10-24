'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';
import { Greeting } from '@/components/Greeting';
import Magnetic from '@/components/Magnetic';
import { BlogPost } from '@/lib/types';
import { AnalysisStats } from '@/actions/analysis.actions';
import { cleanExcerpt } from '@/lib/utils';

interface HomeHeroProps {
  latestPost?: BlogPost;
  stats?: AnalysisStats;
}

export default function HomeHero({ latestPost, stats }: HomeHeroProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-telemetry', {
        opacity: 0,
        y: -6,
        duration: 0.35,
        ease: 'power2.out',
      })
        .from(
          '.hero-word-inner',
          {
            opacity: 0,
            y: 12,
            duration: 0.45,
            ease: 'expo.out',
          },
          '-=0.15'
        )
        .from(
          '.hero-word-margins',
          {
            opacity: 0,
            x: -12,
            duration: 0.45,
            ease: 'expo.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-manifesto',
          {
            opacity: 0,
            y: 8,
            duration: 0.35,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .from(
          ['.hero-cta-primary', '.hero-cta-secondary'],
          {
            opacity: 0,
            y: 8,
            duration: 0.35,
            stagger: 0.05,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .from(
          '.hero-fragment',
          {
            opacity: 0,
            y: 12,
            duration: 0.45,
            ease: 'expo.out',
          },
          '-=0.3'
        );
    },
    { scope: containerRef }
  );

  const formattedLatestDate = latestPost
    ? new Date(latestPost.createdAt).toLocaleDateString('en-US', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <section
      ref={containerRef}
      className="relative py-6 sm:py-8 lg:py-10 border-b-2 border-retro-border/30 bg-retro-bg overflow-hidden"
    >
      {/* Subtle CRT Raster Atmosphere */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--retro-surface)_0%,transparent_75%)] opacity-35 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Outer Frame: Unified Retro Terminal / Folio Container */}
        <div className="border-2 border-retro-border bg-retro-surface/35 p-5 sm:p-6 lg:p-7 shadow-retro-sm relative">
          
          {/* Top Archival Telemetry Rail */}
          <div className="hero-telemetry flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-6 border-b border-retro-border/25 text-xs font-body text-retro-text/75">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-retro-primary animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="font-body text-xs text-retro-text/80 font-medium">Terminal buffer // vol. 01</span>
              <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
              <Greeting />
            </div>

            <div className="flex items-center gap-3 text-xs font-body text-retro-text/70">
              <div>
                <span className="text-retro-text/50">Cycles:</span>{' '}
                <span className="font-mono text-retro-text font-medium">{stats?.totalEntries ?? 0}</span>
              </div>
              <span className="h-3 w-px bg-retro-border/30" aria-hidden="true" />
              <div>
                <span className="text-retro-text/50">Streak:</span>{' '}
                <span className="font-mono text-retro-text font-medium">{stats?.currentStreak ?? 0}</span>d
              </div>
            </div>
          </div>

          {/* Two-Column Editorial Folio Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Heading, Description, and Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h1 className="hero-title font-heading tracking-tight text-retro-text mb-3 leading-[1.05]">
                <span className="hero-word-inner block text-3xl sm:text-4xl lg:text-[2.75rem] break-words">
                  Inner
                </span>
                <span className="hero-word-margins block text-3xl sm:text-4xl lg:text-[2.75rem] text-retro-primary mt-1 sm:pl-4 break-words">
                  Margins
                </span>
              </h1>

              {/* Introspective Editorial Premise */}
              <div className="hero-manifesto max-w-lg mb-6 pl-3.5 border-l-2 border-retro-primary/70">
                <p className="font-body text-xs sm:text-sm text-retro-text/85 leading-relaxed font-normal">
                  An emotional operating system preserving lost thoughts and private memories.
                </p>
              </div>

              {/* Action Controls */}
              <div className="hero-actions flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                <div className="hero-cta-primary w-full sm:w-auto">
                  <Magnetic strength={0.2}>
                    <Link
                      href="/journals"
                      className="btn-primary no-underline text-xs"
                    >
                      Access archive
                    </Link>
                  </Magnetic>
                </div>

                <div className="hero-cta-secondary w-full sm:w-auto">
                  <Magnetic strength={0.2}>
                    <Link
                      href="/write"
                      className="btn-secondary no-underline text-xs inline-flex items-center gap-1.5"
                    >
                      <span className="text-retro-primary font-mono text-sm leading-none" aria-hidden="true">+</span>
                      <span>Record transmission</span>
                      <span className="blink-cursor" aria-hidden="true" />
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>

            {/* Right Column: Compact Recovered Memory Preview */}
            <div className="lg:col-span-5 flex flex-col justify-center w-full">
              <div className="hero-fragment w-full border-2 border-retro-border bg-retro-surface shadow-retro-sm transition-shadow duration-200 hover:shadow-retro">
                
                {/* Folio Docket Header */}
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-retro-border/30 bg-retro-surface/70 text-xs font-body text-retro-text/75">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 bg-retro-primary inline-block shrink-0 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                    <span className="font-medium text-retro-text truncate">Recovered transmission</span>
                    {formattedLatestDate && (
                      <>
                        <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
                        <time className="font-mono text-xs shrink-0 text-retro-text/70">{formattedLatestDate}</time>
                      </>
                    )}
                  </div>
                  {latestPost && (
                    <span className="font-body text-xs text-retro-text/60 shrink-0 hidden sm:inline-block">
                      Fragment #<span className="font-mono">{latestPost.id.slice(-4).toUpperCase()}</span>
                    </span>
                  )}
                </div>

                {/* Fragment Content */}
                {latestPost ? (
                  <Link
                    href={`/posts/${latestPost.slug}`}
                    className="block p-4 sm:p-5 no-underline group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h2 className={`font-heading text-base sm:text-lg text-retro-text group-hover:text-retro-primary transition-colors leading-snug line-clamp-1 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                        {latestPost.title}
                      </h2>
                      <span className="font-mono text-xs text-retro-text/70 shrink-0 border border-retro-border/30 px-2 py-0.5 bg-retro-bg/60">
                        {latestPost.readTime}
                      </span>
                    </div>

                    <p className={`font-body text-xs text-retro-text/80 leading-relaxed line-clamp-2 mb-3.5 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                      {cleanExcerpt(latestPost.excerpt)}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-retro-border/30 text-xs font-body text-retro-primary">
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
                        <span>Read recovered fragment</span>
                        <span aria-hidden="true">→</span>
                      </span>
                      <span className="font-body text-xs text-retro-text/50">
                        Buffer intact
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 text-center">
                    <p className="font-body text-xs text-retro-text/70 mb-2">No records indexed in buffer.</p>
                    <Link href="/write" className="btn-secondary text-xs no-underline">
                      Initialize entry
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
