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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isDismissing = useRef(false);
  const [timeStr, setTimeStr] = useState('00:00:00.00');
  const [progress, setProgress] = useState(0);
  const [activeMessage, setActiveMessage] = useState('CALIBRATING RETROSPECTIVE FREQUENCIES...');

  // Smooth curtain slide exit
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
      duration: 0.85,
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

  // Precision real-time clock with milliseconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTimeStr(`${time}.${ms}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 73);
    return () => clearInterval(interval);
  }, []);

  // Cycling poetic archival log lines
  useEffect(() => {
    const MESSAGES = [
      'CALIBRATING RETROSPECTIVE FREQUENCIES...',
      'DEFRAGMENTING EMOTIONAL ARCHIVES...',
      'RETRIEVING UNPUBLISHED MARGINALIA...',
      'ALIGNING ESSAYS & EPHEMERAL THOUGHTS...',
      'SYNCHRONIZING MEMORY SECTORS...',
      'ALL ARTIFACTS VERIFIED // ARCHIVE READY.',
    ];
    let idx = 0;
    const msgInterval = setInterval(() => {
      idx = (idx + 1) % MESSAGES.length;
      setActiveMessage(MESSAGES[idx]);
    }, 1500);
    return () => clearInterval(msgInterval);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Clean typographic entrance
      tl.from('.type-meta', {
        y: -12,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
      })
        .from(
          '.type-kicker',
          {
            opacity: 0,
            y: 10,
            duration: 0.45,
          },
          '-=0.25'
        )
        .from(
          '.type-heading-line',
          {
            y: 35,
            opacity: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        .from(
          '.type-subtext',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.type-counter-block',
          {
            scale: 0.95,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.25'
        )
        .from(
          '.type-footer',
          {
            y: 12,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          '-=0.3'
        );

      // Percentage counter & progress bar animation (2.2s duration)
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const current = Math.round(counter.val);
          setProgress(current);
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${current / 100})`;
          }
        },
        onComplete: () => {
          setProgress(100);
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = 'scaleX(1)';
          }
          if (isPreloader) {
            setTimeout(() => {
              handleDismiss();
            }, 600);
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
      aria-label="Loading archival memory"
      className={`fixed inset-0 min-h-[100dvh] w-screen z-[9999] flex flex-col justify-between p-6 sm:p-10 md:p-16 lg:p-20 bg-retro-bg text-retro-text select-none overflow-hidden font-body ${className}`}
    >
      {/* Background Ambience: Subtle Noise & Fine Millimeter Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-12 mix-blend-overlay noise-bg" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(201,65,60,0.5)_50%)] bg-[length:100%_4px]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(201,65,60,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,65,60,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* TOP MARGIN: Archival Telemetry */}
      <header className="type-meta relative z-10 flex items-start justify-between border-b border-retro-border/20 pb-5">
        <div className="space-y-1">
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-retro-text font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-retro-primary animate-pulse" />
            <span>Archival Transmission</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-retro-text/50">
            Vol. IV &bull; Sector 0x4B
          </div>
        </div>

        <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-retro-text/40 pt-1">
          [ Ephemeral Thoughts &bull; Memory Recovery ]
        </div>

        <div className="text-right font-mono space-y-1">
          <div
            className="text-[11px] sm:text-xs uppercase tracking-widest text-retro-text font-bold tabular-nums"
            suppressHydrationWarning
          >
            {timeStr}
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-retro-text/50">
            Universal Telemetry
          </div>
        </div>
      </header>

      {/* CENTERPIECE: Typography-Heavy Monumental Layout */}
      <main className="relative z-10 my-auto py-8 sm:py-12 flex flex-col items-center justify-center text-center">
        {/* Kicker */}
        <div className="type-kicker mb-4 sm:mb-6">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-retro-primary/80 font-medium border-b border-retro-border/30 pb-1">
            Cataloguing The Unwritten
          </span>
        </div>

        {/* Monumental Editorial Headline in Instrument Serif */}
        <div className="space-y-0 sm:space-y-1 max-w-4xl mx-auto">
          <h2 className="type-heading-line font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-retro-text font-normal leading-[1.05]">
            &ldquo;Every thought left
          </h2>
          <h2 className="type-heading-line font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-retro-text font-normal leading-[1.05]">
            between the margins,&rdquo;
          </h2>
        </div>

        {/* Poetic Monospace Subtext */}
        <p className="type-subtext mt-4 sm:mt-6 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-retro-text/60 max-w-lg mx-auto leading-relaxed">
          awaiting the quiet act of remembering
        </p>

        {/* Minimalist Typographic Counter & Hairline Gauge */}
        <div className="type-counter-block mt-8 sm:mt-12 w-full max-w-lg mx-auto flex flex-col items-center gap-4">
          {/* Giant Number Readout */}
          <div className="flex items-baseline gap-2 font-serif italic text-6xl sm:text-8xl md:text-9xl text-retro-text font-normal tabular-nums tracking-tighter leading-none">
            <span>{String(progress).padStart(3, '0')}</span>
            <span className="font-mono text-xl sm:text-2xl not-italic text-retro-primary/70 tracking-normal font-normal">
              %
            </span>
          </div>

          {/* Ultra-Clean Hairline Progress Rule */}
          <div className="w-full relative h-[2px] bg-retro-border/20 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-retro-primary origin-left transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(201,65,60,0.4)]"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          {/* Cycling Poetic Log */}
          <div className="pt-2 flex items-center justify-center gap-2 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-retro-text/75 text-center">
            <span className="text-retro-primary font-bold">&gt;</span>
            <span className="truncate">{activeMessage}</span>
            <span className="inline-block w-1.5 h-3 bg-retro-primary animate-pulse flex-shrink-0" />
          </div>
        </div>
      </main>

      {/* BOTTOM MARGIN: Archival Ledger & Subtle Skip Action */}
      <footer className="type-footer relative z-10 flex items-center justify-between border-t border-retro-border/20 pt-5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-retro-text/60">
        <div>
          <span>LAT. 37.7749&deg; N // LON. 122.4194&deg; W</span>
        </div>

        {isPreloader && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-1.5 border border-retro-border/30 hover:border-retro-primary bg-retro-surface/40 hover:bg-retro-primary hover:text-white transition-all text-[9px] uppercase tracking-[0.25em] text-retro-text cursor-pointer"
            >
              {progress >= 100 ? 'Enter Archive ↵' : 'Skip ↵'}
            </button>
            <span className="hidden sm:inline text-[8px] text-retro-text/40 lowercase tracking-normal">
              (esc)
            </span>
          </div>
        )}

        <div className="text-right">
          <span>Archive Protocol &bull; 2026</span>
        </div>
      </footer>
    </div>
  );
}
