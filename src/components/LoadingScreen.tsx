'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
  isPreloader?: boolean;
  className?: string;
}

interface FloatingScore {
  id: number;
  text: string;
}

export default function LoadingScreen({
  onComplete,
  isPreloader = false,
  className = '',
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDismissing = useRef(false);
  const progressRef = useRef(0);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(1250);
  const [combo, setCombo] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [floaters, setFloaters] = useState<FloatingScore[]>([]);
  const [activeMessage, setActiveMessage] = useState('STAGE 01: SECTOR MEMORY');

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

  // Gamified "Boost" action (Space, Enter, Tap/Click)
  const handleBoost = useCallback(() => {
    if (isDismissing.current) return;

    if (progressRef.current >= 100) {
      handleDismiss();
      return;
    }

    // Trigger runner jump
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 180);

    // Increment combo
    setCombo((prev) => {
      const nextCombo = prev + 1;
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setCombo(0), 1000);
      return nextCombo;
    });

    // Score increment
    const pts = 100 + Math.min(combo * 50, 400);
    setScore((s) => s + pts);

    // Spawn floating score badge
    const newFloater: FloatingScore = {
      id: Date.now() + Math.random(),
      text: combo > 1 ? `+${pts} COMBO x${combo + 1}!` : `+${pts} BOOST!`,
    };
    setFloaters((prev) => [...prev.slice(-3), newFloater]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== newFloater.id));
    }, 700);

    // Boost progress by 4% to 6%
    const boostAmount = Math.floor(Math.random() * 3) + 4;
    const nextProgress = Math.min(100, progressRef.current + boostAmount);
    progressRef.current = nextProgress;
    setProgress(nextProgress);

    if (nextProgress >= 100) {
      setTimeout(() => {
        handleDismiss();
      }, 500);
    }
  }, [combo, handleDismiss]);

  // Keyboard controls: Space/Enter boosts, Escape dismisses
  useEffect(() => {
    if (!isPreloader) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleBoost();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, [isPreloader, handleDismiss, handleBoost]);

  // Autonomous background counter ticking to 100 over ~1.8s
  useEffect(() => {
    const timer = setInterval(() => {
      if (progressRef.current < 100) {
        const next = Math.min(100, progressRef.current + 2);
        progressRef.current = next;
        setProgress(next);
        setScore((s) => s + 10);
      } else {
        clearInterval(timer);
        if (isPreloader) {
          setTimeout(() => {
            handleDismiss();
          }, 450);
        }
      }
    }, 38);

    return () => clearInterval(timer);
  }, [isPreloader, handleDismiss]);

  // Cycling retro arcade log status
  useEffect(() => {
    const MESSAGES = [
      'STAGE 01: SECTOR MEMORY',
      'CALIBRATING NOSTALGIA BOOST',
      'INDEXING RETRO LOGS',
      'BUFFERING PIXEL BITSTREAM',
      'STAGE CLEAR: ALL SYSTEMS GO',
    ];
    let idx = 0;
    const msgInterval = setInterval(() => {
      idx = (idx + 1) % MESSAGES.length;
      setActiveMessage(MESSAGES[idx]);
    }, 1100);
    return () => clearInterval(msgInterval);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.arcade-hud', {
        opacity: 0,
        y: -10,
        duration: 0.5,
        stagger: 0.1,
      }).from(
        '.arcade-center',
        {
          scale: 0.94,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.4)',
        },
        '-=0.3'
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Arcade Loading"
      onClick={handleBoost}
      className={`fixed inset-0 min-h-[100dvh] w-screen z-[9999] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 bg-retro-bg text-retro-text select-none overflow-hidden font-body cursor-pointer ${className}`}
    >
      {/* Background Ambience: Subtle Noise & Retro Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 mix-blend-overlay noise-bg" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(201,65,60,0.5)_50%)] bg-[length:100%_4px]" />

      {/* TOP RAIL: Retro Arcade HUD */}
      <header className="arcade-hud relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-retro-text">
        {/* 1UP & Score */}
        <div className="flex items-center gap-3">
          <span className="font-heading text-[10px] text-retro-primary animate-pulse">1UP</span>
          <span className="font-bold tabular-nums text-retro-text tracking-widest">
            {String(score).padStart(6, '0')}
          </span>
          {combo > 1 && (
            <span className="bg-retro-primary text-white text-[9px] px-1.5 py-0.5 font-bold shadow-retro-sm animate-bounce">
              x{combo} COMBO!
            </span>
          )}
        </div>

        {/* High Score */}
        <div className="hidden sm:flex items-center gap-2 text-retro-text/60">
          <span className="font-heading text-[9px]">HI-SCORE</span>
          <span className="tabular-nums font-bold tracking-widest text-retro-text">099990</span>
        </div>

        {/* Insert Coin / Free Play */}
        <div className="flex items-center gap-2 text-retro-text/70">
          <span className="w-1.5 h-1.5 bg-retro-primary animate-ping" />
          <span className="font-heading text-[9px] text-retro-primary">
            {progress >= 100 ? 'READY!' : 'INSERT COIN'}
          </span>
        </div>
      </header>

      {/* CENTERPIECE: The Gigantic Loading Number + Pixel Runner Track */}
      <main className="arcade-center relative z-10 my-auto flex flex-col items-center justify-center text-center">
        {/* Floating Gamified Score Badges */}
        <div className="relative h-6 w-full flex items-center justify-center pointer-events-none">
          {floaters.map((f) => (
            <span
              key={f.id}
              className="absolute font-mono font-bold text-[11px] sm:text-xs text-retro-primary tracking-widest bg-retro-surface/90 px-2 py-0.5 border border-retro-primary/40 shadow-retro-sm transition-all animate-[floatUp_0.7s_ease-out_forwards]"
            >
              {f.text}
            </span>
          ))}
        </div>

        {/* GIGANTIC NUMBER */}
        <div className="relative flex items-baseline justify-center">
          <span className="font-mono font-bold text-[min(30vw,38vh)] leading-none tracking-tighter text-retro-text tabular-nums">
            {String(progress).padStart(2, '0')}
          </span>
          <span className="font-mono text-[min(7vw,9vh)] font-normal text-retro-primary/60 -ml-1 sm:-ml-3 tracking-normal">
            %
          </span>
        </div>

        {/* Gamified 8-Bit Pixel Runner Track */}
        <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-2">
          {/* Track Baseline with Moving Runner */}
          <div className="relative w-full h-6 border-b-2 border-dashed border-retro-border/40">
            {/* 8-Bit Pixel Runner Sprite */}
            <div
              className={`absolute bottom-0 text-retro-primary transition-all duration-100 ease-linear ${
                isJumping ? '-translate-y-3' : 'translate-y-0'
              }`}
              style={{ left: `calc(${progress}% - 8px)` }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="5" y="1" width="6" height="5" />
                <rect x="4" y="6" width="8" height="4" />
                <rect x="3" y="7" width="2" height="3" />
                <rect x="11" y="7" width="2" height="3" />
                <rect x="5" y="10" width="2" height="4" />
                <rect x="9" y="10" width="2" height="4" />
              </svg>
            </div>

            {/* Finish Line Flag */}
            <div className="absolute right-0 bottom-0 text-retro-text/60">
              <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
                <rect x="1" y="1" width="2" height="15" />
                <polygon points="3,2 11,5 3,8" />
              </svg>
            </div>
          </div>

          {/* Prompt: Tap or Press Space to Boost */}
          <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-retro-text/75 pt-1">
            <span className="text-retro-primary font-bold animate-pulse">
              {progress >= 100 ? '★ STAGE CLEAR ★' : 'TAP SCREEN OR SPACE TO BOOST'}
            </span>
            <span className="tabular-nums font-bold">[{String(progress).padStart(3, '0')}/100]</span>
          </div>

          {/* Mini Arcade Log */}
          <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-retro-text/50 truncate">
            &gt; {activeMessage}
          </div>
        </div>
      </main>

      {/* BOTTOM RAIL: Credits & Press Start Action */}
      <footer className="arcade-hud relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-retro-text/60">
        <div>
          <span>CREDITS: 02</span>
        </div>

        {isPreloader && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="px-4 py-1.5 border-2 border-retro-border bg-retro-surface hover:bg-retro-primary hover:text-white active:translate-y-0.5 transition-all text-[9px] font-heading uppercase tracking-widest text-retro-text shadow-retro-sm cursor-pointer"
          >
            {progress >= 100 ? 'PRESS START ↵' : 'SKIP ↵'}
          </button>
        )}

        <div>
          <span>WORLD 1-1</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-24px); }
        }
      `}} />
    </div>
  );
}
