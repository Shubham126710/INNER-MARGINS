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

  // Smooth shutter exit
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
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete?.();
      },
    });
  }, [onComplete]);

  // Lock body scroll and listen for skip keys if in preloader mode
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
      'SYNCHRONIZING RETRO MEMORY BANKS...',
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

      // Frame & Editorial entrance
      tl.from('.loader-frame', {
        scale: 0.985,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          '.loader-meta',
          {
            y: -10,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          '-=0.3'
        )
        .from(
          '.loader-badge',
          {
            scale: 0.92,
            opacity: 0,
            duration: 0.35,
          },
          '-=0.2'
        )
        .from(
          '.loader-title-line',
          {
            y: 35,
            opacity: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'expo.out',
          },
          '-=0.2'
        )
        .from(
          '.loader-desc',
          {
            y: 15,
            opacity: 0,
            duration: 0.45,
          },
          '-=0.3'
        )
        .from(
          '.loader-progress-box',
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
          },
          '-=0.25'
        )
        .from(
          '.loader-footer-meta',
          {
            y: 10,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          '-=0.3'
        );

      // Percentage counter & progress bar animation (2.4s duration)
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 2.4,
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
            // Give user 650ms to appreciate completion before lifting curtain
            setTimeout(() => {
              handleDismiss();
            }, 650);
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
      className={`fixed inset-0 min-h-[100dvh] w-screen z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 bg-retro-bg text-retro-text select-none overflow-hidden font-body ${className}`}
    >
      {/* Background Ambience: Noise & Hairline Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-15 mix-blend-overlay noise-bg" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] bg-[linear-gradient(transparent_50%,rgba(201,65,60,0.5)_50%)] bg-[length:100%_4px]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(201,65,60,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,65,60,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(201,65,60,0.05)_0%,transparent_75%)]" />

      {/* Editorial Frame */}
      <div className="loader-frame relative z-10 w-full max-w-5xl h-full max-h-[92dvh] flex flex-col justify-between border border-retro-border/40 bg-retro-surface/40 backdrop-blur-[2px] p-5 sm:p-8 md:p-12 shadow-retro-lg overflow-hidden">
        {/* Corner Precision Hairline Markers */}
        <div className="absolute top-2 left-2.5 font-mono text-[9px] uppercase tracking-widest text-retro-text/40 select-none">
          ┌ [SEC:01]
        </div>
        <div className="absolute top-2 right-2.5 font-mono text-[9px] uppercase tracking-widest text-retro-text/40 select-none">
          [SYS:LIVE] ┐
        </div>
        <div className="absolute bottom-2 left-2.5 font-mono text-[9px] uppercase tracking-widest text-retro-text/40 select-none">
          └ [REF:2026]
        </div>
        <div className="absolute bottom-2 right-2.5 font-mono text-[9px] uppercase tracking-widest text-retro-text/40 select-none">
          [ARCHIVE] ┘
        </div>

        {/* TOP RAIL: Archival Micro-Typography */}
        <header className="loader-meta flex items-center justify-between border-b border-retro-border/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-retro-primary animate-pulse" />
            <div className="space-y-0.5">
              <span className="font-heading text-[10px] sm:text-xs uppercase tracking-wider text-retro-text block">
                Inner Margins
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-retro-text/60 block">
                Archival Protocol // Vol. IV
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-widest text-retro-text/70 border border-retro-border/30 px-3 py-1 bg-retro-surface/70 shadow-retro-sm">
            <span>Transmission In Flight</span>
          </div>

          <div className="text-right font-mono space-y-0.5">
            <div
              className="text-[10px] sm:text-xs uppercase tracking-widest text-retro-text font-bold tabular-nums"
              suppressHydrationWarning
            >
              {timeStr}
            </div>
            <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-retro-text/50">
              Local Telemetry
            </div>
          </div>
        </header>

        {/* CENTERPIECE: Massive Typography Lockup */}
        <main className="my-auto py-6 sm:py-10 text-center flex flex-col items-center justify-center">
          {/* Badge */}
          <div className="loader-badge mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 border border-retro-border/50 bg-retro-surface/90 px-3 py-1 shadow-retro-sm">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-retro-primary font-semibold">
                [ EDITION 2026.4 • EPHEMERAL ESSAYS &amp; MARGINALIA ]
              </span>
            </div>
          </div>

          {/* Grand Typographic Title */}
          <div className="space-y-1 sm:space-y-3 tracking-tighter">
            <h1 className="loader-title-line font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-retro-text uppercase leading-none drop-shadow-sm">
              INNER
            </h1>
            <h1 className="loader-title-line font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-retro-text uppercase leading-none drop-shadow-sm">
              MARGINS
            </h1>
          </div>

          {/* Subtitle & Poetic Marginalia */}
          <div className="loader-desc mt-6 sm:mt-8 max-w-xl mx-auto space-y-2">
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-retro-primary font-medium">
              An Archival Space For Fleeting Thoughts &amp; Unspoken Prose
            </p>
            <p className="font-mono text-[9px] sm:text-[11px] text-retro-text/60 italic leading-relaxed max-w-md mx-auto">
              &ldquo;Everything written between the lines remains catalogued; nothing is discarded.&rdquo;
            </p>
          </div>

          {/* Oversized Progress Readout & Architectural Gauge */}
          <div className="loader-progress-box mt-8 sm:mt-12 w-full max-w-md sm:max-w-lg mx-auto space-y-3">
            <div className="flex items-end justify-between font-mono">
              <div className="text-left space-y-0.5">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-retro-text/50 block">
                  Stream Buffer
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-retro-text font-bold">
                  Sector 0x4B // Sync
                </span>
              </div>
              <div className="flex items-baseline gap-1 font-heading text-3xl sm:text-5xl text-retro-text">
                <span className="tabular-nums">{String(progress).padStart(3, '0')}</span>
                <span className="text-base sm:text-xl text-retro-primary">%</span>
              </div>
            </div>

            {/* Architectural Hairline Progress Gauge */}
            <div className="relative w-full h-3 sm:h-3.5 border border-retro-border/50 bg-retro-surface/80 p-[2px] shadow-retro-sm overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-retro-primary origin-left transition-transform duration-75 ease-out"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>

            {/* Archival Tick Scales */}
            <div className="flex justify-between font-mono text-[8px] uppercase tracking-widest text-retro-text/40 pt-0.5">
              <span>[000]</span>
              <span className="hidden sm:inline">[025]</span>
              <span>[050]</span>
              <span className="hidden sm:inline">[075]</span>
              <span>[100]</span>
            </div>

            {/* Poetic Cycling Status Line */}
            <div className="pt-2 flex items-center justify-center gap-2 font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-retro-text/80 text-center">
              <span className="text-retro-primary font-bold">&gt;</span>
              <span className="truncate">{activeMessage}</span>
              <span className="inline-block w-1.5 h-3 bg-retro-primary animate-pulse flex-shrink-0" />
            </div>

            {/* Interactive Skip / Enter Controls */}
            {isPreloader && (
              <div className="pt-3 flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-4 py-1.5 border border-retro-border/60 bg-retro-surface/90 hover:bg-retro-primary hover:text-white active:translate-y-0.5 transition-all text-[9px] font-mono uppercase tracking-[0.2em] text-retro-text shadow-retro-sm cursor-pointer"
                >
                  {progress >= 100 ? 'ENTER ARCHIVE ↵' : 'SKIP INTRO ↵'}
                </button>
                <span className="text-[8px] font-mono uppercase tracking-widest text-retro-text/40">
                  (or press ESC / SPACE)
                </span>
              </div>
            )}
          </div>
        </main>

        {/* BOTTOM RAIL: Archival Ledger */}
        <footer className="loader-footer-meta flex items-center justify-between border-t border-retro-border/30 pt-4 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-retro-text/60">
          <div>
            <span>COORDINATES: 37.7749&deg; N // 122.4194&deg; W</span>
          </div>

          <div className="hidden lg:block text-retro-text/40 tracking-[0.2em]">
            + &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; ARCHIVE ENGINE &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; +
          </div>

          <div className="text-right">
            <span>INNER MARGINS &copy; 2026 // ALL RIGHTS RESERVED</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
