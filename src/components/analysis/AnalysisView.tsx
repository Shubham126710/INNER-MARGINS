'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { StatCard, TimelineDiagnostics, PatternChart, ReminderSetup, AppleActivityCard } from '@/components';
import { AnalysisStats } from '@/actions/analysis.actions';

interface AnalysisViewProps {
  stats: AnalysisStats;
}

export default function AnalysisView({ stats }: AnalysisViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.analysis-title', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
      }).from(
        '.analysis-desc',
        {
          y: 15,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.4'
      );

      // Key metrics staggered entrance
      gsap.from('.analysis-metric-card', {
        y: 35,
        opacity: 0,
        scale: 0.96,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.analysis-metrics-grid',
          start: 'top 85%',
        },
      });

      // Section modules reveal
      gsap.utils.toArray<HTMLElement>('.analysis-section-module').forEach((mod) => {
        gsap.from(mod, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mod,
            start: 'top 85%',
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-retro-border/30 bg-retro-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--retro-primary)_0%,transparent_70%)] opacity-[0.05] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <h1 className="analysis-title text-4xl md:text-5xl lg:text-7xl font-heading text-retro-text mb-4 tracking-tight">
            System Analysis
          </h1>

          <div className="analysis-desc">
            <p className="text-sm md:text-base text-retro-text/80 font-body max-w-xl mx-auto leading-relaxed">
              Analyzing memory preservation patterns, writing cadence, and system health.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16 relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,var(--retro-surface)_0%,transparent_20%)] opacity-30 pointer-events-none" />

        {/* Key Metrics */}
        <div className="analysis-metrics-grid relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          <div className="analysis-metric-card">
            <StatCard
              label="Current Link Streak"
              value={stats.currentStreak}
              suffix={stats.currentStreak === 1 ? 'Cycle' : 'Cycles'}
              highlight={stats.currentStreak > 0}
            />
          </div>
          <div className="analysis-metric-card">
            <StatCard
              label="Peak Link Streak"
              value={stats.longestStreak}
              suffix={stats.longestStreak === 1 ? 'Cycle' : 'Cycles'}
            />
          </div>
          <div className="analysis-metric-card">
            <StatCard label="Total Archived" value={stats.totalEntries} suffix="Logs" />
          </div>
          <div className="analysis-metric-card">
            <StatCard label="Annual Preservations" value={stats.thisYear} suffix="Logs" />
          </div>
        </div>

        {/* Timeline Diagnostics: 2D Matrix (Default) with Expandable 3D Terrain */}
        <div className="analysis-section-module">
          <TimelineDiagnostics data={stats.dailyActivity} />
        </div>

        {/* Activity Rings Widget */}
        <div className="analysis-section-module relative z-10 mb-16">
          <AppleActivityCard
            title="Telemetry Rings // Cadence"
            activities={[
              {
                label: "WEEK CADENCE",
                color: "#C9413C",
                colorEnd: "#E2554F",
                size: 200,
                current: stats.thisWeek,
                target: 7,
                unit: "DAYS",
              },
              {
                label: "MONTH CADENCE",
                color: "#E2554F",
                colorEnd: "#F4CFCB",
                size: 156,
                current: stats.thisMonth,
                target: stats.daysInMonth,
                unit: "DAYS",
              },
              {
                label: "YEAR CADENCE",
                color: "#8C2B27",
                colorEnd: "#C9413C",
                size: 112,
                current: stats.thisYear,
                target: stats.daysInYear,
                unit: "DAYS",
              },
            ]}
          />
        </div>

        {/* Historical Distribution & Patterns */}
        <div className="analysis-section-module mb-16 relative z-10">
          <PatternChart
            weeklyPattern={stats.weeklyPattern}
            monthlyPattern={stats.monthlyPattern}
          />
        </div>

        {/* Diagnostics & Notification Setup */}
        <div className="analysis-section-module relative z-10">
          <ReminderSetup />
        </div>
      </main>
    </div>
  );
}
