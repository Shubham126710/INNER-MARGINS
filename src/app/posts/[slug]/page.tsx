import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostBySlug, getPublishedPosts } from '@/actions/post.actions';
import { PostView, LockedPostView } from '@/components';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Post Not Found | Inner Margins',
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
    return <LockedPostView post={post} />;
  }

  return <PostView post={post} />;
}
