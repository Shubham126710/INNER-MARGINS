'use server';

import crypto from 'crypto';
import { db } from '@/lib/db';
import { BlogPost } from '@/lib/types';

// Server-side SHA-256 hash for default master clearance credentials
const DEFAULT_PASSCODE_HASH = 'b065ec060934cf10a8d6263ecae93094b8156157143e11ad9cffebf9c3ffbbec';

export async function verifyPasscode(inputPin: string): Promise<boolean> {
  if (!inputPin || typeof inputPin !== 'string') return false;

  const envPasscode = process.env.APP_PASSCODE || process.env.SITE_PASSCODE;
  const targetHash = envPasscode
    ? crypto.createHash('sha256').update(envPasscode.trim()).digest('hex')
    : DEFAULT_PASSCODE_HASH;

  const inputHash = crypto.createHash('sha256').update(inputPin.trim()).digest('hex');

  const targetBuffer = Buffer.from(targetHash, 'hex');
  const inputBuffer = Buffer.from(inputHash, 'hex');

  if (targetBuffer.length !== inputBuffer.length) return false;
  return crypto.timingSafeEqual(targetBuffer, inputBuffer);
}

export async function unlockLockedPost(
  slug: string,
  pin: string
): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  const isAuthorized = await verifyPasscode(pin);
  if (!isAuthorized) {
    return { success: false, error: 'Clearance denied. Invalid passcode.' };
  }

  const post = await db.post.findUnique({
    where: { slug },
    include: { tags: true },
  });

  if (!post) {
    return { success: false, error: 'Transmission fragment not found.' };
  }

  return {
    success: true,
    post: {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || undefined,
      isFeatured: post.isFeatured,
      isPublished: post.isPublished,
      isLocked: post.isLocked,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      readTime: post.readTime,
      tags: post.tags.map((t) => t.name),
    },
  };
}
