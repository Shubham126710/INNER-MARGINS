import Link from 'next/link';
import Image from 'next/image';
import { PostCard } from '@/components';
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
      
      <section className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Editorial Opening Spread */}
          <div className="box-border flex flex-col justify-start pt-[clamp(32px,5vh,64px)] border-b border-ink/20 pb-[clamp(32px,5vw,64px)] mb-[clamp(40px,6vw,90px)] relative">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_180px] gap-8 lg:gap-16 items-start w-full">
              
              {/* Left Column - Headline */}
              <div className="flex flex-col">
                <h1 
                  className="font-display tracking-tight text-ink leading-[0.9] uppercase"
                  style={{ fontSize: 'clamp(2.5rem, 6.5vw, 6.5rem)' }}
                >
                  A Personal Archive Of Things I Couldn't Leave Unwritten.
                </h1>
              </div>
              
              {/* Right Column - Stats */}
              <div className="border-t lg:border-t-0 lg:border-l border-ink/20 pt-6 lg:pt-0 lg:pl-6 flex flex-col relative h-full">
                {/* Subtle plum marker connecting to the top */}
                <div className="hidden lg:block absolute -left-[1px] top-0 w-[2px] h-24 bg-accent opacity-50"></div>
                
                <div className="font-sans text-[10px] uppercase tracking-widest text-ink mb-8 lg:mb-12">
                  <p className="text-4xl lg:text-5xl font-display mb-1">{stats.totalEntries}</p>
                  <p className="text-muted">ENTRIES</p>
                  <p className="text-muted mt-2">SINCE 2024</p>
                </div>

                <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink space-y-1 border-t border-ink/20 pt-4 mt-auto">
                  <p className="font-medium text-accent">EDITION 08</p>
                  <p className="text-muted">INNER MARGINS</p>
                  <p className="text-muted">PERSONAL RECORD</p>
                </div>
              </div>

            </div>
          </div>
          
          {/* Main Story & Recent Entries Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(220px,0.8fr)] gap-[clamp(40px,6vw,96px)] items-start">
            
            {/* LEFT COLUMN: Lead Story + Fragments */}
            <div className="flex flex-col">
              {/* LEAD STORY */}
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink font-medium mb-6 flex justify-between items-center border-b border-ink/20 pb-2">
                <span>LEAD STORY</span>
                {latestPost && <span className="text-muted">{new Date(latestPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>}
              </div>
              
              {latestPost && (
                <article className="group relative animate-fade-in mb-16">
                  <Link href={`/posts/${latestPost.slug}`} className="block no-underline">
                    {latestPost.coverImage && (
                      <div className="relative w-full aspect-[21/9] mb-8 overflow-hidden bg-ink/5">
                        <Image
                          src={latestPost.coverImage}
                          alt={latestPost.title}
                          fill
                          className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${latestPost.isLocked ? 'blur-md' : 'mix-blend-multiply grayscale group-hover:grayscale-0'}`}
                        />
                      </div>
                    )}
                    
                    <h2 className={`text-6xl lg:text-[5rem] font-display tracking-tight leading-[0.9] mb-6 text-ink group-hover:text-accent transition-colors uppercase ${latestPost.isLocked ? 'blur-sm' : ''}`}>
                      {latestPost.title}
                    </h2>
                    
                    <p className={`text-xl font-sans leading-relaxed text-ink/80 mb-8 max-w-3xl ${latestPost.isLocked ? 'blur-sm' : ''}`}>
                      {latestPost.excerpt ? latestPost.excerpt.replace(/<[^>]*>?/gm, '') : 'Read the full entry inside...'}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-ink border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-all">
                      {latestPost.isLocked ? 'DECRYPT ENTRY' : 'READ THE STORY'}
                      <span className="text-lg leading-none mt-[-2px]">→</span>
                    </div>
                  </Link>
                </article>
              )}

              {/* SECONDARY STORIES / FRAGMENTS SUBGRID */}
              {recentPosts.length > 2 && (
                <div className="border-t-2 border-ink pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                     {recentPosts.slice(0, 2).map((post, index) => (
                       <article key={post.id} className="group">
                          <Link href={`/posts/${post.slug}`} className="block no-underline">
                            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-4 border-b border-ink/10 pb-2">
                               {index === 0 ? 'RECENT ENTRY' : 'FRAGMENT'}
                            </div>
                            <h3 className={`text-3xl lg:text-4xl font-display tracking-tight leading-[1.1] mb-3 text-ink group-hover:text-accent transition-colors uppercase ${post.isLocked ? 'blur-sm' : ''}`}>
                              {post.title}
                            </h3>
                            <p className={`text-base font-sans text-muted line-clamp-3 ${post.isLocked ? 'blur-sm' : ''}`}>
                              {post.excerpt ? post.excerpt.replace(/<[^>]*>?/gm, '') : ''}
                            </p>
                          </Link>
                       </article>
                     ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ARCHIVE RAIL */}
            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-ink/20 pt-8 lg:pt-0 lg:pl-8">
               <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink font-medium mb-6 border-b border-ink/20 pb-2 flex justify-between">
                 <span>FROM THE ARCHIVE</span>
               </div>

               <div className="flex flex-col gap-6">
                 {recentPosts.length > 2 && recentPosts.slice(2, 6).map((post, index) => (
                   <article key={post.id} className="group border-b border-ink/10 pb-6 last:border-0 last:pb-0">
                      <Link href={`/posts/${post.slug}`} className="block no-underline flex flex-col">
                        <h3 className={`text-xl lg:text-2xl font-display tracking-tight leading-[1.1] mb-2 text-ink group-hover:text-accent transition-colors uppercase ${post.isLocked ? 'blur-sm' : ''}`}>
                          {post.title}
                        </h3>
                        <div className="font-sans text-[10px] uppercase tracking-widest text-muted mb-3">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </div>
                        <p className={`text-sm font-sans text-muted line-clamp-3 ${post.isLocked ? 'blur-sm' : ''}`}>
                          {post.excerpt ? post.excerpt.replace(/<[^>]*>?/gm, '') : ''}
                        </p>
                      </Link>
                   </article>
                 ))}
               </div>
               
               {recentPosts.length > 6 && (
                 <div className="mt-8 pt-4 border-t border-ink/20">
                   <Link href="/journals" className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink hover:text-accent transition-colors flex items-center justify-between group">
                     <span>VIEW FULL ARCHIVE INDEX</span>
                     <span className="transform group-hover:translate-x-1 transition-transform text-lg leading-none mt-[-2px]">→</span>
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
      <section className="py-32 border-t-2 border-ink">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="font-sans text-[10px] uppercase tracking-widest text-muted mb-8">THE YEAR SO FAR</div>
          <h2 className="font-display text-5xl lg:text-7xl tracking-tight text-ink mb-12 uppercase leading-none">
            An overview of writing frequency, recurring themes, and emotional patterns.
          </h2>
          <Link href="/analysis" className="font-sans text-[10px] uppercase tracking-[0.2em] border border-ink text-ink px-10 py-4 hover:bg-ink hover:text-paper transition-colors inline-block">
            View Full Analysis
          </Link>
        </div>
      </section>

    </div>
  );
}
