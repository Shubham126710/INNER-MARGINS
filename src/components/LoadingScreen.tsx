'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Very fast transition
    const timer = setTimeout(() => setStage(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-paper text-ink p-6 overflow-hidden relative">
      <div className="w-full max-w-md flex flex-col items-center text-center relative z-10">
        <h1 className={`font-display text-2xl md:text-3xl tracking-tight transition-opacity duration-300 ${stage >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          INNER MARGINS
        </h1>
        <div className={`w-16 h-[1px] bg-ink mt-6 transition-all duration-500 ease-out ${stage >= 1 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
      </div>
    </div>
  );
}
