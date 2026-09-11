'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [timeStr, setTimeStr] = useState("05/28/26 14:02:11");
  const [randomMsg, setRandomMsg] = useState("CHECKING EMOTIONAL SECTORS...");
  const [cpuText, setCpuText] = useState("UNKNOWN EMOTIONAL PROCESSOR");
  const [memText, setMemText] = useState("DEGRADED BUT FUNCTIONING");

  useEffect(() => {
    // Current date and time
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleString('en-US', { hour12: false, year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    const SYS_MESSAGES = [
      "CHECKING EMOTIONAL SECTORS...",
      "DEFRAGMENTING GHOSTS...",
      "CALIBRATING NOSTALGIA LEVELS...",
      "BYPASSING RATIONAL THOUGHT...",
      "MOUNTING MEMORY DRIVES...",
      "RECOVERING FRAGMENTED DREAMS..."
    ];
    setRandomMsg(SYS_MESSAGES[Math.floor(Math.random() * SYS_MESSAGES.length)]);

    const CPUS = [
      "UNKNOWN EMOTIONAL PROCESSOR",
      "NEURAL PATHWAY ENGINE v2.5",
      "NOSTALGIA CO-PROCESSOR ACTIVE",
      "FRAGMENTED LOGIC UNIT"
    ];
    setCpuText(CPUS[Math.floor(Math.random() * CPUS.length)]);

    const MEMS = [
      "DEGRADED BUT FUNCTIONING",
      "78% SECTORS CORRUPTED",
      "ARCHIVE CAPACITY: LIMITED",
      "MEMORY BANKS STABLE"
    ];
    setMemText(MEMS[Math.floor(Math.random() * MEMS.length)]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center font-mono p-6 relative overflow-hidden bg-retro-text text-retro-surface">
      {/* Noise and Scanlines directly in loading to ensure it appears */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay noise-bg"></div>
      <div className="pointer-events-none absolute inset-0 z-10 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]"></div>
      {/* Ambient Flicker */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-retro-bg/5 animate-flicker mix-blend-color-dodge"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fillSegments {
          0% { width: 0%; }
          10% { width: 15%; }
          25% { width: 15%; } /* pause */
          35% { width: 40%; }
          50% { width: 45%; }
          60% { width: 45%; } /* pause */
          75% { width: 80%; }
          90% { width: 85%; }
          100% { width: 100%; }
        }
        .animate-segments {
          animation: fillSegments 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor {
          animation: blinkCursor 0.8s step-end infinite;
        }
        @keyframes loadingSteps {
          0%, 15% { content: "INITIALIZING EMOTIONAL ARCHIVE..."; }
          15.1%, 35% { content: "RECOVERING MEMORY FRAGMENTS..."; }
          35.1%, 55% { content: "RESTORING LAST SESSION..."; }
          55.1%, 75% { content: "LOADING INNER DIALOGUE..."; }
          75.1%, 95% { content: "SYNCHRONIZING THOUGHTS..."; }
          95.1%, 100% { content: "ARCHIVE READY."; }
        }
        .loading-step::after {
          content: "INITIALIZING EMOTIONAL ARCHIVE...";
          animation: loadingSteps 2.5s ease-out forwards;
        }
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 0; }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.8; }
        }
        .animate-flicker {
          animation: flicker 4s infinite;
        }
        @keyframes glitchDrop {
          0% { transform: translateY(0); }
          5% { transform: translateY(2px); opacity: 0.5; }
          10% { transform: translateY(-1px); opacity: 1; }
          15% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
        .glitch-container {
          animation: glitchDrop 5s infinite 2s;
        }
        .segmented-fill {
           background-image: repeating-linear-gradient(90deg, var(--retro-surface), var(--retro-surface) 10px, transparent 10px, transparent 14px);
        }
      `}} />

      <div className="w-full max-w-lg space-y-6 text-left flex flex-col glitch-container relative z-30">
        
        {/* Boot text */}
        <div className="font-mono text-xs text-retro-surface/60 mb-8 space-y-1">
          <p>IM_OS v2.5.0</p>
          <p suppressHydrationWarning>BIOS DATE: {timeStr} VER 2.5</p>
          <p suppressHydrationWarning>CPU: {cpuText}</p>
          <p suppressHydrationWarning>MEMORY: {memText}</p>
          <p className="pt-2 text-retro-surface/40 whitespace-nowrap" suppressHydrationWarning>&gt; {randomMsg}</p>
        </div>

        <div className="font-heading text-2xl sm:text-3xl text-retro-surface uppercase tracking-widest relative">
          SYSTEM_BOOT<span className="animate-cursor ml-1">█</span>
        </div>
        
        {/* Segmented Retro Progress Bar */}
        <div className="w-full h-8 border-2 border-retro-surface/40 p-1 bg-retro-text shadow-[0_0_15px_rgba(247,218,214,0.1)]">
          <div className="h-full segmented-fill animate-segments w-0" />
        </div>
        
        {/* Loading status texts */}
        <div className="font-mono text-[10px] sm:text-xs text-retro-surface/80 uppercase tracking-widest">
          <span className="opacity-50 mr-2">[LOG]</span><span className="loading-step"></span>
        </div>

      </div>
    </div>
  );
}
