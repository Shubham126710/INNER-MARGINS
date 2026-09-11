export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-retro-text text-retro-surface py-16 border-t-4 border-retro-border relative overflow-hidden mt-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,218,214,0.05)_0%,transparent_60%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 relative z-10">
        
        {/* Brand / Archive Status */}
        <div className="space-y-4 md:col-span-2">
          <div className="inline-flex items-center gap-2 border border-retro-surface/30 px-3 py-1 mb-2 bg-retro-text/50">
            <div className="w-2 h-2 bg-retro-surface animate-pulse"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-retro-surface">Archive: Active</span>
          </div>
          <h3 className="font-heading text-xl uppercase tracking-widest text-retro-surface/90">
            Inner Margins
          </h3>
          <p className="font-mono text-sm text-retro-surface/60 max-w-xs leading-relaxed">
             An emotional operating system. Preserving lost thoughts and fragmented memories since inception.
          </p>
        </div>

        {/* System Info */}
        <div className="space-y-4 font-mono text-xs uppercase tracking-widest text-retro-surface/60">
          <h4 className="font-heading text-sm text-retro-surface/90 mb-6">System Data</h4>
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-retro-surface/10 pb-1">
              <span>Uptime:</span>
              <span className="text-retro-surface/90">Continuous</span>
            </li>
            <li className="flex justify-between border-b border-retro-surface/10 pb-1">
              <span>Integrity:</span>
              <span className="text-retro-surface/90">Fragile</span>
            </li>
            <li className="flex justify-between border-b border-retro-surface/10 pb-1">
              <span>Session:</span>
              <span className="text-retro-surface/90" suppressHydrationWarning>{currentYear}</span>
            </li>
          </ul>
        </div>
        
        {/* External Comms & Signoff */}
        <div className="flex flex-col space-y-4 font-mono text-xs uppercase tracking-widest text-retro-surface/60 md:pl-4">
          <h4 className="font-heading text-sm text-retro-surface/90 mb-2">Comms Array</h4>
          <ul className="space-y-3 mb-6">
            <li><a href="https://twitter.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="hover:text-retro-surface transition-colors flex justify-between border-b border-retro-surface/10 pb-1"><span>Twitter_X</span><span>↗</span></a></li>
            <li><a href="https://www.threads.net/@iamshubham_15" target="_blank" rel="noopener noreferrer" className="hover:text-retro-surface transition-colors flex justify-between border-b border-retro-surface/10 pb-1"><span>Threads</span><span>↗</span></a></li>
            <li><a href="https://www.instagram.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="hover:text-retro-surface transition-colors flex justify-between border-b border-retro-surface/10 pb-1"><span>Instagram</span><span>↗</span></a></li>
            <li><a href="https://github.com/Shubham126710" target="_blank" rel="noopener noreferrer" className="hover:text-retro-surface transition-colors flex justify-between border-b border-retro-surface/10 pb-1"><span>Github</span><span>↗</span></a></li>
            <li><a href="https://www.linkedin.com/in/shubham-upadhyay-a12a9428b/" target="_blank" rel="noopener noreferrer" className="hover:text-retro-surface transition-colors flex justify-between border-b border-retro-surface/10 pb-1"><span>LinkedIn</span><span>↗</span></a></li>
          </ul>

          <div className="mt-auto text-left pt-6 text-[10px] text-retro-surface/40">
            <p>End Of Transmission.</p>
            <p className="mt-1">Shutting down sequence standing by...</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
