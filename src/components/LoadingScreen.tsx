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
  const [score, setScore] = useState(1400);
  const [combo, setCombo] = useState(0);
  const [floaters, setFloaters] = useState<FloatingScore[]>([]);
  const [activeMessage, setActiveMessage] = useState('CALIBRATING NOSTALGIA BOOST');

  // Smooth upward curtain exit
  const handleDismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;

    if (!containerRef.current) {
      onComplete?.();
      return;
    }

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.75,
      ease: 'power4.inOut',
      onComplete: () => {
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

    // Increment combo
    setCombo((prev) => {
      const nextCombo = prev + 1;
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setCombo(0), 1000);
      return nextCombo;
    });

    // Score increment
    const pts = 100 + Math.min(combo * 50, 500);
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
    }, 36);

    return () => clearInterval(timer);
  }, [isPreloader, handleDismiss]);

  // Cycling retro arcade log status
  useEffect(() => {
    const MESSAGES = [
      'CALIBRATING NOSTALGIA BOOST',
      'RECOVERING MEMORY SECTORS',
      'INDEXING EPHEMERAL LOGS',
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
          ease: 'power3.out',
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
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className={`fixed inset-0 min-h-[100dvh] w-full z-[9999] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 bg-retro-bg text-retro-text select-none overflow-hidden touch-none overscroll-contain font-body cursor-pointer ${className}`}
    >
      {/* Background Ambience: Subtle Noise */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 mix-blend-overlay noise-bg" />

      {/* TOP RAIL: Retro Arcade HUD */}
      <header className="arcade-hud relative z-10 flex items-center justify-between font-body text-xs text-retro-text">
        {/* 1UP & Score */}
        <div className="flex items-center gap-3">
          <span className="font-heading text-xs text-retro-primary animate-pulse motion-reduce:animate-none">1UP</span>
          <span className="font-mono font-bold tabular-nums text-retro-text text-xs">
            {String(score).padStart(6, '0')}
          </span>
          {combo > 1 && (
            <span className="bg-retro-primary text-[var(--retro-light)] text-xs px-1.5 py-0.5 font-bold shadow-retro-sm">
              x{combo} Combo
            </span>
          )}
        </div>

        {/* High Score */}
        <div className="hidden sm:flex items-center gap-2 text-retro-text/70">
          <span className="font-heading text-xs">High score</span>
          <span className="tabular-nums font-mono font-bold text-retro-text text-xs">099990</span>
        </div>

        {/* Insert Coin / Free Play */}
        <div className="flex items-center gap-2 text-retro-text/80">
          <span className="w-1.5 h-1.5 bg-retro-primary animate-ping motion-reduce:animate-none" />
          <span className="font-heading text-xs text-retro-primary">
            {progress >= 100 ? 'Ready' : 'Insert coin'}
          </span>
        </div>
      </header>

      {/* CENTERPIECE: Scaled Up Gigantic Loading Number + Retro Gamified Loading Bar */}
      <main className="arcade-center relative z-10 my-auto flex flex-col items-center justify-center text-center">
        {/* Floating Gamified Score Badges */}
        <div className="relative h-7 w-full flex items-center justify-center pointer-events-none mb-1">
          {floaters.map((f) => (
            <span
              key={f.id}
              className="absolute font-mono font-bold text-xs text-retro-primary bg-retro-surface/90 px-2.5 py-0.5 border border-retro-primary/40 shadow-retro-sm animate-[floatUp_0.7s_ease-out_forwards]"
            >
              {f.text}
            </span>
          ))}
        </div>

        {/* SCALED-UP GIGANTIC NUMBER */}
        <div className="relative flex items-baseline justify-center">
          <span className="font-mono font-bold text-[min(45vw,52vh)] leading-none tracking-tighter text-retro-text tabular-nums select-none">
            {String(progress).padStart(2, '0')}
          </span>
          <span className="font-mono text-[min(10vw,12vh)] font-normal text-retro-primary/60 -ml-1 sm:-ml-3 tracking-normal select-none">
            %
          </span>
        </div>

        {/* SIMPLE GAMIFIED RETRO LOADING BAR */}
        <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-2.5">
          {/* Retro Segmented Bar Container */}
          <div className="w-full h-5 sm:h-6 border-2 border-retro-border bg-retro-surface/70 p-0.5 shadow-retro-sm relative overflow-hidden">
            {/* Active Progress Fill */}
            <div
              className="h-full bg-retro-primary duration-75 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Segmented notches overlay */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,var(--retro-surface)_6px,var(--retro-surface)_8px)] opacity-50" />
            </div>
          </div>

          {/* Interactive Arcade Prompt & Progress Fraction */}
          <div className="flex items-center justify-between font-body text-xs text-retro-text/80 pt-0.5">
            <span className="text-retro-primary font-medium animate-pulse motion-reduce:animate-none">
              {progress >= 100 ? 'Stage clear' : 'Tap screen or space to boost'}
            </span>
            <span className="font-mono tabular-nums font-bold">[{String(progress).padStart(3, '0')}/100]</span>
          </div>

          {/* Mini Arcade Log */}
          <div className="font-mono text-xs text-retro-text/60 truncate">
            &gt; {activeMessage}
          </div>
        </div>
      </main>

      {/* BOTTOM RAIL: Credits & Press Start Action */}
      <footer className="arcade-hud relative z-10 flex items-center justify-between font-body text-xs text-retro-text/70">
        <div>
          <span>Credits: 02</span>
        </div>

        {isPreloader && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="px-4 py-1.5 border-2 border-retro-border bg-retro-surface hover:bg-retro-primary hover:text-retro-surface active:translate-y-px transition-colors duration-150 text-xs font-body text-retro-text shadow-retro-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-retro-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {progress >= 100 ? 'Press Start ↵' : 'Skip ↵'}
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
