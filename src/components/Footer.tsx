export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-accent text-content-surface py-24 relative overflow-hidden mt-32">
      
      {/* Hardcover inset border */}
      <div className="absolute inset-4 lg:inset-6 border-[1px] border-paper/30 rounded-sm pointer-events-none hidden md:block"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand - Span 6 */}
          <div className="md:col-span-6 space-y-8 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-5xl lg:text-7xl tracking-tight text-content-surface mb-6 uppercase">
                Inner Margins
              </h2>
              <p className="font-sans text-2xl lg:text-3xl text-paper max-w-md leading-snug">
                 A personal archive of things I couldn't leave unwritten.
              </p>
            </div>
            <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-paper/80 pt-16">
              <p>&copy; {currentYear} SHUBHAM UPADHYAY.</p>
              <p className="mt-2">ALL RIGHTS RESERVED.</p>
            </div>
          </div>

          {/* Metadata - Span 3 */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-sans text-[10px] uppercase tracking-widest text-paper/80 border-b border-paper/30 pb-2">Archive Info</h4>
            <ul className="space-y-4 font-mono text-xs uppercase tracking-widest text-content-surface">
              <li className="flex flex-col gap-1">
                <span className="text-paper/80 text-[10px]">Location</span>
                <span>Chandigarh / IN</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-paper/80 text-[10px]">Status</span>
                <span>Active</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-paper/80 text-[10px]">Edition</span>
                <span suppressHydrationWarning>{currentYear}</span>
              </li>
            </ul>
          </div>
          
          {/* Socials - Span 3 */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-sans text-[10px] uppercase tracking-widest text-paper/80 border-b border-paper/30 pb-2">Connect</h4>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-widest text-content-surface">
              <li>
                <a href="https://twitter.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-paper/20 pb-2 hover:border-paper transition-colors">
                  <span>Twitter_X</span><span className="text-paper/80 group-hover:text-surface transition-colors">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.threads.net/@iamshubham_15" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-paper/20 pb-2 hover:border-paper transition-colors">
                  <span>Threads</span><span className="text-paper/80 group-hover:text-surface transition-colors">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-paper/20 pb-2 hover:border-paper transition-colors">
                  <span>Instagram</span><span className="text-paper/80 group-hover:text-surface transition-colors">↗</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/Shubham126710" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-paper/20 pb-2 hover:border-paper transition-colors">
                  <span>Github</span><span className="text-paper/80 group-hover:text-surface transition-colors">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/shubham-upadhyay-a12a9428b/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-paper/20 pb-2 hover:border-paper transition-colors">
                  <span>LinkedIn</span><span className="text-paper/80 group-hover:text-surface transition-colors">↗</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* End of Edition Marker */}
        <div className="mt-32 pt-8 border-t border-paper/20 flex flex-col items-center justify-center text-center opacity-80">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper/90 mb-3">End of Edition</p>
          <div className="w-2 h-2 rounded-full bg-surface"></div>
        </div>
      </div>
    </footer>
  );
}
