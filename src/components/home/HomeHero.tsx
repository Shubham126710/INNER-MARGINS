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

      // Step 1: Top archival telemetry initializes
      tl.from('.hero-telemetry', {
        opacity: 0,
        y: -6,
        duration: 0.35,
        ease: 'power2.out',
      })
        // Step 2: INNER MARGINS wordmark reveals with restrained line entrance
        .from(
          '.hero-word-inner',
          {
            opacity: 0,
            y: 18,
            duration: 0.45,
            ease: 'expo.out',
          },
          '-=0.15'
        )
        .from(
          '.hero-word-margins',
          {
            opacity: 0,
            x: -20,
            duration: 0.45,
            ease: 'expo.out',
          },
          '-=0.3'
        )
        // Step 3: Manifesto premise reveals
        .from(
          '.hero-manifesto',
          {
            opacity: 0,
            y: 10,
            duration: 0.35,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        // Step 4: Recovered memory parchment leaf settles into place
        .from(
          '.hero-memory-artifact',
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: 'expo.out',
          },
          '-=0.3'
        )
        // Step 5: Action controls reveal
        .from(
          ['.hero-cta-primary', '.hero-cta-secondary'],
          {
            opacity: 0,
            y: 8,
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.out',
          },
          '-=0.25'
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
      className="relative py-6 sm:py-8 lg:py-10 border-b border-retro-border/30 bg-retro-bg overflow-hidden"
    >
      {/* Subtle Archival Margin Guide & CRT Atmosphere */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--retro-surface)_0%,transparent_75%)] opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Archival System Telemetry Rail */}
        <div className="hero-telemetry flex flex-wrap items-center justify-between gap-3 pb-3 mb-6 border-b border-retro-border/30 text-xs font-body text-retro-text/75">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-retro-primary animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            <span className="font-body text-xs text-retro-text/90 font-medium">Terminal buffer</span>
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
            <span className="h-3 w-px bg-retro-border/30" aria-hidden="true" />
            <span className="font-body text-xs text-retro-primary font-medium">System ready</span>
          </div>
        </div>

        {/* Two-Column Editorial Folio Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Monumental Brand, Manifesto, and Action Deck */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            <div className="mb-4 w-full">
              <div className="flex items-center gap-2 text-[11px] font-body text-retro-text/60 mb-2 select-none">
                <span className="text-retro-primary font-mono text-[9px]" aria-hidden="true">■</span>
                <span>Sector <span className="font-mono">01</span></span>
                <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
                <span>Archive log</span>
              </div>

              <h1 className="hero-title font-heading tracking-tighter text-retro-text leading-[1.02]">
                <span className="hero-word-inner block text-4xl sm:text-5xl lg:text-6xl text-retro-text break-words">
                  Inner
                </span>
                <span className="hero-word-margins block text-4xl sm:text-5xl lg:text-6xl text-retro-primary mt-1.5 sm:pl-8 md:pl-12 break-words">
                  Margins
                </span>
              </h1>
            </div>

            {/* Introspective Editorial Premise */}
            <div className="hero-manifesto max-w-lg mb-6 pl-3.5 border-l-2 border-retro-primary">
              <p className="font-body text-xs sm:text-sm text-retro-text/90 leading-relaxed font-normal">
                An emotional operating system preserving lost thoughts and private memories.
              </p>
            </div>

            {/* Primary Visual Hierarchy: CTAs immediately accessible */}
            <div className="hero-cta-deck flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
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
                    className="btn-secondary no-underline text-xs inline-flex items-center gap-2"
                  >
                    <span className="text-retro-primary font-mono text-sm leading-none" aria-hidden="true">+</span>
                    <span>Record transmission</span>
                    <span className="w-1.5 h-3 bg-retro-primary/80 animate-pulse motion-reduce:animate-none inline-block ml-0.5 align-middle" aria-hidden="true" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Right Column: Physical-meets-Digital Parchment Memory Artifact */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full">
            <div className="hero-memory-artifact w-full relative group/doc">
              
              {/* Layered tactile backing sheet creating physical depth */}
              <div
                className="absolute -bottom-1.5 -right-1.5 inset-0 border-2 border-retro-border/30 bg-retro-surface/60 pointer-events-none transition-transform duration-200 group-hover/doc:translate-x-0.5 group-hover/doc:translate-y-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />

              {/* Main Memory Leaf: Crisp Parchment Surface */}
              <div className="relative border-2 border-retro-border bg-[var(--retro-light)] shadow-retro transition-[transform,box-shadow] duration-200 group-hover/doc:-translate-y-0.5 group-hover/doc:shadow-retro-hover motion-reduce:transform-none">
                
                {/* Docket Header Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b-2 border-retro-border/25 bg-retro-surface/50 text-xs font-body text-retro-text/80">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 bg-retro-primary inline-block shrink-0 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                    <span className="font-medium text-retro-text truncate">Recovered transmission</span>
                    {formattedLatestDate && (
                      <>
                        <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
                        <time className="font-mono text-xs shrink-0 text-retro-text/75">{formattedLatestDate}</time>
                      </>
                    )}
                  </div>
                  {latestPost && (
                    <span className="font-body text-xs text-retro-text/60 shrink-0 hidden sm:inline-block">
                      Fragment #<span className="font-mono">{latestPost.id.slice(-4).toUpperCase()}</span>
                    </span>
                  )}
                </div>

                {/* Parchment Body Content */}
                {latestPost ? (
                  <Link
                    href={`/posts/${latestPost.slug}`}
                    className="block p-4 sm:p-5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-2.5">
                      <h2 className={`font-heading text-base sm:text-lg text-[var(--retro-ink)] group-hover/doc:text-retro-primary transition-colors leading-snug line-clamp-1 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                        {latestPost.title}
                      </h2>
                      <span className="font-mono text-xs text-retro-text/70 shrink-0 border border-retro-border/40 px-2 py-0.5 bg-retro-surface/60 shadow-[1px_1px_0_0_var(--retro-border)]">
                        {latestPost.readTime}
                      </span>
                    </div>

                    <p className={`font-body text-xs sm:text-[13px] text-[var(--retro-ink)]/85 leading-relaxed line-clamp-2 mb-4 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                      {cleanExcerpt(latestPost.excerpt)}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-retro-border/30 text-xs font-body text-retro-primary">
                      <span className="inline-flex items-center gap-1.5 group-hover/doc:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
                        <span>Open fragment</span>
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
