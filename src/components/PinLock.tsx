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
        setErrorMessage('Clearance denied. Invalid passcode.');
        setAttempts((prev) => prev + 1);
        setPin('');
        setTimeout(() => {
          setError(false);
          setErrorMessage('');
        }, 1500);
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
      <div className="w-full max-w-md bg-retro-surface/80 border border-retro-border/30 p-8 lg:p-12 shadow-retro text-center relative z-20">
        <div className="absolute top-0 right-0 p-4 opacity-30" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-retro-text" aria-hidden="true">
            <rect x="2" y="2" width="4" height="4" />
            <rect x="18" y="2" width="4" height="4" />
            <rect x="2" y="18" width="4" height="4" />
            <rect x="18" y="18" width="4" height="4" />
          </svg>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 border border-retro-primary text-retro-primary text-xs font-body px-3 py-1 shadow-retro-sm">
            <div className="w-2 h-2 bg-retro-primary animate-pulse motion-reduce:animate-none"></div>
            <span>Protocol active</span>
          </div>
        </div>

        <h2 className="text-2xl font-heading text-retro-text mb-2 tracking-tight">
          Clearance Required
        </h2>

        <p className="text-retro-text/70 font-body text-xs mb-8">
          Encrypted sector. Enter passkey to decrypt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="text-xs font-body text-retro-primary font-medium">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || pin.length === 0}
            className="w-full px-8 py-3.5 bg-retro-text text-retro-surface font-heading text-sm hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-px active:shadow-retro-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? 'Verifying…' : 'Authenticate'}
          </button>
        </form>

        {attempts > 2 && (
          <div className="mt-8 p-3 border border-retro-primary/50 bg-retro-primary/10 text-retro-primary font-body text-xs animate-pulse motion-reduce:animate-none">
            Warning: unauthorized access detected
          </div>
        )}
      </div>
    </div>
  );
}
