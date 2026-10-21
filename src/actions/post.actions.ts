'use server';

import { db } from '@/lib/db';
import { BlogPost } from '@/lib/types';
import { unstable_cache, updateTag, revalidatePath } from 'next/cache';

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

// Common select projection for cards/lists to prevent fetching megabytes of content
const postCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  isFeatured: true,
  isPublished: true,
  isLocked: true,
  createdAt: true,
  updatedAt: true,
  readTime: true,
  tags: { select: { name: true } },
} as const;

// Helper to map Prisma Post to BlogPost
function mapToBlogPost(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  coverImage?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  isLocked: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  readTime?: string | null;
  tags?: Array<{ name: string } | string>;
}): BlogPost {
  return {
    ...post,
    coverImage: post.coverImage || undefined,
    content: post.content || undefined,
    readTime: post.readTime || (post.content ? calculateReadTime(post.content) : '1 min read'),
    tags: post.tags ? post.tags.map((t) => typeof t === 'string' ? t : t.name) : [],
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : (post.updatedAt || (post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt)),
    isLocked: post.isLocked ?? false,
  };
}

export const getPosts = unstable_cache(
  async (limit?: number): Promise<BlogPost[]> => {
    const posts = await db.post.findMany({
      select: postCardSelect,
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });
    return posts.map(mapToBlogPost);
  },
  ['get-posts'],
  { revalidate: 3600, tags: ['posts'] }
);

export const getPublishedPosts = unstable_cache(
  async (limit?: number): Promise<BlogPost[]> => {
    const posts = await db.post.findMany({
      where: { isPublished: true },
      select: postCardSelect,
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });
    return posts.map(mapToBlogPost);
  },
  ['get-published-posts'],
  { revalidate: 3600, tags: ['posts'] }
);

export const getFeaturedPosts = unstable_cache(
  async (limit?: number): Promise<BlogPost[]> => {
    const posts = await db.post.findMany({
      where: { isPublished: true, isFeatured: true },
      select: postCardSelect,
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });
    return posts.map(mapToBlogPost);
  },
  ['get-featured-posts'],
  { revalidate: 3600, tags: ['posts'] }
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const post = await db.post.findUnique({
      where: { slug },
      include: { tags: true },
    });
    return post ? mapToBlogPost(post) : null;
  },
  ['get-post-by-slug'],
  { revalidate: 86400, tags: ['posts'] }
);

export const getPostById = unstable_cache(
  async (id: string): Promise<BlogPost | null> => {
    const post = await db.post.findUnique({
      where: { id },
      include: { tags: true },
    });
    return post ? mapToBlogPost(post) : null;
  },
  ['get-post-by-id'],
  { revalidate: 86400, tags: ['posts'] }
);

export async function savePost(post: Partial<BlogPost> & { title: string; content: string }): Promise<BlogPost> {
  // Generate slug from title if not provided, or ensure current slug is valid
  let slug = post.slug;
  if (!slug) {
    slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 60);
  }

  // Ensure unique slug if new post
  if (!post.id) {
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const tagNames = post.tags || [];
  const tagsConnect = tagNames.map(name => ({
    where: { name },
    create: { name }
  }));

  let savedPost;
  const readTime = calculateReadTime(post.content);

  if (post.id) {
    savedPost = await db.post.update({
      where: { id: post.id },
      data: {
        title: post.title,
        slug,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        coverImage: post.coverImage,
        isFeatured: post.isFeatured,
        isPublished: post.isPublished,
        isLocked: post.isLocked,
        readTime,
        tags: {
          set: [],
          connectOrCreate: tagsConnect
        }
      },
      include: { tags: true }
    });
  } else {
    savedPost = await db.post.create({
      data: {
        title: post.title,
        slug,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        coverImage: post.coverImage,
        isFeatured: post.isFeatured || false,
        isLocked: post.isLocked || false,
        isPublished: post.isPublished || false,
        readTime,
        tags: {
          connectOrCreate: tagsConnect
        }
      },
      include: { tags: true }
    });
  }

  updateTag('posts');
  updateTag('analysis');
  revalidatePath('/');
  revalidatePath('/journals');
  revalidatePath('/analysis');
  if (savedPost.slug) {
    revalidatePath(`/posts/${savedPost.slug}`);
  }
  return mapToBlogPost(savedPost);
}

export async function deletePost(id: string): Promise<void> {
  const post = await db.post.findUnique({ where: { id }, select: { slug: true } });
  await db.post.delete({ where: { id } });

  updateTag('posts');
  updateTag('analysis');
  revalidatePath('/');
  revalidatePath('/journals');
  revalidatePath('/analysis');
  if (post?.slug) {
    revalidatePath(`/posts/${post.slug}`);
  }
}
