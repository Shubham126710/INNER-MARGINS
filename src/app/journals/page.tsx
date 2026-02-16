
import Link from 'next/link';
import { JournalSection } from '@/components';
import { getPublishedPosts } from '@/actions/post.actions';

export const dynamic = 'force-dynamic';

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
      <JournalSection posts={filteredPosts} allTags={allTags} activeTag={tag} />
      
       {/* CTA Section */}
       <section className="py-24 border-t-4 border-retro-border bg-retro-primary text-retro-surface mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
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
