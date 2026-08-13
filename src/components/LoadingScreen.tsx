'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 600);
    const timer2 = setTimeout(() => setStage(2), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-paper text-ink p-6 overflow-hidden relative">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8 relative z-10">
        <h1 className={`font-display text-2xl md:text-3xl tracking-tight transition-all duration-1000 ${stage >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Inner Margins
        </h1>
        
        <div className={`w-[1px] h-16 bg-ink/20 mx-auto transition-all duration-1000 ${stage >= 1 ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 origin-top'}`}></div>
        
        <p className={`font-mono text-[10px] uppercase tracking-widest text-muted transition-opacity duration-1000 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          Opening Archive...
        </p>
      </div>
    </div>
  );
}
