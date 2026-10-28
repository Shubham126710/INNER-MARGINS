import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getPublishedPostSlugs } from '@/actions/post.actions';
import { PostView, LockedPostView } from '@/components';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPostSlugs(30);
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (err) {
    console.warn('generateStaticParams: DB unreachable at build time, using on-demand ISR fallback.', err);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Post Not Found | Inner Margins',
    };
  }

  if (post.isLocked) {
    return {
      title: 'Encrypted Fragment | Inner Margins',
      description: 'Encrypted transmission fragment. Clearance required to decrypt.',
    };
  }

  return {
    title: `${post.title} | Inner Margins`,
    description: post.excerpt || `${post.title} on Inner Margins`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  if (post.isLocked) {
    return <LockedPostView slug={slug} />;
  }

  return <PostView post={post} />;
}
