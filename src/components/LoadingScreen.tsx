'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING...');

  useEffect(() => {
    const duration = 2000; // total 2 seconds loading
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress < 20) setStatus('INITIALIZING...');
      else if (currentProgress < 40) setStatus('LOADING ARCHIVE...');
      else if (currentProgress < 60) setStatus('PREPARING STORIES...');
      else if (currentProgress < 80) setStatus('LOADING METADATA...');
      else if (currentProgress < 95) setStatus('SETTING THE MARGINS...');
      else if (currentProgress < 100) setStatus('OPENING THE EDITION...');
      else setStatus('READY.');

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(now).toUpperCase();

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-accent text-content-surface p-6 overflow-hidden relative">
      
      {/* Hardcover inset border */}
      <div className="absolute inset-4 lg:inset-6 border-[1px] border-paper/30 rounded-sm pointer-events-none flex flex-col justify-between p-4">
        <div className="flex justify-between w-full opacity-70">
           <span className="text-[8px] font-sans text-paper tracking-widest uppercase">REG.08</span>
           <span className="text-[8px] font-sans text-paper tracking-widest uppercase">CHANDIGARH</span>
        </div>
        <div className="flex justify-between w-full opacity-70">
           <span className="text-[8px] font-sans text-paper tracking-widest uppercase">INNER MARGINS</span>
           <span className="text-[8px] font-sans text-paper tracking-widest uppercase">VOL III</span>
        </div>
      </div>

      <div className="w-full max-w-lg flex flex-col items-center text-center animate-fade-in opacity-0 relative z-10" style={{ animationFillMode: 'forwards' }}>
        
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display tracking-tight uppercase leading-[0.85] mb-6 text-content-surface">
            Inner Margins
          </h1>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper">
            A Personal Archive
          </p>
        </div>

        <div className="w-full border-t border-b border-paper/30 py-6 mb-12 flex flex-col items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-paper">
          <p suppressHydrationWarning>{dateStr}</p>
          <p>VOL. III · EDITION 08</p>
          <p className="text-surface">CHANDIGARH / INDIA</p>
        </div>

        <div className="w-full max-w-sm flex flex-col items-center">
          <p className="font-sans text-[10px] uppercase tracking-widest text-paper mb-4" suppressHydrationWarning>
            {status}
          </p>
          
          <div className="w-full h-[2px] bg-paper/20 mb-4 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-surface animate-[loadingBar_2s_linear_forwards]"
            ></div>
          </div>
          
          <p className="font-sans text-[10px] uppercase tracking-widest text-surface" suppressHydrationWarning>
            {progress}%
          </p>
        </div>
        
      </div>
    </div>
  );
}

