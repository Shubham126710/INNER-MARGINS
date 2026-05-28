import Link from 'next/link';
import { JournalSection } from '@/components';
import { getPublishedPosts } from '@/actions/post.actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Archive | Inner Margins',
  description: 'Journal archive and memory retrieval.',
};

export default async function JournalsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = await getPublishedPosts();

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort();

  const filteredPosts = tag 
    ? posts.filter(p => p.tags.includes(tag))
    : posts;

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white pt-4 md:pt-8">
      {/* Remove hero from here since JournalSection handles its own header, or we can update JournalSection */}
      <JournalSection posts={filteredPosts} allTags={allTags} activeTag={tag} />
      
       {/* CTA Section */}
       <section className="py-24 border-t border-retro-border/30 bg-retro-bg text-retro-text mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,65,60,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-8 opacity-50">
             <rect x="2" y="2" width="4" height="4" />
             <rect x="18" y="2" width="4" height="4" />
             <rect x="2" y="18" width="4" height="4" />
             <rect x="18" y="18" width="4" height="4" />
           </svg>
          <div className="inline-flex items-center gap-2 border border-retro-border/40 bg-retro-surface/80 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-8 shadow-retro-sm">
            <div className="w-2 h-2 bg-retro-primary opacity-50"></div>
            <span>Transmission Ready</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading uppercase mb-6 tracking-tight">
            Initiate New Journal
          </h2>
          <p className="font-mono text-sm mb-8 max-w-xl mx-auto opacity-70 uppercase tracking-widest">
            Record current state. Preserve context.
          </p>
          <Link href="/write" className="px-8 py-4 inline-block bg-retro-text text-retro-surface font-heading uppercase text-sm tracking-widest hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm">
            Begin Transmission
          </Link>
        </div>
      </section>
    </div>
  );
}
