'use client';

import { useState, useEffect } from 'react';
import { verifyPasscode } from '@/actions/auth.actions';

interface PinLockProps {
  onUnlock?: () => void;
  onUnlockPin?: (pin: string) => Promise<boolean | void>;
}

export default function PinLock({ onUnlock, onUnlockPin }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || isVerifying) return;

    setIsVerifying(true);
    setError(false);
    setErrorMessage('');

    try {
      let isSuccess = false;

      if (onUnlockPin) {
        const result = await onUnlockPin(pin);
        isSuccess = result !== false;
      } else {
        isSuccess = await verifyPasscode(pin);
        if (isSuccess && onUnlock) {
          onUnlock();
        }
      }

      if (!isSuccess) {
        setError(true);
        setAttempts((prev) => prev + 1);
        setPin('');
        setTimeout(() => setError(false), 1200);
      }
    } catch {
      setError(true);
      setErrorMessage('Verification failed. Try again.');
      setTimeout(() => setError(false), 1500);
    } finally {
      setIsVerifying(false);
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
              disabled={isVerifying}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className={`w-full text-center text-3xl font-mono tracking-[0.5em] bg-retro-bg border-b-2 p-4 outline-none transition-colors disabled:opacity-50 ${
                error
                  ? 'border-retro-primary text-retro-primary animate-shake'
                  : 'border-retro-border/50 text-retro-text focus:border-retro-text focus:bg-retro-surface'
              }`}
              placeholder="******"
              autoFocus
            />
          </div>

          {errorMessage && (
            <div className="text-[10px] font-mono text-retro-primary uppercase tracking-widest">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || pin.length === 0}
            className="w-full px-8 py-4 bg-retro-text text-retro-surface font-heading uppercase text-sm tracking-widest hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Authenticate'}
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
