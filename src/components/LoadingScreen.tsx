export default function LoadingScreen() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center font-mono">
      <div className="w-72 space-y-6 text-center">
        <div className="font-heading text-3xl text-retro-surface uppercase tracking-widest animate-pulse">
          Loading_
        </div>
        
        {/* Retro Progress Bar */}
        <div className="h-6 border-4 border-retro-surface p-1 bg-retro-surface shadow-retro-sm">
          <div className="h-full bg-retro-primary w-full animate-progress origin-left"></div>
        </div>
        
        <div className="font-mono text-xs text-retro-surface/80 space-y-1">
          <p>INITIALIZING SYSTEM...</p>
          <p>LOADING ASSETS...</p>
          <p className="animate-pulse">PLEASE WAIT...</p>
        </div>
      </div>
    </div>
  );
}
