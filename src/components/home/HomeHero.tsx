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
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(
        '.hero-title',
        {
          y: 40,
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
          },
          '-=0.4'
        )
        .from(
          '.hero-status',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.hero-action-item',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
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
        )
        .from(
          '.hero-terminal',
          {
            y: 30,
            opacity: 0,
            scale: 0.98,
            duration: 0.7,
            ease: 'expo.out',
          },
          '-=0.5'
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
      className="relative py-12 md:py-16 lg:py-24 border-b border-retro-border/30 bg-retro-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Asymmetric Editorial Lead */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading text-retro-text mb-6 leading-[0.95] tracking-tight">
              Inner Margins
            </h1>

            <p className="hero-desc text-base sm:text-lg text-retro-text/80 font-body max-w-xl leading-relaxed mb-6">
              An emotional operating system preserving lost thoughts and private memories.
            </p>

            <div className="hero-status w-full max-w-xl py-3 border-y border-retro-border/20 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs font-body text-retro-text/75">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse motion-reduce:animate-none" />
                <Greeting />
              </div>
              <div className="text-retro-primary font-body text-xs">
                Awaiting input<span className="blink-cursor" />
              </div>
            </div>

            {/* Hallmark Control Pair: Primary Filled + Secondary Link/Ghost */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <div className="hero-action-item w-full sm:w-auto">
                <Magnetic strength={0.2}>
                  <Link
                    href="/journals"
                    className="btn-primary no-underline text-xs"
                  >
                    Access archive
                  </Link>
                </Magnetic>
              </div>

              <div className="hero-action-item w-full sm:w-auto">
                <Magnetic strength={0.2}>
                  <Link
                    href="/write"
                    className="btn-secondary no-underline text-xs"
                  >
                    Record transmission
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Marginalia Telemetry */}
            <div className="hero-meta flex items-center gap-6 pt-2 text-xs font-body text-retro-text/60">
              <div>
                <span className="text-retro-text/50">Cycles:</span>{' '}
                <span className="font-mono text-retro-text font-medium">{stats?.totalEntries ?? 0}</span>
              </div>
              <div className="h-3 w-px bg-retro-border/30" aria-hidden="true" />
              <div>
                <span className="text-retro-text/50">Streak:</span>{' '}
                <span className="font-mono text-retro-text font-medium">{stats?.currentStreak ?? 0}</span> days
              </div>
              <div className="h-3 w-px bg-retro-border/30" aria-hidden="true" />
              <div>
                <span className="text-retro-text/50">Status:</span>{' '}
                <span className="text-retro-text font-medium">Nominal</span>
              </div>
            </div>
          </div>

          {/* Right: Signature Product Proof - Live Terminal Monolith */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="hero-terminal w-full border-2 border-retro-border bg-retro-surface/85 p-6 shadow-retro relative group transition-transform duration-200 motion-reduce:transform-none">
              
              {/* Terminal Viewport Top Bar */}
              <div className="flex items-center justify-between border-b border-retro-border/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-retro-primary inline-block" aria-hidden="true" />
                  <span className="font-body text-xs font-medium text-retro-text/80">Memory Terminal 01</span>
                </div>
                <span className="font-body text-xs text-retro-text/60">
                  Sector active
                </span>
              </div>

              {/* Latest Real Indexed Memory Fragment */}
              {latestPost ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-body text-retro-text/60">
                    <span>Latest indexed fragment</span>
                    <span className="font-mono">{formattedLatestDate}</span>
                  </div>

                  <Link
                    href={`/posts/${latestPost.slug}`}
                    className="block group/item no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
                  >
                    <h3 className={`font-heading text-lg text-retro-text group-hover/item:text-retro-primary transition-colors leading-snug mb-2 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                      {latestPost.title}
                    </h3>
                    <p className={`font-body text-xs text-retro-text/75 line-clamp-3 leading-relaxed mb-4 ${latestPost.isLocked ? 'pixelated-blur' : ''}`}>
                      {cleanExcerpt(latestPost.excerpt)}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-retro-border/30 text-xs font-body text-retro-primary">
                      <span className="inline-flex items-center gap-1 group-hover/item:translate-x-0.5 transition-transform duration-150 motion-reduce:transform-none">
                        Open fragment <span aria-hidden="true">→</span>
                      </span>
                      <span className="font-mono text-xs text-retro-text/60">{latestPost.readTime}</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="font-body text-xs text-retro-text/70 mb-4">No records indexed in buffer.</p>
                  <Link href="/write" className="btn-secondary text-xs no-underline">
                    Initialize entry
                  </Link>
                </div>
              )}

              {/* Telemetry Footer inside terminal */}
              <div className="mt-5 pt-3 border-t border-retro-border/20 flex items-center justify-between text-xs font-body text-retro-text/60">
                <span>Buffer integrity: 99.8%</span>
                <span className="font-body text-xs">System ready</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
