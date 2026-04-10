export default function LoadingScreen() {
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

  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="w-full flex flex-col items-center justify-center font-mono p-4">
      <style dangerouslySetInnerHTML={{ __html: \`
        @keyframes fillBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fill {
          animation: fillBar 1.5s ease-out forwards;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor {
          animation: blinkCursor 1s step-end infinite;
        }
        @keyframes loadingSteps {
          0%, 11% { content: "INITIALIZING SYSTEM ARCHITECTURE..."; }
          11.1%, 22% { content: "ALLOCATING MEMORY BLOCKS..."; }
          22.1%, 33% { content: "ESTABLISHING SECURE CONNECTION..."; }
          33.1%, 44% { content: "LOADING CORE ASSETS..."; }
          44.1%, 55% { content: "MOUNTING VIRTUAL DRIVES..."; }
          55.1%, 66% { content: "DECRYPTING ARCHIVES..."; }
          66.1%, 77% { content: "SYNCHRONIZING TIMESTAMPS..."; }
          77.1%, 88% { content: "RUNNING DIAGNOSTICS..."; }
          88.1%, 100% { content: "SYSTEM FULLY OPERATIONAL."; }
        }
        .loading-step::after {
          content: "INITIALIZING SYSTEM ARCHITECTURE...";
          animation: loadingSteps 1.5s ease-out forwards;
        }
        @keyframes loadingPercentage {
          0%, 9% { content: "0% COMPLETE"; }
          10%, 19% { content: "12% COMPLETE"; }
          20%, 29% { content: "25% COMPLETE"; }
          30%, 39% { content: "38% COMPLETE"; }
          40%, 49% { content: "53% COMPLETE"; }
          50%, 59% { content: "66% COMPLETE"; }
          60%, 69% { content: "78% COMPLETE"; }
          70%, 79% { content: "85% COMPLETE"; }
          80%, 89% { content: "94% COMPLETE"; }
          90%, 100% { content: "100% COMPLETE"; }
        }
        .loading-percentage::after {
          content: "0% COMPLETE";
          animation: loadingPercentage 1.5s ease-out forwards;
        }
      \`}} />

      <div className="w-full max-w-sm space-y-8 text-center flex flex-col items-center">
        
        <div className="font-heading text-4xl sm:text-5xl text-retro-surface uppercase tracking-widest relative">
          LOADING<span className="animate-cursor">_</span>
        </div>
        
        {/* Retro Progress Bar Container */}
        <div className="w-full h-6 border-4 border-retro-surface p-1 shadow-retro-sm">
          <div className="h-full bg-retro-surface animate-fill" />
        </div>
        
        {/* Loading status texts */}
        <div className="font-mono text-xs sm:text-sm text-retro-surface/80 min-h-[40px] space-y-1">
          <p className="loading-step"></p>
          <p className="text-[10px] text-retro-surface/60 loading-percentage"></p>
        </div>

        {/* Random Quote */}
        <div className="mt-8 pt-6 w-full border-t-2 border-dashed border-retro-surface/30">
          <p 
            suppressHydrationWarning 
            className="font-body text-retro-surface/90 italic text-sm md:text-base leading-relaxed mb-3 px-4"
          >
            {randomQuote}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-retro-surface/50">
             - SYSTEM MEMORY
          </p>
        </div>

      </div>
    </div>
  );
}