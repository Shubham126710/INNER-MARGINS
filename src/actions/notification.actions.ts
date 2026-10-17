'use server'

import { db } from '@/lib/db';

export async function checkHasPostedToday(): Promise<boolean> {
  const latestPost = await db.post.findFirst({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (!latestPost) return false;
  
  const toDateString = (date: Date) => {
    return new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  };
  
  const now = new Date();
  const todayStr = toDateString(now);
  
  return toDateString(latestPost.createdAt) === todayStr;
}
