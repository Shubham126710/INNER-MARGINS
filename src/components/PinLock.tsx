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
    <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center p-4 bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface relative overflow-hidden">
      
      {/* Scanline overlay for the lock screen specifically */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>

      <div className="w-full max-w-md bg-retro-surface/80 border border-retro-border/30 p-8 lg:p-12 shadow-retro text-center relative z-20">
        
        <div className="absolute top-0 right-0 p-4 opacity-30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-retro-text">
            <rect x="2" y="2" width="4" height="4" />
            <rect x="18" y="2" width="4" height="4" />
            <rect x="2" y="18" width="4" height="4" />
            <rect x="18" y="18" width="4" height="4" />
          </svg>
        </div>

        <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 border border-retro-primary text-retro-primary text-[10px] uppercase font-mono tracking-widest px-3 py-1 shadow-retro-sm">
              <div className="w-2 h-2 bg-retro-primary animate-pulse"></div>
              <span>Protocol Active</span>
            </div>
        </div>
        
        <h2 className="text-2xl font-heading uppercase text-retro-text mb-2 tracking-tight">
          Clearance Required
        </h2>
        
        <p className="text-retro-text/60 font-mono text-[10px] uppercase tracking-widest mb-10">
          Encrypted sector. Enter passkey to decrypt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className={`w-full text-center text-3xl font-mono tracking-[0.5em] bg-retro-bg border-b-2 p-4 outline-none transition-colors ${
                error 
                  ? 'border-retro-primary text-retro-primary animate-shake' 
                  : 'border-retro-border/50 text-retro-text focus:border-retro-text focus:bg-retro-surface'
              }`}
              placeholder="******"
              autoFocus
            />
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-retro-text/40">
            HINT: PTSD
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 bg-retro-text text-retro-surface font-heading uppercase text-sm tracking-widest hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm disabled:opacity-50"
          >
            Authenticate
          </button>
        </form>

        {attempts > 2 && (
          <div className="mt-8 p-3 border border-retro-primary/50 bg-retro-primary/10 text-retro-primary font-mono text-[10px] uppercase tracking-widest animate-pulse">
            Warning: Unauthorized Access Detected
          </div>
        )}
      </div>
    </div>
  );
}
