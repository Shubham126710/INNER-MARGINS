'use client';

import { useState } from 'react';

interface PinLockProps {
  onUnlock: () => void;
}

export default function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '314159') {
      onUnlock();
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-retro-surface border-4 border-retro-border p-8 shadow-retro text-center">
        <div className="mb-6">
          <span className="text-6xl">🔒</span>
        </div>
        
        <h2 className="text-2xl font-heading uppercase text-retro-text mb-2">
          Security Clearance Required
        </h2>
        
        <p className="text-retro-text/80 font-mono text-sm mb-8">
          This entry is classified. Enter access code to decrypt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className={`w-full text-center text-3xl font-mono tracking-[0.5em] bg-retro-bg border-4 p-4 outline-none transition-colors ${
                error 
                  ? 'border-retro-primary text-retro-primary animate-shake' 
                  : 'border-retro-border text-retro-text focus:border-retro-text'
              }`}
              placeholder="******"
              autoFocus
            />
          </div>

          <div className="text-xs font-mono text-retro-text/60">
            HINT: PTSD
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Authenticate
          </button>
        </form>

        {attempts > 2 && (
          <div className="mt-6 p-2 bg-retro-primary text-retro-surface font-mono text-xs uppercase animate-pulse">
            Warning: Unauthorized Access Detected
          </div>
        )}
      </div>
    </div>
  );
}
