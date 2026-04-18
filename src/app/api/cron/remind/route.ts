import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import webpush from 'web-push';
import { checkHasPostedToday } from '@/actions/notification.actions';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || ''
    );

    // Only allow cron secret if configured
    const cronSecret = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET;
    if (
      cronSecret &&
      req.headers.get('Authorization') !== `Bearer ${cronSecret}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasPosted = await checkHasPostedToday();

    if (hasPosted) {
      return NextResponse.json({ message: 'User has already posted today. No reminder needed.' });
    }

    const subscriptions = await db.pushSubscription.findMany();
    
    if (subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions found' });
    }

    const messages = [
      { title: 'Inner Margins', body: "Keep your streak alive! Time to write today's journal entry." },
      { title: 'Hello? Is anyone there?', body: "Your journal is feeling lonely today. Don't leave it hanging." },
      { title: 'Streak in danger!', body: "Write now or lose everything! Okay, maybe just the streak, but still." },
      { title: 'Paging author...', body: "I am literally a robot maintaining your streak logic. Please just write." },
      { title: 'Knock knock.', body: "It's your thoughts. They want out. Open the app." },
      { title: 'Excuse me?', body: "Did you really think I'd let you skip today? Get writing." }
    ];
    
    // Note: If you want to use custom times, you MUST use an external hourly cron service like cron-job.org
    // because Vercel Free only allows 1 cron execution per day.
    
    const currentHourStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hourCycle: 'h23' });
    const currentHour = parseInt(currentHourStr, 10);

    let sentCount = 0;
    const sendPromises = subscriptions.map((sub: { id: string; endpoint: string; p256dh: string; auth: string; reminderTime?: string }) => {
      
      const subTime = sub.reminderTime || '20:00';
      const subHour = parseInt(subTime.split(':')[0], 10);
      
      // If using an hourly external cron, this ensures it only sends during their requested hour
      if (subHour !== currentHour && req.headers.get('x-force-send') !== 'true') {
        return Promise.resolve(); // Skip until their requested hour
      }

      sentCount++;
      const randMsg = messages[Math.floor(Math.random() * messages.length)];
      const payload = JSON.stringify({
        title: randMsg.title,
        body: randMsg.body,
        url: '/write'
      });

      return webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      ).catch(async (e: unknown) => {
        // If subscription is gone, remove it from db
        const err = e as { statusCode?: number };
        if (err.statusCode === 404 || err.statusCode === 410) {
          await db.pushSubscription.delete({ where: { id: sub.id } });
        }
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, evaluated: subscriptions.length, sent: sentCount, currentHour });
  } catch (error: unknown) {
    console.error('Error sending push notifications:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
