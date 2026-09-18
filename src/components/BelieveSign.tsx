import React from 'react';

export default function BelieveSign({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center w-full max-w-[320px] mx-auto group ${className}`}>
      {/* Font import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap');
        .font-marker {
          font-family: 'Patrick Hand SC', cursive;
          letter-spacing: 0.1em;
        }
      `}} />
      
      {/* The Paper */}
      <div 
        className="bg-[#fad346] w-full aspect-[5/3] relative shadow-[2px_3px_5px_rgba(0,0,0,0.15)] transform hover:-rotate-1 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center border border-[#e5c13b]"
      >
        
        {/* The Text */}
        <h2 
          className="font-marker text-5xl md:text-7xl opacity-90 select-none pb-2 pr-1"
          style={{ color: '#0d2859' }}
        >
          BELIEVE
        </h2>

        {/* Tape Top-Left */}
        <div className="absolute -top-2 -left-3 w-10 h-3.5 bg-[#1a1a1a] opacity-95 shadow-[1px_2px_3px_rgba(0,0,0,0.4)] transform -rotate-[40deg]"></div>
        
        {/* Tape Top-Right */}
        <div className="absolute -top-2 -right-3 w-10 h-3.5 bg-[#1a1a1a] opacity-95 shadow-[1px_2px_3px_rgba(0,0,0,0.4)] transform rotate-[35deg]"></div>
        
        {/* Tape Bottom-Left */}
        <div className="absolute -bottom-2 -left-3 w-10 h-3.5 bg-[#1a1a1a] opacity-95 shadow-[1px_2px_3px_rgba(0,0,0,0.4)] transform rotate-[45deg]"></div>
        
        {/* Tape Bottom-Right */}
        <div className="absolute -bottom-2 -right-3 w-10 h-3.5 bg-[#1a1a1a] opacity-95 shadow-[1px_2px_3px_rgba(0,0,0,0.4)] transform -rotate-[42deg]"></div>
        
        {/* Paper texture overlay (subtle) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/crumpled-paper.png')]"></div>
      </div>
    </div>
  );
}
