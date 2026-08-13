'use client';

import { useState, useEffect } from 'react';
import { FrontMatter } from './Editorial';

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
    <div className="flex-1 w-full min-h-[70vh] flex flex-col items-center justify-center p-6 bg-paper font-sans text-ink relative">
      
      <div className="w-full max-w-2xl border-t-2 border-b-2 border-ink py-16 text-center relative z-20">
        
        <FrontMatter items={['SECURE ARCHIVE']} className="justify-center mb-8" />
        
        <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tight leading-[0.9] mb-12">
          Restricted Edition
        </h2>
        
        <p className="text-sm font-sans text-muted max-w-sm mx-auto mb-16 leading-relaxed">
          This section of the publication contains sensitive personal entries. Access is restricted to the editor.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-8">
          <div className="relative group">
            <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4 border-b border-ink/20 pb-2">
              Enter Passkey
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className={`w-full text-center text-4xl font-mono tracking-[0.5em] bg-transparent outline-none transition-colors py-2 ${
                error 
                  ? 'text-red-700 animate-shake' 
                  : 'text-ink focus:text-accent'
              }`}
              placeholder="******"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 border border-ink text-ink font-sans text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
          >
            Authenticate
          </button>
        </form>

        {attempts > 2 && (
          <div className="mt-8 text-red-700 font-sans text-[10px] uppercase tracking-widest">
            Authorization failed. Multiple invalid attempts.
          </div>
        )}
      </div>
      
    </div>
  );
}
