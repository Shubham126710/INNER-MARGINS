import Link from 'next/link';
import { PostCard, StatCard, Greeting } from '@/components';
import { getPublishedPosts, getFeaturedPosts } from '@/actions/post.actions';
import { getAnalysisStats } from '@/actions/analysis.actions';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const { tag } = await searchParams;
  const posts = await getPublishedPosts();
  const featuredPosts = await getFeaturedPosts();
  const stats = await getAnalysisStats();

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface">
      <section className="relative py-16 lg:py-28 overflow-hidden border-b border-retro-border/30 bg-retro-bg">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 border border-retro-border/40 bg-retro-surface/80 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-8 shadow-retro-sm">
              <div className="w-2 h-2 bg-retro-primary animate-pulse"></div>
              <span>emotional archive initialized</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading uppercase text-retro-text mb-6 tracking-tight animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            Inner Margins
          </h1>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <p className="text-sm md:text-base text-retro-text/80 font-mono max-w-xl mx-auto leading-relaxed mb-2 uppercase">
              <Greeting />
            </p>
            <p className="text-sm md:text-base text-retro-primary font-mono max-w-xl mx-auto leading-relaxed">
              System memory synchronized. Awaiting input<span className="blink-cursor"></span>
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md mx-auto animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <Link href="/journals" className="btn-primary no-underline w-full sm:w-auto shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm transition-all focus:outline-none">
              Press Start To Remember
            </Link>
            <Link href="/write" className="btn-secondary no-underline w-full sm:w-auto shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm transition-all focus:outline-none">
              New Transmission
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-retro-border/30 bg-retro-surface/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
           <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-retro-text/50 text-[10px] font-mono uppercase tracking-widest">
                  Diagnostic Output
                </span>
                <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text mt-3">
                  System Status
                </h2>
              </div>
              <Link href="/analysis" className="hidden sm:block text-xs font-mono uppercase text-retro-text hover:text-retro-primary hover:bg-retro-text/10 px-2 py-1 transition-colors no-underline">
                 [ Run Full Analysis ]
              </Link>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard label="Connection Streak" value={stats.currentStreak} suffix={stats.currentStreak === 1 ? 'day' : 'days'} highlight={stats.currentStreak > 0} />
              <StatCard label="Total Journals" value={stats.totalEntries} />
              <StatCard label="Cycles (Year)" value={stats.thisYear} />
              <StatCard label="Cycles (Month)" value={stats.thisMonth} />
           </div>

           <div className="mt-8 sm:hidden text-center">
              <Link href="/analysis" className="inline-block text-xs font-mono uppercase text-retro-text hover:text-retro-primary hover:bg-retro-text/10 px-4 py-2 border border-retro-border/30 transition-colors no-underline">
                 Run Full Analysis
              </Link>
           </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-24 border-b border-retro-border/30 bg-retro-bg relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(244,207,203,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(244,207,203,0.1)_2px,transparent_2px)] bg-[length:32px_32px] pointer-events-none opacity-50"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="inline-block bg-retro-text/10 text-retro-text px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-retro-border/20">
                  Priority Memory
                </span>
                <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text mt-4">
                  Highlighted Transmissions
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <PostCard key={post.id} post={post} index={index} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24 relative bg-retro-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-retro-border/20 pb-6">
            <div>
              <span className="text-retro-text/50 text-[10px] font-mono uppercase tracking-widest">
                Local Storage
              </span>
              <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text mt-3">
                Recent Journals
              </h2>
            </div>
            <Link href="/journals" className="text-xs font-mono uppercase text-retro-text hover:text-retro-primary hover:bg-retro-text/10 px-2 py-1 transition-colors no-underline">
              [ Access Archive ]
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {posts.length === 0 && (
             <div className="text-center py-16 border border-dashed border-retro-border/40 bg-retro-bg/50">
              <p className="text-retro-text/50 font-mono text-sm uppercase tracking-widest">
                System memory empty. Awaiting input...
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 border-t border-retro-border/40 bg-retro-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,var(--retro-text)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative">
          <div className="inline-flex justify-center items-center w-16 h-16 mb-8 border border-retro-text/20 bg-retro-surface/50 rotate-45">
            <div className="w-8 h-8 border border-retro-primary/50 relative -rotate-45 flex items-center justify-center">
               <div className="w-2 h-2 bg-retro-text animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-heading uppercase mb-4 text-retro-text opacity-90">
            Awaiting new input...
          </h2>
          <p className="font-mono text-sm mb-10 max-w-md mx-auto text-retro-text/60 leading-relaxed uppercase tracking-wide">
            Record a thought. Unload the cache. Save state.
          </p>
          <Link href="/write" className="btn-primary no-underline text-xs tracking-widest">
            Initiate Sequence
          </Link>
        </div>
      </section>
    </div>
  );
}
