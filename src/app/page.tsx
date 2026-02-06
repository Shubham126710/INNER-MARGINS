import Link from 'next/link';
import { PostCard, LoadingScreen, StatCard } from '@/components';
import { getPublishedPosts, getFeaturedPosts } from '@/actions/post.actions';
import { getAnalysisStats } from '@/actions/analysis.actions';
import { BlogPost } from '@/lib/types';
import { Suspense } from 'react';

export default async function Home() {
  // Add a small artificial delay to show off the loading screen
  await new Promise(resolve => setTimeout(resolve, 1500));

  const posts = await getPublishedPosts();
  const featuredPosts = await getFeaturedPosts();
  const stats = await getAnalysisStats();

  const regularPosts = posts.filter(p => !p.isFeatured);

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-32 overflow-hidden border-b-4 border-retro-border bg-retro-surface">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="animate-fade-in">
            <span className="inline-block bg-retro-text text-retro-surface text-xs font-mono uppercase tracking-widest px-2 py-1 mb-6">
              Personal Journal v1.0
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading uppercase tracking-tighter text-retro-text mb-6 animate-fade-in delay-100 leading-none">
            Inner Margins
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-retro-text/80 font-mono max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
            A minimalist space for thoughts. <br/>
            Insert coin to continue.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
            <Link href="/write" className="btn-primary no-underline w-full sm:w-auto">
              Start Writing
            </Link>
            <Link href="/about" className="btn-secondary no-underline w-full sm:w-auto">
              About System
            </Link>
          </div>
        </div>
      </section>

      {/* Activity Overview */}
      <section className="py-12 border-b-4 border-retro-border bg-retro-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
           {/* Brief Stats */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <StatCard label="Streak" value={stats.currentStreak} suffix={stats.currentStreak === 1 ? 'day' : 'days'} highlight={stats.currentStreak > 0} />
              <StatCard label="Total" value={stats.totalEntries} />

              <StatCard label="This Year" value={stats.thisYear} />
              <StatCard label="This Month" value={stats.thisMonth} />
           </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-24 border-b-4 border-retro-border bg-retro-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="bg-retro-primary text-retro-surface px-2 py-1 text-xs font-mono uppercase tracking-widest">
                  Featured
                </span>
                <h2 className="text-3xl font-heading uppercase text-retro-text mt-4">
                  Highlighted Stories
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

      {/* All Posts Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12 border-b-4 border-retro-border pb-4">
            <div>
              <span className="text-retro-text/60 text-xs font-mono uppercase tracking-widest">
                Directory: /journal
              </span>
              <h2 className="text-3xl font-heading uppercase text-retro-text mt-2">
                All Entries
              </h2>
            </div>
            <span className="text-retro-text font-mono text-sm bg-retro-surface px-2 py-1">
              COUNT: {posts.length}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-24 border-4 border-dashed border-retro-border/30 bg-retro-surface">
              <div className="text-6xl mb-6 grayscale">💾</div>
              <h3 className="text-2xl font-heading uppercase text-retro-text/40 mb-4">
                No Data Found
              </h3>
              <p className="text-retro-text/60 font-mono mb-8 max-w-md mx-auto">
                Initialize database by creating your first entry.
              </p>
              <Link href="/write" className="btn-primary no-underline">
                 Initialize
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(regularPosts.length > 0 ? regularPosts : posts).map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t-4 border-retro-border bg-retro-primary text-retro-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <svg 
            className="w-24 h-24 mx-auto mb-6 block animate-bounce text-retro-surface"  
            viewBox="0 0 24 24" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="crispEdges"
          >
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M11 2h2v10h4v2h-2v2h-2v2h-2v-2H9v-2H7v-2h4V2z" 
            />
          </svg>
          <h2 className="text-3xl lg:text-4xl font-heading uppercase mb-6">
            Ready to share your story?
          </h2>
          <p className="font-mono text-lg mb-8 max-w-xl mx-auto opacity-90">
            Every thought matters. Save your progress.
          </p>
          <Link href="/write" className="btn-secondary no-underline text-retro-text bg-retro-surface hover:bg-retro-text hover:text-retro-surface border-retro-surface">
            Begin Writing
          </Link>
        </div>
      </section>
    </div>
  );
}
