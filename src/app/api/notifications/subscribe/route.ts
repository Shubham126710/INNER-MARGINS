import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });
    }

    const subscription = await db.pushSubscription.findFirst({
      where: { endpoint },
    });

    if (subscription) {
      return NextResponse.json({ reminderTime: subscription.reminderTime });
    }

    return NextResponse.json({ reminderTime: null });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { subscription, reminderTime } = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    // Upsert the subscription using the unique endpoint
    await db.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        reminderTime: reminderTime || "20:00"
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        reminderTime: reminderTime || "20:00"
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();

    if (!endpoint) {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    await db.pushSubscription.deleteMany({
      where: { endpoint },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
