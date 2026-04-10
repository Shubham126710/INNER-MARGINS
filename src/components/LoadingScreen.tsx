'use client';

import { useState, useEffect } from 'react';

const QUOTES = [
  "\"THE UNEXAMINED LIFE IS NOT WORTH LIVING.\"",
  "\"EVERYTHING WE HEAR IS AN OPINION, NOT A FACT.\"",
  "\"LIFE MUST BE UNDERSTOOD BACKWARD; BUT IT MUST BE LIVED FORWARD.\"",
  "\"YOUR FOCUS DETERMINES YOUR REALITY.\"",
  "\"WHAT WE THINK, WE BECOME.\"",
  "\"STAY AWHILE AND LISTEN.\"",
  "\"IT'S DANGEROUS TO GO ALONE! TAKE THIS.\"",
  "\"BE WATER, MY FRIEND.\"",
];

const LOADING_STEPS = [
  "INITIALIZING SYSTEM ARCHITECTURE...",
  "ALLOCATING MEMORY BLOCKS...",
  "ESTABLISHING SECURE CONNECTION...",
  "LOADING CORE ASSETS...",
  "MOUNTING VIRTUAL DRIVES...",
  "DECRYPTING ARCHIVES...",
  "SYNCHRONIZING TIMESTAMPS...",
  "RUNNING DIAGNOSTICS...",
  "SYSTEM FULLY OPERATIONAL."
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Pick a random quote on mount
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));

    const totalDuration = 1500;
    const intervalTime = 30;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + increment;
        
        if (nextProgress >= 100) {
          clearInterval(timer);
          setStepIndex(LOADING_STEPS.length - 1);
          return 100;
        }
        
        const currentStep = Math.min(
          Math.floor((nextProgress / 100) * LOADING_STEPS.length),
          LOADING_STEPS.length - 1
        );
        setStepIndex(currentStep);
        
        return nextProgress;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center font-mono p-4">
      <div className="w-full max-w-sm space-y-8 text-center flex flex-col items-center">
        
        <div className="font-heading text-4xl sm:text-5xl text-retro-surface uppercase tracking-widest relative">
          LOADING_
        </div>
        
        {/* Retro Progress Bar Container */}
        <div className="w-full h-6 border-4 border-retro-surface p-1 shadow-retro-sm">
          <div 
            className="h-full bg-retro-surface transition-all duration-[30ms] ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Loading status texts */}
        <div className="font-mono text-xs sm:text-sm text-retro-surface/80 min-h-[40px] space-y-1">
          <p>{LOADING_STEPS[stepIndex]}</p>
          <p className="text-[10px] text-retro-surface/60">
            {Math.round(progress)}% COMPLETE
          </p>
        </div>

        {/* Random Quote */}
        <div className="mt-8 pt-6 w-full border-t-2 border-dashed border-retro-surface/30">
          <p className="font-body text-retro-surface/90 italic text-sm md:text-base leading-relaxed mb-3 px-4">
            {QUOTES[quoteIndex]}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-retro-surface/50">
             - SYSTEM MEMORY
          </p>
        </div>

      </div>
    </div>
  );
}
