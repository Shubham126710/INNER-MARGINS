import { getAnalysisStats } from '@/actions/analysis.actions';
import { StatCard, ContributionGraph } from '@/components';

export const metadata = {
  title: 'Analysis | Inner Margins',
  description: 'Writing statistics and insights.',
};

export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay for effect
  const stats = await getAnalysisStats();

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 lg:py-32 overflow-hidden border-b-4 border-retro-border bg-retro-surface">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-12 text-center">
          <div className="inline-block px-3 py-1 mb-6 border-2 border-retro-text bg-retro-secondary/10 uppercase tracking-widest text-xs font-code">
            Insights
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display uppercase tracking-tighter text-retro-text mb-6">
            Analysis
          </h1>
          <p className="text-base md:text-xl font-code text-retro-text/80 max-w-2xl mx-auto">
            A birdseye view of my writing consistency and volume.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard 
            label="Current Streak" 
             value={stats.currentStreak} 
             suffix={stats.currentStreak === 1 ? 'Day' : 'Days'}
             highlight={stats.currentStreak > 0}
          />
          <StatCard 
            label="Longest Streak" 
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

        {/* Contribution Graph */}
        <div className="mb-16 border-4 border-retro-border bg-retro-surface p-8 shadow-retro overflow-hidden">
             <h2 className="text-2xl font-display uppercase mb-6 border-b-2 border-retro-border pb-4 flex justify-between items-end">
                <span>Year in Pixels</span>
                <span className="text-xs font-code opacity-60 normal-case hidden sm:inline-block">Last 365 Days</span>
            </h2>
            <ContributionGraph data={stats.dailyActivity} />
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Recent Activity */}
            <div className="border-4 border-retro-border bg-retro-surface p-8 shadow-retro">
                <h2 className="text-2xl font-display uppercase mb-8 border-b-2 border-retro-border pb-4">
                    Recent Activity
                </h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center group">
                        <span className="font-code text-retro-text/70 uppercase">This Week</span>
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-retro-border w-24 md:w-48 opacity-30"></div>
                            <span className="font-display text-3xl">{stats.thisWeek}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="font-code text-retro-text/70 uppercase">This Month</span>
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-retro-border w-24 md:w-48 opacity-30"></div>
                            <span className="font-display text-3xl">{stats.thisMonth}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="font-code text-retro-text/70 uppercase">This Year</span>
                        <div className="flex items-center gap-4">
                             <div className="h-px flex-1 bg-retro-border w-24 md:w-48 opacity-30"></div>
                            <span className="font-display text-3xl">{stats.thisYear}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Yearly Breakdown */}
            <div className="border-4 border-retro-border bg-retro-surface p-8 shadow-retro">
                <h2 className="text-2xl font-display uppercase mb-8 border-b-2 border-retro-border pb-4">
                    Annual Archive
                </h2>
                <div className="space-y-4">
                   {stats.entriesByYear.length > 0 ? (
                       stats.entriesByYear.map((item) => (
                           <div key={item.year} className="flex items-center gap-4">
                               <span className="font-code w-16 text-retro-text">{item.year}</span>
                               <div className="flex-1 h-3 bg-retro-bg relative rounded-sm overflow-hidden">
                                   <div 
                                      className="absolute top-0 left-0 h-full bg-retro-primary"
                                      style={{ width: `${Math.min((item.count / Math.max(...stats.entriesByYear.map(e => e.count))) * 100, 100)}%` }}
                                   />
                               </div>
                               <span className="font-code w-8 text-right text-retro-text/70">{item.count}</span>
                           </div>
                       ))
                   ) : (
                       <p className="font-code text-retro-text/50">No entries yet.</p>
                   )}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}


