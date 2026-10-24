import { Suspense } from 'react';
import Link from 'next/link';
import { JournalSection } from '@/components';
import { getPublishedPosts } from '@/actions/post.actions';

export const revalidate = 3600;

export const metadata = {
  title: 'Archive | Inner Margins',
  description: 'Journal archive and memory retrieval.',
};

export default async function JournalsPage() {
  const posts = await getPublishedPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface pt-4 md:pt-8">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex justify-center">
            <div className="w-8 h-8 border border-retro-primary animate-pulse motion-reduce:animate-none"></div>
          </div>
        }
      >
        <JournalSection posts={posts} allTags={allTags} />
      </Suspense>
      
       {/* CTA Section */}
       <section className="py-24 border-t border-retro-border/30 bg-retro-bg text-retro-text mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--retro-primary)_0%,transparent_50%)] opacity-[0.05] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-8 opacity-50" aria-hidden="true">
             <rect x="2" y="2" width="4" height="4" />
             <rect x="18" y="2" width="4" height="4" />
             <rect x="2" y="18" width="4" height="4" />
             <rect x="18" y="18" width="4" height="4" />
           </svg>
          <h2 className="text-3xl lg:text-4xl font-heading mb-4 tracking-tight">
            Initiate New Journal
          </h2>
          <p className="font-body text-sm mb-8 max-w-xl mx-auto opacity-75">
            Record current state. Preserve context into persistent storage.
          </p>
          <Link href="/write" className="px-8 py-3.5 inline-block bg-retro-text text-retro-surface font-heading text-sm hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-px active:shadow-retro-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary">
            Begin transmission
          </Link>
        </div>
      </section>
    </div>
  );
}
