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

      tl.from('.hero-masthead', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'expo.out',
      })
        .from(
          '.hero-premise',
          {
            opacity: 0,
            y: 10,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.25'
        )
        .from(
          '.hero-actions-cluster',
          {
            opacity: 0,
            y: 10,
            duration: 0.35,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .from(
          '.hero-telemetry-rail',
          {
            opacity: 0,
            y: 6,
            duration: 0.3,
            ease: 'power2.out',
          },
          '-=0.15'
        )
        .from(
          '.hero-folio-sheet',
          {
            opacity: 0,
            y: 20,
            duration: 0.55,
            ease: 'expo.out',
          },
          '-=0.35'
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
      className="relative pt-6 pb-10 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-14 border-b-2 border-retro-border/25 bg-retro-bg overflow-hidden"
    >
      {/* Subtle CRT raster & archival paper ambient wash */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--retro-surface)_0%,transparent_70%)] opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetric Editorial Broadside Spread (No outer enclosing box!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Monumental Masthead, Intimate Premise & Integrated Command Deck */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Wordmark Masthead */}
            <div className="hero-masthead mb-4 w-full">
              <div className="flex items-center gap-2 mb-2 text-xs font-body text-retro-text/60">
                <span className="w-1.5 h-1.5 bg-retro-primary inline-block" aria-hidden="true" />
                <span>personal archive</span>
                <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
                <span>volume one</span>
              </div>

              <h1 className="font-heading tracking-tight text-retro-text leading-[1.08]">
                <span className="block text-2xl sm:text-4xl lg:text-[2.85rem] break-words">
                  Inner
                </span>
                <span className="block text-2xl sm:text-4xl lg:text-[2.85rem] text-retro-primary mt-1 sm:pl-4 break-words">
                  Margins
                </span>
              </h1>
            </div>

            {/* Editorial Statement: Intimate premise anchoring the wordmark */}
            <div className="hero-premise max-w-lg mb-6 pl-3.5 border-l-2 border-retro-primary/80">
              <p className="font-body text-xs sm:text-sm text-retro-text/85 leading-relaxed">
                An emotional operating system preserving lost thoughts and private memories.
              </p>
            </div>

            {/* Action Commands Cluster */}
            <div className="hero-actions-cluster flex flex-wrap items-center gap-3 w-full sm:w-auto mb-6">
              <div className="w-full sm:w-auto">
                <Magnetic strength={0.2}>
                  <Link
                    href="/journals"
                    className="btn-primary no-underline text-xs inline-flex items-center"
                  >
                    Access archive
                  </Link>
                </Magnetic>
              </div>

              <div className="w-full sm:w-auto">
                <Magnetic strength={0.2}>
                  <Link
                    href="/write"
                    className="btn-secondary no-underline text-xs inline-flex items-center gap-1.5"
                  >
                    <span className="text-retro-primary font-mono text-sm leading-none" aria-hidden="true">+</span>
                    <span>Record transmission</span>
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Quiet Marginalia Telemetry Rail */}
            <div className="hero-telemetry-rail flex flex-wrap items-center gap-3 pt-3 border-t border-retro-border/20 text-xs font-body text-retro-text/65 w-full">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-retro-text/80 font-medium">{stats?.totalEntries ?? 0}</span>
                <span className="text-retro-text/50">cycles logged</span>
              </div>
              <span className="h-3 w-px bg-retro-border/25" aria-hidden="true" />
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-retro-text/80 font-medium">{stats?.currentStreak ?? 0}</span>
                <span className="text-retro-text/50">days streak</span>
              </div>
              <span className="h-3 w-px bg-retro-border/25 hidden sm:inline-block" aria-hidden="true" />
              <div className="hidden sm:flex items-center gap-2 text-retro-text/60">
                <Greeting />
              </div>
            </div>

          </div>

          {/* Right Column: The Recovered Memory Folio Sheet (Opened Diary Page) */}
          <div className="lg:col-span-5 w-full">
            <div className="hero-folio-sheet w-full border-2 border-retro-border bg-retro-surface shadow-retro border-l-4 border-l-retro-primary relative transition-transform duration-200 hover:-translate-y-0.5">
              
              {/* Folio Docket Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-retro-border/20 bg-retro-surface/80 text-xs font-body text-retro-text/80">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 bg-retro-primary inline-block shrink-0 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                  <span className="font-medium text-retro-text truncate">Recovered transmission</span>
                </div>
                {formattedLatestDate && (
                  <time className="font-mono text-xs shrink-0 text-retro-text/70">{formattedLatestDate}</time>
                )}
              </div>

              {/* Folio Body */}
              {latestPost ? (
                <Link
                  href={`/posts/${latestPost.slug}`}
                  className="block p-4 sm:p-5 no-underline group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2.5">
                    <h2 className={`font-heading text-base sm:text-lg text-retro-text group-hover:text-retro-primary transition-colors leading-snug line-clamp-1 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                      {latestPost.title}
                    </h2>
                    <span className="font-mono text-xs text-retro-text/70 shrink-0 border border-retro-border/30 px-2 py-0.5 bg-retro-bg/60">
                      {latestPost.readTime}
                    </span>
                  </div>

                  <p className={`font-body text-xs sm:text-[13px] text-retro-text/85 leading-relaxed line-clamp-3 mb-4 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                    {cleanExcerpt(latestPost.excerpt)}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-retro-border/30 text-xs font-body text-retro-primary">
                    <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
                      <span>Read fragment</span>
                      <span aria-hidden="true">→</span>
                    </span>
                    <span className="font-mono text-xs text-retro-text/50">
                      #{latestPost.id.slice(-4).toUpperCase()}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="p-5 text-center">
                  <p className="font-body text-xs text-retro-text/70 mb-3">No records indexed in buffer.</p>
                  <Link href="/write" className="btn-secondary text-xs no-underline">
                    Initialize entry
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
