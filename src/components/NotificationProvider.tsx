'use client';

import { useEffect } from 'react';
import { checkHasPostedToday } from '@/actions/notification.actions';

export function NotificationProvider() {
  useEffect(() => {
    // Check if notifications are supported and permitted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') return;

      const checkTimeAndNotify = async () => {
        const storedTime = localStorage.getItem('inner-margins-reminder');
        if (!storedTime) return;

        // Current local time
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeString = `${hours}:${minutes}`;

        if (currentTimeString === storedTime) {
          // Check if we already sent it today
          const lastSentString = localStorage.getItem('inner-margins-last-sent');
          const todayString = now.toDateString();
          if (lastSentString === todayString) return;

          // Check if user has posted today
          try {
            const hasPosted = await checkHasPostedToday();
            if (!hasPosted) {
              new Notification('Inner Margins', {
                body: 'Time to write your daily entry and maintain your streak! 📝',
                icon: '/icon.png',
                requireInteraction: true,
              });
              localStorage.setItem('inner-margins-last-sent', todayString);
            } else {
              // They posted, don't ping them, but mark today as handled.
              localStorage.setItem('inner-margins-last-sent', todayString);
            }
          } catch (err) {
            console.error('Failed to check posting status for notification', err);
          }
        }
      };

      // Check every 30 seconds
      const interval = setInterval(checkTimeAndNotify, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  return null;
}
