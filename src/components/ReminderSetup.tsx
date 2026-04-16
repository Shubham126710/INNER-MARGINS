'use client';

import { useState, useEffect } from 'react';

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function ReminderSetup() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) setEnabled(true);
          });
        }
      });
    }
  }, []);

  const handleSave = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('Push notifications are not supported in this browser.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      let permission = Notification.permission;

      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BPZQank0DLkwcFRnBtizY8QO0huTV3A9bdikCxQZviC9y_9Uwljnzvyc3tl-tjw7P8_Far5qlGfwMedPbdC6BT0';
        const applicationServerKey = urlB64ToUint8Array(vapidKey);
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription }),
        });

        setEnabled(true);
        setStatus('Background push reminders enabled! You are all set.');
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('Permission denied. Please enable notifications in your browser settings.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Failed to enable reminders. Check console.');
    }
  };

  const handleDisable = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await fetch('/api/notifications/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }
    }
    setEnabled(false);
    setStatus('Reminders disabled.');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="border-4 border-retro-border bg-retro-surface p-8 shadow-retro mt-8">
      <h2 className="text-2xl font-display uppercase mb-6 border-b-2 border-retro-border pb-4">
        Background Reminders
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <p className="flex-1 text-sm font-code text-retro-text/80">
          Get notified globally even when the app is closed if you haven&apos;t written your journal for the day!
        </p>
        <div className="flex gap-4">
          {!enabled ? (
            <button onClick={handleSave} className="btn-primary">
              Enable Reminders
            </button>
          ) : (
             <button onClick={handleDisable} className="btn-secondary">
               Disable Push
             </button>
          )}
        </div>
      </div>
      {status && (
        <div className="font-code text-sm text-retro-primary bg-retro-primary/10 p-3 border-l-4 border-retro-primary animate-fade-in">
          {status}
        </div>
      )}
    </div>
  );
}
