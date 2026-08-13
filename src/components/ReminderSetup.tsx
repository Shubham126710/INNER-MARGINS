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
  const [reminderTime, setReminderTime] = useState<string>('20:00');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
              setEnabled(true);
              fetch(`/api/notifications/subscribe?endpoint=${encodeURIComponent(sub.endpoint)}`)
                .then(res => res.json())
                .then(data => {
                  if (data && data.reminderTime) {
                    setReminderTime(data.reminderTime);
                  }
                })
                .catch(console.error);
            }
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
          body: JSON.stringify({ subscription, reminderTime }),
        });

        setEnabled(true);
        setStatus('Background push reminders enabled!');
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
    <div>
      <h2 className="text-2xl font-display tracking-tight text-ink mb-6 border-b border-ink/10 pb-4">
        Writing Habit
      </h2>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-sans text-muted max-w-lg">
            Enable daily reminders to maintain your writing streak. We will notify you if you haven't written an entry by the set time.
          </p>
          <div className="flex items-center gap-4">
             <label className="text-xs font-sans font-medium uppercase tracking-widest text-muted">Daily Time:</label>
             <input 
               type="time" 
               value={reminderTime}
               onChange={(e) => setReminderTime(e.target.value)}
               className="p-2 font-mono text-sm bg-transparent border border-ink/20 focus:border-ink/50 text-ink focus:outline-none transition-colors"
             />
          </div>
        </div>
        <div className="flex gap-4 self-end md:self-auto mt-4 md:mt-0">
          {!enabled ? (
            <button onClick={handleSave} className="btn-primary">
              Enable Reminders
            </button>
          ) : (
            <div className="flex gap-4">
               <button onClick={handleSave} className="btn-primary">
                 Update Time
               </button>
               <button onClick={handleDisable} className="btn-secondary">
                 Disable
               </button>
            </div>
          )}
        </div>
      </div>
      {status && (
        <div className="font-sans text-sm text-ink bg-ink/5 p-4 border-l-2 border-ink animate-fade-in mt-6">
          {status}
        </div>
      )}
    </div>
  );
}
