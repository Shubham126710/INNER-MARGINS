import { getAnalysisStats } from '@/actions/analysis.actions';
import { StatCard, ContributionGraph, PatternChart, ReminderSetup } from '@/components';
import { Marginalia, FrontMatter } from '@/components/Editorial';

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
      <section className="pt-16 pb-24 border-b border-ink/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-4 flex gap-4 items-center">
             <span>RETROSPECTIVE</span>
             <span className="text-accent/50">•</span>
             <span>2026</span>
          </div>
          <h1 
            className="font-display tracking-tight leading-none mb-8 uppercase break-words"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)' }}
          >
            The Analysis
          </h1>
          <p className="font-sans text-ink/80 max-w-3xl leading-snug" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>
            An overview of writing frequency, recurring themes, and emotional patterns across the archive.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
        
        {/* Key Metrics - Editorial Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 mb-32 pt-12 border-t border-ink/20">
          <div className="text-center md:text-left">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted mb-4">Current Streak</h3>
            <p className="font-display tracking-tight text-ink leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>{stats.currentStreak}</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted mb-4">Longest Streak</h3>
            <p className="font-display tracking-tight text-ink leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>{stats.longestStreak}</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted mb-4">Entries This Year</h3>
            <p className="font-display tracking-tight text-ink leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>{stats.thisYear}</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted mb-4">Total Entries</h3>
            <p className="font-display tracking-tight text-ink leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>{stats.totalEntries}</p>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <h2 className="text-4xl lg:text-5xl font-display tracking-tight text-ink uppercase">
                    Writing Frequency
                </h2>
                <span className="text-[10px] font-sans uppercase tracking-widest text-muted">
                    Past 365 Days
                </span>
            </div>
            <div className="py-4 bg-ink/5 border border-ink/10">
                <ContributionGraph data={stats.dailyActivity} />
            </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
            
            {/* Recent Activity */}
            <div className="lg:col-span-4">
                <h2 className="text-3xl lg:text-4xl font-display tracking-tight text-ink mb-10 uppercase">
                    Recent Activity
                </h2>
                <div className="flex flex-col">
                    <div className="flex justify-between items-end py-6 border-b border-ink/10">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-muted">This Week</span>
                        <span className="font-display text-4xl text-ink leading-none">{stats.thisWeek}</span>
                    </div>
                    <div className="flex justify-between items-end py-6 border-b border-ink/10">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-muted">This Month</span>
                        <span className="font-display text-4xl text-ink leading-none">{stats.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-end py-6 border-b border-ink/10">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-muted">This Year</span>
                        <span className="font-display text-4xl text-ink leading-none">{stats.thisYear}</span>
                    </div>
                </div>
            </div>

            {/* Distribution */}
            <div className="lg:col-span-8">
              <h2 className="text-3xl lg:text-4xl font-display tracking-tight text-ink mb-10 uppercase">
                  Patterns
              </h2>
              <div className="p-8 border border-ink/10 bg-ink/5">
                  <PatternChart 
                      weeklyPattern={stats.weeklyPattern} 
                      monthlyPattern={stats.monthlyPattern} 
                  />
              </div>
            </div>
        </div>

        {/* Streak Settings */}
        <div className="border-t border-ink/20 pt-16">
          <ReminderSetup />
        </div>
      </main>
    </div>
  );
}
