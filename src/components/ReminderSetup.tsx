'use client';

import { useState, useEffect } from 'react';

export default function ReminderSetup() {
  const [time, setTime] = useState('20:00');
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const savedTime = localStorage.getItem('inner-margins-reminder');
    if (savedTime) {
      setTime(savedTime);
      setEnabled(true);
    }
  }, []);

  const handleSave = async () => {
    if (!('Notification' in window)) {
      setStatus('Notifications are not supported in this browser.');
      return;
    }

    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      localStorage.setItem('inner-margins-reminder', time);
      setEnabled(true);
      setStatus('Reminder saved! Ensure the app stays open or installed to receive notifications.');
      setTimeout(() => setStatus(''), 5000);
    } else {
      setStatus('Permission denied. Please enable notifications in your browser settings.');
    }
  };

  const handleDisable = () => {
    localStorage.removeItem('inner-margins-reminder');
    setEnabled(false);
    setStatus('Reminders disabled.');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="border-4 border-retro-border bg-retro-surface p-8 shadow-retro mt-8">
      <h2 className="text-2xl font-display uppercase mb-6 border-b-2 border-retro-border pb-4">
        Streak Reminders
      </h2>
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-6">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-code uppercase text-retro-text/80">
            Set Reminder Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full max-w-[200px] p-3 text-lg font-code bg-retro-bg border-4 border-retro-border outline-none focus:border-retro-primary"
          />
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="btn-primary">
            {enabled ? 'Update Timer' : 'Enable Reminders'}
          </button>
          {enabled && (
             <button onClick={handleDisable} className="btn-secondary">
               Disable
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
