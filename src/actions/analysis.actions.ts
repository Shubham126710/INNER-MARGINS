'use server';

import { db } from '@/lib/db';

export type AnalysisStats = {
  currentStreak: number;
  totalEntries: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  longestStreak: number;
  entriesByYear: { year: number; count: number }[];
  dailyActivity: { [date: string]: number };
  weeklyPattern: { day: string; count: number }[];
};

export async function getAnalysisStats(): Promise<AnalysisStats> {
  const posts = await db.post.findMany({
    where: {
      isPublished: true,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Helper to normalize date to YYYY-MM-DD string
  const toDateString = (date: Date) => date.toISOString().split('T')[0];
  
  const postDates = new Set(posts.map(p => toDateString(p.createdAt)));
  const sortedDates = Array.from(postDates).sort((a, b) => b.localeCompare(a)); // Descending

  const dailyActivity: { [date: string]: number } = {};
  const dayCounts: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  
  posts.forEach(post => {
      const dateStr = toDateString(post.createdAt);
      dailyActivity[dateStr] = (dailyActivity[dateStr] || 0) + 1;
      
      const dayOfWeek = post.createdAt.getDay();
      dayCounts[dayOfWeek]++;
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyPattern = days.map((day, index) => ({
      day,
      count: dayCounts[index]
  }));


  // 1. Calculate Current Streak
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  // If no post today, check if there was one yesterday to keep streak alive?
  // Usually streak includes today. If I didn't post today, is streak 0? 
  // Duolingo style: if I haven't done it today, streak is still valid until end of day.
  // GitHub style: Current streak is consecutive days ending today or yesterday.
  
  const todayStr = toDateString(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateString(yesterday);

  if (postDates.has(todayStr)) {
      // Streak is active today
      currentStreak = 1;
      checkDate = yesterday;
  } else if (postDates.has(yesterdayStr)) {
      // Streak is active from yesterday
      currentStreak = 1; // It counts yesterday
      checkDate = yesterday;
      checkDate.setDate(checkDate.getDate() - 1);
  } else {
      currentStreak = 0;
  }

  if (currentStreak > 0) {
      while (true) {
          const dateStr = toDateString(checkDate);
          if (postDates.has(dateStr)) {
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
          } else {
              break;
          }
      }
  }

  // 2. Longest Streak
  let longestStreak = 0;
  let tempStreak = 0;
  // We need to iterate through all days in history or just iterate sorted unique dates?
  // Iterating sorted unique dates is not enough because gaps break streaks.
  // Better: Iterate distinct sorted dates (ascending) and check continuity.
  
  if (sortedDates.length > 0) {
      const ascDates = [...sortedDates].reverse();
      let prevDate: Date | null = null;
      
      for (const dateStr of ascDates) {
          const currentDate = new Date(dateStr);
          if (prevDate) {
              const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (diffDays === 1) {
                  tempStreak++;
              } else {
                  tempStreak = 1;
              }
          } else {
              tempStreak = 1;
          }
          
          if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
          }
          prevDate = currentDate;
      }
  }

  // 3. Entries counts
  let thisWeek = 0;
  let thisMonth = 0;
  let thisYear = 0;
  
  // Calculate start of week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0,0,0,0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const entriesByYearMap = new Map<number, number>();

  posts.forEach(post => {
      const d = new Date(post.createdAt);
      if (d >= startOfWeek) thisWeek++;
      if (d >= startOfMonth) thisMonth++;
      if (d >= startOfYear) thisYear++;

      const y = d.getFullYear();
      entriesByYearMap.set(y, (entriesByYearMap.get(y) || 0) + 1);
  });

  const entriesByYear = Array.from(entriesByYearMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year - a.year);

  // Calculate day of week distribution (already partially done at the start)
  const dayCounts: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  
  posts.forEach(post => {
      const dayOfWeek = post.createdAt.getDay();
      dayCounts[dayOfWeek]++;
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyPattern = days.map((day, index) => ({
      day,
      count: dayCounts[index]
  }));

  return {
    currentStreak,
    totalEntries: posts.length,
    thisWeek,
    thisMonth,
    thisYear,
    longestStreak,
    entriesByYear,
    dailyActivity,
    weeklyPattern,
  };
}
