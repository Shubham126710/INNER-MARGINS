import { getAnalysisStats } from '@/actions/analysis.actions';
import { StatCard, ContributionGraph, WeeklyActivityChart } from '@/components';
import Link from 'next/link';

export const metadata = {
  title: 'Analysis | Inner Margins',
  description: 'Writing statistics and insights.',
};

export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  await new Promise(resolve => setTimeout(resolve, 800)); // Artificial delay for effect
  const stats = await getAnalysisStats();

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white pb-24">
      {/* Hero Section */}
      <section className="relative py-8 md:py-16 lg:py-24 overflow-hidden border-b-4 border-retro-border bg-retro-surface">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
           <Link 
            href="/"  
            className="inline-flex items-center text-sm font-mono text-retro-text/60 hover:text-retro-text hover:underline uppercase mb-6 decoration-2 underline-offset-4"
          >
            &lt; Return to Main
          </Link>

          <span className="block text-retro-text/60 text-xs font-mono uppercase tracking-widest mb-2">
            System Diagnostics
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-display uppercase tracking-tight text-retro-text leading-none mb-6">
            Analysis
          </h1>
          <p className="text-lg md:text-xl font-mono text-retro-text/80 max-w-2xl border-l-4 border-retro-primary pl-6 py-2">
            Quantifying the intangible. <br className="hidden md:block"/>
            A breakdown of your writing habits and consistency.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-12 space-y-16">
        
        {/* Key Metrics Grid */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b-4 border-retro-border pb-4">
             <h2 className="text-2xl md:text-3xl font-heading uppercase text-retro-text">
                Overview
             </h2>
             <span className="font-mono text-xs uppercase text-retro-text/60 bg-retro-surface px-2 py-1 border-2 border-retro-border">
                Live Data
             </span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <StatCard 
              label="Current Streak" 
              value={stats.currentStreak} 
              suffix={stats.currentStreak === 1 ? 'Day' : 'Days'}
              highlight={stats.currentStreak > 0}
            />
            <StatCard 
              label="Longest Run" 
              value={stats.longestStreak} 
              suffix={stats.longestStreak === 1 ? 'Day' : 'Days'}
            />
            <StatCard 
              label="Total Entries" 
              value={stats.totalEntries} 
            />
            <StatCard 
              label="This Year" 
              value={stats.thisYear} 
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Contribution Graph - Takes 2 cols */}
            <section className="lg:col-span-2">
                <div className="flex items-end justify-between mb-6 border-b-4 border-retro-border pb-4">
                    <h2 className="text-2xl md:text-3xl font-heading uppercase text-retro-text">
                        Year in Pixels
                    </h2>
                    <span className="font-mono text-xs uppercase text-retro-text/60">
                        Daily Frequency
                    </span>
                </div>
                <div className="border-4 border-retro-border bg-retro-surface p-4 md:p-8 shadow-retro overflow-x-auto">
                    <ContributionGraph data={stats.dailyActivity} />
                </div>
            </section>

            {/* Weekly Activity Chart - Takes 1 col */}
            <section>
                 <div className="flex items-end justify-between mb-6 border-b-4 border-retro-border pb-4">
                    <h2 className="text-2xl md:text-3xl font-heading uppercase text-retro-text">
                        Weekly Rhythm
                    </h2>
                </div>
                <div className="border-4 border-retro-border bg-retro-surface p-6 shadow-retro h-[300px] flex items-center justify-center">
                    <WeeklyActivityChart data={stats.weeklyPattern} />
                </div>
            </section>
        </div>

        {/* Breakdown Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Recent Activity */}
            <div className="border-4 border-retro-border bg-retro-surface p-6 md:p-8 shadow-retro">
                <h3 className="text-xl font-heading uppercase mb-8 border-b-2 border-retro-border pb-2 text-retro-text/80">
                    Temporal Distribution
                </h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center group hover:bg-retro-bg/50 p-2 -mx-2 transition-colors">
                        <span className="font-code text-retro-text/70 uppercase text-sm">This Week</span>
                        <div className="flex items-center gap-4 flex-1 justify-end">
                            <div className="h-px bg-retro-border w-12 md:w-32 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                            <span className="font-display text-2xl md:text-3xl min-w-[3ch] text-right">{stats.thisWeek}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center group hover:bg-retro-bg/50 p-2 -mx-2 transition-colors">
                        <span className="font-code text-retro-text/70 uppercase text-sm">This Month</span>
                        <div className="flex items-center gap-4 flex-1 justify-end">
                            <div className="h-px bg-retro-border w-12 md:w-32 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                            <span className="font-display text-2xl md:text-3xl min-w-[3ch] text-right">{stats.thisMonth}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center group hover:bg-retro-bg/50 p-2 -mx-2 transition-colors">
                        <span className="font-code text-retro-text/70 uppercase text-sm">Total {new Date().getFullYear()}</span>
                        <div className="flex items-center gap-4 flex-1 justify-end">
                             <div className="h-px bg-retro-border w-12 md:w-32 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                            <span className="font-display text-2xl md:text-3xl min-w-[3ch] text-right">{stats.thisYear}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Yearly Breakdown */}
             <div className="border-4 border-retro-border bg-retro-surface p-6 md:p-8 shadow-retro">
                <h3 className="text-xl font-heading uppercase mb-8 border-b-2 border-retro-border pb-2 text-retro-text/80">
                    Historical Data
                </h3>
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {stats.entriesByYear.map((entry) => (
                        <div key={entry.year} className="flex items-center justify-between py-2 border-b border-retro-border/20 last:border-0 hover:bg-retro-bg/30 px-2 -mx-2 transition-colors">
                            <span className="font-heading text-lg text-retro-text">{entry.year}</span>
                            <span className="font-mono text-sm bg-retro-text text-retro-surface px-2 py-1 rounded-sm">
                                {entry.count} ENTRIES
                            </span>
                        </div>
                    ))}
                    {stats.entriesByYear.length === 0 && (
                        <div className="text-center py-8 text-retro-text/40 font-mono text-sm uppercase">
                            No historical records found.
                        </div>
                    )}
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}


