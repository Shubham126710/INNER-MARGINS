import Link from 'next/link';
import { PostCard } from '@/components';
import { FrontMatter } from '@/components/Editorial';
import { getPublishedPosts } from '@/actions/post.actions';
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
      
      {/* Editorial Opening Spread (Magazine Cover) */}
      <section className="pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex justify-between items-end border-b border-ink/20 pb-4 mb-4">
            <span className="font-display text-2xl tracking-tight">INNER MARGINS</span>
            <FrontMatter items={['2026', 'EDITION 08']} className="hidden md:flex" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-12">
            <div className="w-full md:w-8/12 lg:w-9/12">
              <h1 className="font-display text-6xl md:text-8xl lg:text-[7rem] tracking-tight text-ink leading-[0.9] uppercase break-words">
                A Personal Archive Of Things I Couldn't Leave Unwritten.
              </h1>
            </div>
            
            <div className="w-full md:w-3/12 flex md:justify-end">
              <div className="font-sans text-xs uppercase tracking-widest text-muted space-y-1 text-left md:text-right border-l-2 md:border-l-0 md:border-r-2 border-ink/20 pl-4 md:pl-0 md:pr-4 py-1">
                <p>{stats.totalEntries} ENTRIES</p>
                <p>CHANDIGARH / IN</p>
                <p>EST. 2024</p>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-ink/20 mb-12"></div>
        </div>
      </section>

      {/* Main Story & Recent Entries Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LATEST STORY - Occupies majority of width */}
            <div className="lg:col-span-8">
              <div className="font-sans text-xs uppercase tracking-widest text-ink font-medium mb-8 flex items-center gap-4">
                <span className="tracking-[0.2em]">LATEST</span>
                <div className="h-[1px] flex-1 bg-ink/20"></div>
              </div>
              
              {latestPost && (
                <PostCard post={latestPost} variant="cover-feature" />
              )}
            </div>

            {/* SECONDARY STORIES - Asymmetric sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               <div className="font-sans text-[10px] uppercase tracking-widest text-muted font-medium mb-2 border-b border-ink/20 pb-2">
                 RECENT ARCHIVE
               </div>

               {recentPosts.length > 0 && recentPosts.slice(0, 3).map((post, index) => (
                 <div key={post.id} className={index !== 2 ? 'border-b border-ink/10 pb-8' : ''}>
                    <PostCard post={post} index={index} variant="editorial-small" />
                 </div>
               ))}
               
               {recentPosts.length > 3 && (
                 <div className="mt-8 pt-8 border-t border-ink/20">
                   <Link href="/journals" className="font-sans text-xs uppercase tracking-widest text-ink hover:text-muted transition-colors flex items-center justify-between group">
                     <span>View full index</span>
                     <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                   </Link>
                 </div>
               )}
            </div>
          </div>

          {posts.length === 0 && (
             <div className="text-center py-24 border border-ink/10 bg-ink/5 mt-12">
              <p className="text-muted font-sans text-lg">
                The archive is currently empty.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* The Year So Far - Teaser */}
      <section className="py-24 border-t border-ink/20 bg-transparent mt-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="font-sans text-xs uppercase tracking-widest text-muted mb-8">ANNUAL RETROSPECTIVE</div>
          <h2 className="font-display text-5xl lg:text-7xl tracking-tight text-ink mb-8">
            The Year So Far
          </h2>
          <p className="font-sans text-muted max-w-lg mx-auto mb-12 text-base md:text-lg">
            An overview of writing frequency, recurring themes, and emotional patterns across the archive.
          </p>
          <Link href="/analysis" className="font-sans text-xs uppercase tracking-widest border border-ink/20 px-8 py-4 hover:bg-ink hover:text-paper transition-colors">
            View Full Analysis
          </Link>
        </div>
      </section>

    </div>
  );
}
