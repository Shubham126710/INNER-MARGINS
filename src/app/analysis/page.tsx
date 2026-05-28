import { getAnalysisStats } from '@/actions/analysis.actions';
import { StatCard, ContributionGraph, PatternChart, ReminderSetup } from '@/components';

export const metadata = {
  title: 'Diagnostics | Inner Margins',
  description: 'System diagnostics and memory analysis.',
};

export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay for effect
  const stats = await getAnalysisStats();

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-28 overflow-hidden border-b border-retro-border/30 bg-retro-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,65,60,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 border border-retro-border/40 bg-retro-surface/80 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-8 shadow-retro-sm">
              <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse"></div>
              <span>Analysis Core Active</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading uppercase text-retro-text mb-6 tracking-tight animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            System Analysis
          </h1>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-retro-text/80 font-mono max-w-xl mx-auto leading-relaxed uppercase tracking-wide">
              Analyzing memory preservation patterns.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16 relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,var(--retro-surface)_0%,transparent_20%)] opacity-30 pointer-events-none"></div>
        
        {/* Key Metrics */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          <StatCard 
            label="Current Link Streak" 
             value={stats.currentStreak} 
             suffix={stats.currentStreak === 1 ? 'Cycle' : 'Cycles'}
             highlight={stats.currentStreak > 0}
          />
          <StatCard 
            label="Peak Link Streak" 
             value={stats.longestStreak} 
             suffix={stats.longestStreak === 1 ? 'Cycle' : 'Cycles'}
          />
          <StatCard 
            label="Total Archived" 
             value={stats.totalEntries} 
             suffix="Logs"
          />
           <StatCard 
            label="Annual Preservations" 
             value={stats.thisYear} 
             suffix="Logs"
          />
        </div>

        {/* Contribution Graph */}
        <div className="relative z-10 mb-16 border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-8 shadow-retro-sm hover:shadow-retro transition-shadow overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
            <h2 className="text-xl lg:text-2xl font-heading uppercase mb-6 border-b border-retro-border/20 pb-4 flex justify-between items-end text-retro-text">
                <span>Timeline Diagnostics</span>
                <span className="text-[10px] font-mono tracking-widest opacity-60 uppercase hidden sm:inline-block">Timeframe: 365 Cycles</span>
            </h2>
            <ContributionGraph data={stats.dailyActivity} />
        </div>

        {/* Breakdown Section */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-fade-in opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            
            {/* Recent Activity */}
            <div className="border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-8 shadow-retro-sm">
                <h2 className="text-xl lg:text-2xl font-heading uppercase mb-8 border-b border-retro-border/20 pb-4 text-retro-text">
                    Network Activity
                </h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center group">
                        <span className="font-mono text-[10px] sm:text-xs text-retro-text/70 uppercase tracking-widest">Local Week</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                            <div className="h-[1px] flex-1 bg-retro-border/20 group-hover:bg-retro-primary/50 transition-colors border-dashed border-t"></div>
                        </div>
                        <span className="font-heading text-2xl group-hover:text-retro-primary transition-colors">{stats.thisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="font-mono text-[10px] sm:text-xs text-retro-text/70 uppercase tracking-widest">Local Month</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                            <div className="h-[1px] flex-1 bg-retro-border/20 group-hover:bg-retro-primary/50 transition-colors border-dashed border-t"></div>
                        </div>
                        <span className="font-heading text-2xl group-hover:text-retro-primary transition-colors">{stats.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="font-mono text-[10px] sm:text-xs text-retro-text/70 uppercase tracking-widest">Local Year</span>
                        <div className="flex items-center gap-4 flex-1 mx-4">
                             <div className="h-[1px] flex-1 bg-retro-border/20 group-hover:bg-retro-primary/50 transition-colors border-dashed border-t"></div>
                        </div>
                        <span className="font-heading text-2xl group-hover:text-retro-primary transition-colors">{stats.thisYear}</span>
                    </div>
                </div>
            </div>

            {/* Distribution */}
            <div className="border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-8 shadow-retro-sm">
              <PatternChart 
                  weeklyPattern={stats.weeklyPattern} 
                  monthlyPattern={stats.monthlyPattern} 
              />
            </div>
        </div>

        {/* Streak Settings */}
        <div className="relative z-10 animate-fade-in opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
          <ReminderSetup />
        </div>
      </main>
    </div>
  );
}
