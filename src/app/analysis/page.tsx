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
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center md:text-left">
          <FrontMatter items={['RETROSPECTIVE', '2026']} className="mb-8" />
          <h1 className="text-6xl md:text-8xl font-display tracking-tight leading-none mb-8 border-b border-ink/20 pb-8">
            The Year So Far
          </h1>
          <p className="text-xl font-sans text-ink/80 max-w-2xl">
            An overview of writing frequency, recurring themes, and emotional patterns across the archive.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Key Metrics - Editorial Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-t-2 border-ink pt-8">
          <div>
            <h3 className="text-[10px] font-sans uppercase tracking-widest text-muted mb-4 border-b border-ink/10 pb-2">Current Streak</h3>
            <p className="text-5xl lg:text-7xl font-display tracking-tight text-ink">{stats.currentStreak}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-sans uppercase tracking-widest text-muted mb-4 border-b border-ink/10 pb-2">Longest Streak</h3>
            <p className="text-5xl lg:text-7xl font-display tracking-tight text-ink">{stats.longestStreak}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-sans uppercase tracking-widest text-muted mb-4 border-b border-ink/10 pb-2">Entries This Year</h3>
            <p className="text-5xl lg:text-7xl font-display tracking-tight text-ink">{stats.thisYear}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-sans uppercase tracking-widest text-muted mb-4 border-b border-ink/10 pb-2">Total Entries</h3>
            <p className="text-5xl lg:text-7xl font-display tracking-tight text-ink">{stats.totalEntries}</p>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-ink pb-4 mb-8 gap-4">
                <h2 className="text-4xl font-display tracking-tight text-ink">
                    Writing Frequency
                </h2>
                <span className="text-[10px] font-sans uppercase tracking-widest text-muted">
                    Past 365 Days
                </span>
            </div>
            <div className="py-8">
                <ContributionGraph data={stats.dailyActivity} />
            </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 mb-32">
            
            {/* Recent Activity */}
            <div className="lg:col-span-5">
                <h2 className="text-4xl font-display tracking-tight text-ink border-b-2 border-ink pb-4 mb-12">
                    Recent Activity
                </h2>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center py-6 border-b border-ink/10">
                        <span className="font-sans text-xs uppercase tracking-widest text-muted">This Week</span>
                        <span className="font-display text-4xl text-ink">{stats.thisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center py-6 border-b border-ink/10">
                        <span className="font-sans text-xs uppercase tracking-widest text-muted">This Month</span>
                        <span className="font-display text-4xl text-ink">{stats.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center py-6 border-b border-ink/10">
                        <span className="font-sans text-xs uppercase tracking-widest text-muted">This Year</span>
                        <span className="font-display text-4xl text-ink">{stats.thisYear}</span>
                    </div>
                </div>
            </div>

            {/* Distribution */}
            <div className="lg:col-span-7">
              <h2 className="text-4xl font-display tracking-tight text-ink border-b-2 border-ink pb-4 mb-12">
                  Patterns
              </h2>
              <div className="py-8">
                  <PatternChart 
                      weeklyPattern={stats.weeklyPattern} 
                      monthlyPattern={stats.monthlyPattern} 
                  />
              </div>
            </div>
        </div>

        {/* Streak Settings */}
        <div className="border-t-2 border-ink pt-16">
          <ReminderSetup />
        </div>
      </main>
    </div>
  );
}
