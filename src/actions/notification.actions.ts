'use server'

import { db } from '@/lib/db';

export async function checkHasPostedToday(): Promise<boolean> {
  const posts = await db.post.findMany({
    where: { isPublished: true },
    select: { createdAt: true }
  });
  
  const toDateString = (date: Date) => {
    return new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  };
  
  const now = new Date();
  const todayStr = toDateString(now);
  
  return posts.some(p => toDateString(p.createdAt) === todayStr);
}
