'use server'

import { db } from '@/lib/db';
import { BlogPost } from '@/lib/types';
import { revalidatePath } from 'next/cache';

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper to map Prisma Post to BlogPost
function mapToBlogPost(post: any): BlogPost {
  return {
    ...post,
    tags: post.tags ? post.tags.map((t: any) => t.name) : [],
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    isLocked: post.isLocked ?? false,
  };
}

export async function getPosts(): Promise<BlogPost[]> {
    const posts = await db.post.findMany({
        include: { tags: true },
        orderBy: { createdAt: 'desc' }
    });
    return posts.map(mapToBlogPost);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
    const posts = await db.post.findMany({
        where: { isPublished: true },
        include: { tags: true },
        orderBy: { createdAt: 'desc' }
    });
    return posts.map(mapToBlogPost);
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
    const posts = await db.post.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { tags: true },
        orderBy: { createdAt: 'desc' }
    });
    return posts.map(mapToBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await db.post.findUnique({
        where: { slug },
        include: { tags: true }
    });
    return post ? mapToBlogPost(post) : null;
}

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
    
    // Calculate read time
    const readTime = post.readTime || '5 min read';

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

    revalidatePath('/');
    return mapToBlogPost(savedPost);
}

export async function deletePost(id: string): Promise<void> {
    await db.post.delete({ where: { id } });
    revalidatePath('/');
}

export async function getPostById(id: string): Promise<BlogPost | null> {
    const post = await db.post.findUnique({
        where: { id },
        include: { tags: true }
    });
    return post ? mapToBlogPost(post) : null;
}
