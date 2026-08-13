'use client';

import { useState, useEffect } from 'react';

interface PinLockProps {
  onUnlock: () => void;
}

export default function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Obfuscated PIN check to hide it from plain sight in the repository
    const encoded = typeof window !== 'undefined' ? window.btoa(pin) : '';
    if (encoded === 'MzE0MTU5') {
      onUnlock();
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center p-4 bg-paper font-sans selection:bg-ink selection:text-paper relative">
      
      <div className="w-full max-w-md bg-white border border-ink/10 p-8 lg:p-12 shadow-sm text-center relative z-20">
        
        <h2 className="text-3xl font-display text-ink mb-2 tracking-tight">
          Restricted Area
        </h2>
        
        <p className="text-muted font-sans text-xs uppercase tracking-widest mb-10">
          Enter passphrase to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className={`w-full text-center text-3xl font-sans tracking-[0.5em] bg-transparent border-b p-4 outline-none transition-colors ${
                error 
                  ? 'border-red-500 text-red-500 animate-shake' 
                  : 'border-ink/20 text-ink focus:border-ink/50'
              }`}
              placeholder="******"
              autoFocus
            />
          </div>

          <div className="text-[10px] font-sans uppercase tracking-widest text-muted/50">
            HINT: PTSD
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4"
          >
            Unlock
          </button>
        </form>

        {attempts > 2 && (
          <div className="mt-8 p-3 border border-red-500/20 bg-red-500/5 text-red-500 font-sans text-[10px] uppercase tracking-widest">
            Too many failed attempts
          </div>
        )}
      </div>
    </div>
  );
}
