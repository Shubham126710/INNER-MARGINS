'use server';

import { db } from '@/lib/db';
import { BlogPost } from '@/lib/types';
import { cleanExcerpt } from '@/lib/utils';
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

// Helper to map Prisma Post to BlogPost, with secure masking for locked posts
function mapToBlogPost(
  post: {
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
  },
  allowLocked = false
): BlogPost {
  const isLocked = post.isLocked ?? false;

  // Mask locked content on public feeds so nothing sensitive leaks in inspect/HTML
  const title = isLocked && !allowLocked ? '[ ENCRYPTED ARCHIVE ]' : post.title;
  const excerpt = isLocked && !allowLocked
    ? 'Encrypted memory fragment. Clearance required to decrypt transmission.'
    : cleanExcerpt(post.excerpt || post.content || '', 150);
  const coverImage = isLocked && !allowLocked ? undefined : (post.coverImage || undefined);
  const tags = isLocked && !allowLocked
    ? ['locked']
    : post.tags ? post.tags.map((t) => (typeof t === 'string' ? t : t.name)) : [];

  return {
    ...post,
    title,
    excerpt,
    coverImage,
    content: isLocked && !allowLocked ? undefined : (post.content || undefined),
    readTime: post.readTime || (post.content ? calculateReadTime(post.content) : '1 min read'),
    tags,
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : (post.updatedAt || (post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt)),
    isLocked,
  };
}

export type TagWithCount = {
  name: string;
  count: number;
};

export type PaginatedPostsResult = {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const getPublishedPostSlugs = unstable_cache(
  async (limit = 30): Promise<string[]> => {
    const posts = await db.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return posts.map((p) => p.slug);
  },
  ['get-published-post-slugs'],
  { revalidate: 86400, tags: ['posts'] }
);

export const getAllTagsWithCounts = unstable_cache(
  async (): Promise<TagWithCount[]> => {
    const tags = await db.tag.findMany({
      where: { posts: { some: { isPublished: true } } },
      select: {
        name: true,
        _count: {
          select: {
            posts: { where: { isPublished: true } },
          },
        },
      },
      orderBy: {
        posts: { _count: 'desc' },
      },
    });
    return tags.map((t) => ({
      name: t.name,
      count: t._count.posts,
    }));
  },
  ['get-all-tags-with-counts'],
  { revalidate: 86400, tags: ['posts', 'tags'] }
);

const getCachedPublishedPostsPaginated = unstable_cache(
  async (
    page: number,
    pageSize: number,
    tag: string,
    search: string,
    sort: 'newest' | 'oldest' | 'alphabetical'
  ): Promise<PaginatedPostsResult> => {
    const where: Record<string, unknown> = {
      isPublished: true,
    };
    if (tag) {
      where.tags = { some: { name: tag } };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'alphabetical') {
      orderBy = { title: 'asc' };
    }

    const skip = (page - 1) * pageSize;
    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        select: postCardSelect,
        orderBy,
        skip,
        take: pageSize,
      }),
      db.post.count({ where }),
    ]);

    return {
      posts: posts.map((p) => mapToBlogPost(p, false)),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },
  ['get-published-posts-paginated'],
  { revalidate: 3600, tags: ['posts'] }
);

export async function getPublishedPostsPaginated(params?: {
  page?: number;
  pageSize?: number;
  tag?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alphabetical';
}): Promise<PaginatedPostsResult> {
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, Math.min(params?.pageSize || 15, 50));
  const tag = params?.tag?.trim() || '';
  const search = params?.search?.trim() || '';
  const sort = params?.sort || 'newest';

  return getCachedPublishedPostsPaginated(page, pageSize, tag, search, sort);
}

export const getPosts = unstable_cache(
  async (limit = 15): Promise<BlogPost[]> => {
    const posts = await db.post.findMany({
      select: postCardSelect,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return posts.map((p) => mapToBlogPost(p, false));
  },
  ['get-posts'],
  { revalidate: 3600, tags: ['posts'] }
);

export const getPublishedPosts = unstable_cache(
  async (limit = 15): Promise<BlogPost[]> => {
    const posts = await db.post.findMany({
      where: { isPublished: true },
      select: postCardSelect,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return posts.map((p) => mapToBlogPost(p, false));
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
    return posts.map((p) => mapToBlogPost(p, false));
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
    if (!post) return null;
    // If locked, map with allowLocked = false so initial HTML doesn't leak secrets
    return mapToBlogPost(post, !post.isLocked);
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
    // Used by editor on authenticated /write route
    return post ? mapToBlogPost(post, true) : null;
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
  let previousSlug: string | undefined;
  const readTime = calculateReadTime(post.content);
  const excerpt = cleanExcerpt(post.excerpt || post.content, 150);

  if (post.id) {
    const existing = await db.post.findUnique({ where: { id: post.id }, select: { slug: true } });
    previousSlug = existing?.slug;

    savedPost = await db.post.update({
      where: { id: post.id },
      data: {
        title: post.title,
        slug,
        content: post.content,
        excerpt,
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
        excerpt,
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
  updateTag('tags');
  updateTag('analysis');
  revalidatePath('/', 'page');
  revalidatePath('/journals', 'page');
  revalidatePath('/analysis', 'page');
  if (savedPost.slug) {
    revalidatePath(`/posts/${savedPost.slug}`, 'page');
  }
  if (previousSlug && previousSlug !== savedPost.slug) {
    revalidatePath(`/posts/${previousSlug}`, 'page');
  }
  return mapToBlogPost(savedPost, true);
}

export async function deletePost(id: string): Promise<void> {
  const post = await db.post.findUnique({ where: { id }, select: { slug: true } });
  await db.post.delete({ where: { id } });

  updateTag('posts');
  updateTag('tags');
  updateTag('analysis');
  revalidatePath('/', 'page');
  revalidatePath('/journals', 'page');
  revalidatePath('/analysis', 'page');
  if (post?.slug) {
    revalidatePath(`/posts/${post.slug}`, 'page');
  }
}
