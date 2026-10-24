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

      tl.from('.hero-top-rail', {
        y: -12,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
        .from(
          '.hero-title-part-1',
          {
            y: 35,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
          '-=0.2'
        )
        .from(
          '.hero-title-part-2',
          {
            x: -25,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
          '-=0.45'
        )
        .from(
          '.hero-statement',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-fragment',
          {
            y: 25,
            opacity: 0,
            scale: 0.99,
            duration: 0.7,
            ease: 'expo.out',
          },
          '-=0.35'
        )
        .from(
          ['.hero-action-primary', '.hero-action-secondary'],
          {
            y: 12,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-meta',
          {
            opacity: 0,
            duration: 0.5,
          },
          '-=0.2'
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
      className="relative py-10 sm:py-14 md:py-16 lg:py-20 border-b border-retro-border/30 bg-retro-bg overflow-hidden"
    >
      {/* Subtle CRT Raster Ledger Lines */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--retro-primary)_0%,transparent_80%)] opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Archival Folio Canvas Container */}
        <div className="border border-retro-border/30 bg-retro-surface/40 p-5 sm:p-8 md:p-10 shadow-retro-sm relative">
          
          {/* Subtle Decorative Archival Registration Marks */}
          <div className="absolute top-2 left-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>

          {/* Top System Header / Archival Registration Rail */}
          <div className="hero-top-rail flex flex-wrap items-center justify-between gap-3 pb-5 mb-8 border-b border-retro-border/20 text-xs font-body text-retro-text/75">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="font-body text-xs text-retro-text/80">Buffer // vol. 01</span>
              <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
              <Greeting />
            </div>
            <div className="flex items-center gap-3 text-xs font-body text-retro-text/60">
              <span className="font-body text-xs">Sys//online</span>
              <span className="h-3 w-px bg-retro-border/30" aria-hidden="true" />
              <span className="font-body text-xs">Ready</span>
            </div>
          </div>

          {/* Stepped Monumental Typographic Focal Point */}
          <h1 className="hero-title font-heading tracking-tight text-retro-text mb-6">
            <span className="hero-title-part-1 block text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] break-words">
              Inner
            </span>
            <span className="hero-title-part-2 block text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mt-2 sm:mt-3 sm:pl-12 md:pl-20 text-retro-primary break-words">
              Margins
            </span>
          </h1>

          {/* Introspective Editorial Premise */}
          <div className="hero-statement max-w-2xl mb-8 pl-4 border-l-2 border-retro-primary">
            <p className="font-body text-sm sm:text-base text-retro-text/85 leading-relaxed">
              An emotional operating system preserving lost thoughts and private memories.
            </p>
          </div>

          {/* Recovered Memory Fragment (The Physical-meets-Digital Leaf) */}
          <div className="hero-fragment w-full mb-8">
            <div className="border border-retro-border/50 bg-retro-surface/90 shadow-retro-sm transition-shadow duration-200 hover:shadow-retro">
              
              {/* Folio Docket Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-retro-border/30 bg-retro-bg/40 text-xs font-body text-retro-text/75">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-retro-primary inline-block" aria-hidden="true" />
                  <span className="font-medium text-retro-text">Recovered transmission</span>
                  {formattedLatestDate && (
                    <>
                      <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
                      <time className="font-mono text-xs">{formattedLatestDate}</time>
                    </>
                  )}
                </div>
                {latestPost && (
                  <span className="font-body text-xs text-retro-text/60">
                    Fragment #<span className="font-mono">{latestPost.id.slice(-4).toUpperCase()}</span>
                  </span>
                )}
              </div>

              {/* Fragment Content */}
              {latestPost ? (
                <Link
                  href={`/posts/${latestPost.slug}`}
                  className="block p-5 sm:p-7 no-underline group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h2 className={`font-heading text-lg sm:text-xl text-retro-text group-hover:text-retro-primary transition-colors leading-snug ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                      {latestPost.title}
                    </h2>
                    <span className="font-mono text-xs text-retro-text/60 shrink-0">
                      {latestPost.readTime}
                    </span>
                  </div>

                  <p className={`font-body text-xs sm:text-sm text-retro-text/80 leading-relaxed line-clamp-3 mb-5 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                    {cleanExcerpt(latestPost.excerpt)}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-retro-border/30 text-xs font-body text-retro-primary">
                    <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none">
                      <span>Read recovered fragment</span>
                      <span aria-hidden="true">→</span>
                    </span>
                    <span className="font-body text-xs text-retro-text/50">
                      Log indexed
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="p-6 sm:p-8 text-center">
                  <p className="font-body text-xs text-retro-text/70 mb-4">No records indexed in buffer.</p>
                  <Link href="/write" className="btn-secondary text-xs no-underline">
                    Initialize entry
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Action Command Deck & Marginalia Telemetry */}
          <div className="hero-actions flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2 border-t border-retro-border/20">
            <div className="flex flex-wrap items-center gap-4">
              <div className="hero-action-primary">
                <Magnetic strength={0.2}>
                  <Link
                    href="/journals"
                    className="btn-primary no-underline text-xs"
                  >
                    Access archive
                  </Link>
                </Magnetic>
              </div>

              <div className="hero-action-secondary">
                <Link
                  href="/write"
                  className="inline-flex items-center gap-2 text-xs font-body text-retro-text hover:text-retro-primary border border-retro-border/40 bg-retro-surface/70 hover:bg-retro-surface px-4 py-3 shadow-retro-sm hover:shadow-retro transition-colors duration-150 no-underline focus-visible:outline-2 focus-visible:outline-retro-primary active:translate-y-px"
                >
                  <span className="text-retro-primary font-mono text-sm" aria-hidden="true">+</span>
                  <span>Record transmission</span>
                  <span className="blink-cursor" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Marginalia Telemetry */}
            <div className="hero-meta flex items-center gap-4 text-xs font-body text-retro-text/65 self-start sm:self-auto">
              <div>
                <span className="text-retro-text/50">Cycles:</span>{' '}
                <span className="font-mono text-retro-text font-medium">{stats?.totalEntries ?? 0}</span>
              </div>
              <div className="h-3 w-px bg-retro-border/30" aria-hidden="true" />
              <div>
                <span className="text-retro-text/50">Streak:</span>{' '}
                <span className="font-mono text-retro-text font-medium">{stats?.currentStreak ?? 0}</span> days
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
