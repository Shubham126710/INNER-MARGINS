'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
  isPreloader?: boolean;
  className?: string;
}

export default function LoadingScreen({
  onComplete,
  isPreloader = false,
  className = '',
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const isDismissing = useRef(false);
  const [timeStr, setTimeStr] = useState('00:00:00');
  const [progress, setProgress] = useState(0);
  const [activeMessage, setActiveMessage] = useState('RECOVERING MEMORY SECTORS');

  // Smooth upward curtain exit
  const handleDismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;

    if (!containerRef.current) {
      document.body.style.overflow = '';
      onComplete?.();
      return;
    }

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.75,
      ease: 'power4.inOut',
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete?.();
      },
    });
  }, [onComplete]);

  // Lock body scroll and listen for skip keys in preloader mode
  useEffect(() => {
    if (!isPreloader) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreloader, handleDismiss]);

  // Real-time precision clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Cycling minimalist log line
  useEffect(() => {
    const MESSAGES = [
      'RECOVERING MEMORY SECTORS',
      'CALIBRATING NOSTALGIA',
      'INDEXING EPHEMERAL LOGS',
      'ALIGNING MARGINALIA',
      'ARCHIVE BUFFER READY',
    ];
    let idx = 0;
    const msgInterval = setInterval(() => {
      idx = (idx + 1) % MESSAGES.length;
      setActiveMessage(MESSAGES[idx]);
    }, 1200);
    return () => clearInterval(msgInterval);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Clean, minimal entrance
      tl.from('.minimal-rail', {
        opacity: 0,
        y: -10,
        duration: 0.5,
        stagger: 0.1,
      }).from(
        '.minimal-center',
        {
          scale: 0.92,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Numeric counter animation (1.8s duration)
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.round(counter.val);
          setProgress(current);
          if (numberRef.current) {
            numberRef.current.textContent = String(current).padStart(2, '0');
          }
        },
        onComplete: () => {
          setProgress(100);
          if (numberRef.current) {
            numberRef.current.textContent = '100';
          }
          if (isPreloader) {
            setTimeout(() => {
              handleDismiss();
            }, 400);
          }
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`fixed inset-0 min-h-[100dvh] w-screen z-[9999] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 bg-retro-bg text-retro-text select-none overflow-hidden font-body ${className}`}
    >
      {/* Background Ambience: Subtle Noise & Fine Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 mix-blend-overlay noise-bg" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] bg-[linear-gradient(transparent_50%,rgba(201,65,60,0.5)_50%)] bg-[length:100%_4px]" />

      {/* TOP RAIL: Minimal Telemetry */}
      <header className="minimal-rail relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-retro-text/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-retro-primary animate-pulse" />
          <span>INITIALIZING</span>
        </div>
        <div className="tabular-nums" suppressHydrationWarning>
          {timeStr}
        </div>
      </header>

      {/* CENTERPIECE: The Gigantic Loading Number */}
      <main className="minimal-center relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <div className="relative flex items-baseline justify-center">
          <span
            ref={numberRef}
            className="font-mono font-bold text-[min(30vw,38vh)] leading-none tracking-tighter text-retro-text tabular-nums"
          >
            {String(progress).padStart(2, '0')}
          </span>
          <span className="font-mono text-[min(7vw,9vh)] font-normal text-retro-primary/60 -ml-1 sm:-ml-3 tracking-normal">
            %
          </span>
        </div>

        {/* Minimal Archival Ticker Beneath Number */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-retro-text/75">
          <span className="text-retro-text/40">[{String(progress).padStart(3, '0')}/100]</span>
          <span className="text-retro-primary">&bull;</span>
          <span className="truncate">{activeMessage}</span>
        </div>
      </main>

      {/* BOTTOM RAIL: Minimal Ledger & Interactive Skip */}
      <footer className="minimal-rail relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-retro-text/50">
        <div>
          <span>SEC_01 // 2026</span>
        </div>

        {isPreloader && (
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3.5 py-1 border border-retro-border/30 hover:border-retro-primary bg-retro-surface/50 hover:bg-retro-primary hover:text-white transition-all text-[9px] uppercase tracking-[0.25em] text-retro-text cursor-pointer"
          >
            {progress >= 100 ? 'Enter ↵' : 'Skip ↵'}
          </button>
        )}

        <div>
          <span>STANDBY</span>
        </div>
      </footer>
    </div>
  );
}
