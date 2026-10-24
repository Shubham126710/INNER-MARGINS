'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';
import { StatCard } from '@/components/StatCard';
import { AnalysisStats } from '@/actions/analysis.actions';

interface HomeDiagnosticsProps {
  stats: AnalysisStats;
}

export default function HomeDiagnostics({ stats }: HomeDiagnosticsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header reveal
      gsap.from('.diag-header', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      // Stat cards staggered reveal
      gsap.from('.diag-card', {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.diag-grid',
          start: 'top 85%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-16 border-b border-retro-border/30 bg-retro-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="diag-header flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text">
              System Status
            </h2>
            <p className="text-xs text-retro-text/60 font-body mt-1">
              Diagnostic telemetry &amp; journal cadence
            </p>
          </div>
          <Link
            href="/analysis"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-body text-retro-text hover:text-retro-primary hover:bg-retro-text/10 px-3 py-1.5 border border-retro-border/30 transition-colors duration-150 no-underline focus-visible:outline-2 focus-visible:outline-retro-primary active:translate-y-0.5"
          >
            <span>Run full analysis</span>
          </Link>
        </div>

        <div className="diag-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="diag-card">
            <StatCard
              label="Connection Streak"
              value={stats.currentStreak}
              suffix={stats.currentStreak === 1 ? 'day' : 'days'}
              highlight={stats.currentStreak > 0}
            />
          </div>
          <div className="diag-card">
            <StatCard label="Total Journals" value={stats.totalEntries} />
          </div>
          <div className="diag-card">
            <StatCard label="Cycles (Year)" value={stats.thisYear} />
          </div>
          <div className="diag-card">
            <StatCard label="Cycles (Month)" value={stats.thisMonth} />
          </div>
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/analysis"
            className="inline-block text-xs font-body text-retro-text hover:text-retro-primary hover:bg-retro-text/10 px-4 py-2 border border-retro-border/30 transition-colors duration-150 no-underline focus-visible:outline-2 focus-visible:outline-retro-primary active:translate-y-0.5"
          >
            Run full analysis
          </Link>
        </div>
      </div>
    </section>
  );
}
