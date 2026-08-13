import Link from 'next/link';
import { JournalSection } from '@/components';
import { getPublishedPosts } from '@/actions/post.actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Archive | Inner Margins',
  description: 'A personal archive of things I couldn\'t leave unwritten.',
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
    <div className="min-h-screen bg-paper font-sans">
      <JournalSection posts={filteredPosts} allTags={allTags} activeTag={tag} />
      
      {/* Editorial CTA */}
      <section className="py-24 border-t border-ink/10 bg-ink/5 mt-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-display text-3xl md:text-4xl text-ink leading-tight mb-8">
            "We write to taste life twice, in the moment and in retrospect."
          </p>
          <Link href="/write" className="btn-secondary">
            Write an Entry
          </Link>
        </div>
      </section>
    </div>
  );
}
