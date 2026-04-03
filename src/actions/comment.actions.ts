'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCommentsAction(postId: string) {
  try {
    const comments = await db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });
    return comments.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Failed to fetch comments', error);
    return [];
  }
}

export async function addCommentAction(postId: string, author: string, content: string) {
  try {
    if (!author.trim() || !content.trim()) {
      return { error: 'Author and content are required' };
    }

    const comment = await db.comment.create({
      data: {
        author,
        content,
        postId,
      },
    });

    // Revalidate the post page to show the new comment
    revalidatePath(`/posts/[slug]`, 'page');
    return { success: true, comment: { ...comment, createdAt: comment.createdAt.toISOString() } };
  } catch (error) {
    console.error('Failed to add comment', error);
    return { error: 'Failed to add comment' };
  }
}
