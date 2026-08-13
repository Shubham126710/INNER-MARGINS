import Link from 'next/link';
import { PostCard } from '@/components';
import { getPublishedPosts, getFeaturedPosts } from '@/actions/post.actions';
import { getAnalysisStats } from '@/actions/analysis.actions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await new Promise(resolve => setTimeout(resolve, 800));

  const posts = await getPublishedPosts();
  const stats = await getAnalysisStats();

  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="min-h-screen bg-paper font-sans">
      
      {/* Editorial Opening Spread */}
      <section className="pt-20 pb-12 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-ink leading-[0.95] mb-6">
                A personal archive of things I couldn't leave unwritten.
              </h1>
            </div>
            
            <div className="font-mono text-xs uppercase tracking-widest text-muted space-y-1 text-left md:text-right shrink-0">
              <p>{stats.totalEntries} entries</p>
              <p>Since 2024</p>
              <p>Chandigarh / IN</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Story & Recent Entries Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {latestPost && (
            <div className="mb-16">
              <div className="font-sans text-xs uppercase tracking-widest text-ink font-medium mb-8 flex items-center gap-4">
                <span>Latest Entry</span>
                <div className="h-[1px] flex-1 bg-ink/10"></div>
              </div>
              <PostCard post={latestPost} variant="featured" />
            </div>
          )}

          {recentPosts.length > 0 && (
            <div>
              <div className="font-sans text-xs uppercase tracking-widest text-ink font-medium mb-8 flex items-center gap-4">
                <span>Recent Archive</span>
                <div className="h-[1px] flex-1 bg-ink/10"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {recentPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} variant="default" />
                ))}
              </div>
            </div>
          )}

          {posts.length === 0 && (
             <div className="text-center py-24 border border-ink/10 bg-ink/5">
              <p className="text-muted font-sans text-lg">
                The archive is currently empty.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* The Year So Far - Teaser */}
      <section className="py-24 border-t border-ink/10 bg-ink/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl lg:text-5xl tracking-tight text-ink mb-6">
            The Year So Far
          </h2>
          <p className="font-sans text-muted max-w-lg mx-auto mb-10 text-base md:text-lg">
            An overview of writing frequency, recurring themes, and emotional patterns across the archive.
          </p>
          <Link href="/analysis" className="btn-secondary">
            View Full Analysis
          </Link>
        </div>
      </section>

    </div>
  );
}
