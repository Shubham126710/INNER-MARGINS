import { getAnalysisStats } from '@/actions/analysis.actions';
import { StatCard, ContributionGraph, PatternChart, ReminderSetup } from '@/components';

export const metadata = {
  title: 'Analysis | Inner Margins',
  description: 'An overview of writing frequency, recurring themes, and emotional patterns.',
};

export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  await new Promise(resolve => setTimeout(resolve, 800));
  const stats = await getAnalysisStats();

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      {/* Hero Section */}
      <section className="pt-24 pb-16 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-display tracking-tight leading-none mb-6">
            The Year So Far
          </h1>
          <p className="text-lg font-sans text-muted max-w-2xl">
            An overview of writing frequency, recurring themes, and emotional patterns across the archive.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-24">
          <StatCard 
            label="Current Streak" 
            value={stats.currentStreak} 
            suffix={stats.currentStreak === 1 ? 'Entry' : 'Entries'}
            highlight={stats.currentStreak > 0}
          />
          <StatCard 
            label="Longest Streak" 
            value={stats.longestStreak} 
            suffix={stats.longestStreak === 1 ? 'Entry' : 'Entries'}
          />
          <StatCard 
            label="Total Entries" 
            value={stats.totalEntries} 
            suffix=""
          />
           <StatCard 
            label="Entries This Year" 
            value={stats.thisYear} 
            suffix=""
          />
        </div>

        {/* Contribution Graph */}
        <div className="mb-24">
            <div className="flex items-end justify-between border-b border-ink/10 pb-4 mb-8">
                <h2 className="text-2xl font-display tracking-tight text-ink">
                    Writing Frequency
                </h2>
                <span className="text-xs font-mono uppercase tracking-widest text-muted hidden sm:inline-block">
                    Past 365 Days
                </span>
            </div>
            <div className="bg-ink/5 p-8">
                <ContributionGraph data={stats.dailyActivity} />
            </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            
            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-display tracking-tight text-ink border-b border-ink/10 pb-4 mb-8">
                    Recent Activity
                </h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center group">
                        <span className="font-mono text-xs text-muted uppercase tracking-widest">This Week</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                            <div className="h-[1px] flex-1 bg-ink/10 border-dashed border-t"></div>
                        </div>
                        <span className="font-display text-2xl text-ink">{stats.thisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="font-mono text-xs text-muted uppercase tracking-widest">This Month</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                            <div className="h-[1px] flex-1 bg-ink/10 border-dashed border-t"></div>
                        </div>
                        <span className="font-display text-2xl text-ink">{stats.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="font-mono text-xs text-muted uppercase tracking-widest">This Year</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                             <div className="h-[1px] flex-1 bg-ink/10 border-dashed border-t"></div>
                        </div>
                        <span className="font-display text-2xl text-ink">{stats.thisYear}</span>
                    </div>
                </div>
            </div>

            {/* Distribution */}
            <div>
              <h2 className="text-2xl font-display tracking-tight text-ink border-b border-ink/10 pb-4 mb-8">
                  Patterns
              </h2>
              <div className="bg-ink/5 p-8">
                  <PatternChart 
                      weeklyPattern={stats.weeklyPattern} 
                      monthlyPattern={stats.monthlyPattern} 
                  />
              </div>
            </div>
        </div>

        {/* Streak Settings */}
        <div className="border-t border-ink/10 pt-16">
          <ReminderSetup />
        </div>
      </main>
    </div>
  );
}
