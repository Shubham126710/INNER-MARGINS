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

      // Step 1: Terminal outer frame and top rail initialize
      tl.from('.hero-canvas-frame', {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      })
        .from(
          '.hero-top-rail',
          {
            opacity: 0,
            y: -8,
            duration: 0.3,
            ease: 'power2.out',
          },
          '-=0.15'
        )
        // Step 2: INNER MARGINS wordmark reveals with restrained line entrance
        .from(
          '.hero-wordmark-meta',
          {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out',
          },
          '-=0.1'
        )
        .from(
          '.hero-title-part-1',
          {
            opacity: 0,
            y: 16,
            duration: 0.4,
            ease: 'expo.out',
          },
          '-=0.15'
        )
        .from(
          '.hero-title-part-2',
          {
            opacity: 0,
            x: -16,
            duration: 0.4,
            ease: 'expo.out',
          },
          '-=0.25'
        )
        // Step 3: Supporting manifesto description appears
        .from(
          '.hero-statement',
          {
            opacity: 0,
            y: 10,
            duration: 0.35,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        // Step 4: Recovered memory card settles into view
        .from(
          '.hero-fragment',
          {
            opacity: 0,
            y: 14,
            duration: 0.45,
            ease: 'expo.out',
          },
          '-=0.25'
        )
        // Step 5: CTA row completes sequence with understated reveal
        .from(
          ['.hero-action-primary', '.hero-action-secondary'],
          {
            opacity: 0,
            y: 8,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out',
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
      className="relative py-6 sm:py-8 lg:py-10 border-b border-retro-border/30 bg-retro-bg overflow-hidden"
    >
      {/* Subtle CRT Raster Atmosphere */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--retro-primary)_0%,transparent_80%)] opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Archival Folio Canvas Container */}
        <div className="hero-canvas-frame border border-retro-border/30 bg-retro-surface/40 p-4 sm:p-6 lg:p-7 shadow-retro-sm relative">
          
          {/* Subtle Archival Corner Alignment Marks */}
          <div className="absolute top-2 left-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-retro-text/30 select-none pointer-events-none" aria-hidden="true">+</div>

          {/* Top System Header / Archival Registration Rail */}
          <div className="hero-top-rail flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-retro-border/20 text-xs font-body text-retro-text/75">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="font-body text-xs text-retro-text/80">Buffer // vol. 01</span>
              <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
              <Greeting />
            </div>
            <div className="flex items-center gap-3 text-xs font-body text-retro-text/60">
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
              <span className="font-body text-xs">Ready</span>
            </div>
          </div>

          {/* Two-Column Asymmetric Editorial Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Heading, Inscription, and Action Controls */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              <div className="mb-3.5 w-full">
                <div className="hero-wordmark-meta flex items-center gap-2 text-[11px] font-body text-retro-text/60 mb-2 select-none">
                  <span className="text-retro-primary" aria-hidden="true">■</span>
                  <span>Sector <span className="font-mono">01</span></span>
                  <span className="text-retro-border/40 font-mono" aria-hidden="true">/</span>
                  <span>Index vol. <span className="font-mono">2.5</span></span>
                </div>

                <h1 className="hero-title font-heading tracking-tighter text-retro-text leading-none">
                  <span className="hero-title-part-1 block text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] break-words">
                    Inner
                  </span>
                  <span className="hero-title-part-2 block text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] mt-1 sm:mt-1.5 sm:pl-8 md:pl-12 text-retro-primary break-words">
                    Margins
                  </span>
                </h1>
              </div>

              {/* Introspective Editorial Premise */}
              <div className="hero-statement max-w-lg mb-5 pl-3.5 border-l-2 border-retro-primary">
                <p className="font-body text-xs sm:text-[13px] text-retro-text/85 leading-relaxed font-normal">
                  An emotional operating system preserving lost thoughts and private memories.
                </p>
              </div>

              {/* Primary Visual Hierarchy: CTAs immediately accessible */}
              <div className="hero-actions flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                <div className="hero-action-primary w-full sm:w-auto">
                  <Magnetic strength={0.2}>
                    <Link
                      href="/journals"
                      className="btn-primary no-underline text-xs"
                    >
                      Access archive
                    </Link>
                  </Magnetic>
                </div>

                <div className="hero-action-secondary w-full sm:w-auto">
                  <Magnetic strength={0.2}>
                    <Link
                      href="/write"
                      className="btn-secondary no-underline text-xs inline-flex items-center gap-1.5"
                    >
                      <span className="text-retro-primary font-mono text-sm leading-none" aria-hidden="true">+</span>
                      <span>Record transmission</span>
                      <span className="w-1.5 h-3 bg-retro-primary/80 animate-pulse motion-reduce:animate-none inline-block ml-0.5 align-middle" aria-hidden="true" />
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Recovered Memory Fragment Centerpiece */}
            <div className="lg:col-span-5 flex flex-col justify-center w-full">
              <div className="hero-fragment w-full relative group/card">
                
                {/* Layered tactile backing plate */}
                <div
                  className="absolute -bottom-1.5 -right-1.5 inset-0 border-2 border-retro-border/40 bg-retro-surface/50 pointer-events-none transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:translate-y-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />

                {/* Main Memory Dossier Card */}
                <div className="relative border-2 border-retro-border bg-retro-surface shadow-retro-sm transition-[transform,box-shadow] duration-200 group-hover/card:-translate-y-0.5 group-hover/card:shadow-retro motion-reduce:transform-none">
                  
                  {/* Folio Docket Header */}
                  <div className="flex items-center justify-between px-3.5 py-2 border-b-2 border-retro-border/25 bg-retro-bg/60 text-xs font-body text-retro-text/80">
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

                  {/* Fragment Content */}
                  {latestPost ? (
                    <Link
                      href={`/posts/${latestPost.slug}`}
                      className="block p-4 sm:p-5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-2.5">
                        <h2 className={`font-heading text-base sm:text-lg text-retro-text group-hover/card:text-retro-primary transition-colors leading-snug line-clamp-1 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                          {latestPost.title}
                        </h2>
                        <span className="font-mono text-xs text-retro-text/70 shrink-0 border border-retro-border/40 px-2 py-0.5 bg-retro-bg/50 shadow-[1px_1px_0_0_var(--retro-border)]">
                          {latestPost.readTime}
                        </span>
                      </div>

                      <p className={`font-body text-xs sm:text-[13px] text-retro-text/80 leading-relaxed line-clamp-2 mb-4 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                        {cleanExcerpt(latestPost.excerpt)}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-dashed border-retro-border/30 text-xs font-body text-retro-primary">
                        <span className="inline-flex items-center gap-1.5 group-hover/card:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
                          <span>Revisit memory</span>
                          <span aria-hidden="true">→</span>
                        </span>
                        <span className="font-body text-xs text-retro-text/50">
                          Sector indexed
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
      </div>
    </section>
  );
}
