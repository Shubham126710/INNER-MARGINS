export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-paper py-16 border-t border-ink/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-display text-xl tracking-tight text-ink">
            Inner Margins
          </h3>
          <p className="font-sans text-sm text-muted max-w-sm leading-relaxed">
             A personal archive of things I couldn't leave unwritten.
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-widest text-ink font-medium mb-6">Archive Info</h4>
          <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-muted">
            <li className="flex justify-between border-b border-ink/5 pb-1">
              <span>Location:</span>
              <span className="text-ink">Chandigarh / IN</span>
            </li>
            <li className="flex justify-between border-b border-ink/5 pb-1">
              <span>Status:</span>
              <span className="text-ink">Active</span>
            </li>
            <li className="flex justify-between border-b border-ink/5 pb-1">
              <span>Edition:</span>
              <span className="text-ink" suppressHydrationWarning>{currentYear}</span>
            </li>
          </ul>
        </div>
        
        {/* Socials */}
        <div className="flex flex-col space-y-4 md:pl-4">
          <h4 className="font-sans text-xs uppercase tracking-widest text-ink font-medium mb-2">Connect</h4>
          <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-muted mb-6">
            <li><a href="https://twitter.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors flex justify-between border-b border-ink/5 pb-1"><span>Twitter_X</span><span>↗</span></a></li>
            <li><a href="https://www.threads.net/@iamshubham_15" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors flex justify-between border-b border-ink/5 pb-1"><span>Threads</span><span>↗</span></a></li>
            <li><a href="https://www.instagram.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors flex justify-between border-b border-ink/5 pb-1"><span>Instagram</span><span>↗</span></a></li>
            <li><a href="https://github.com/Shubham126710" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors flex justify-between border-b border-ink/5 pb-1"><span>Github</span><span>↗</span></a></li>
            <li><a href="https://www.linkedin.com/in/shubham-upadhyay-a12a9428b/" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors flex justify-between border-b border-ink/5 pb-1"><span>LinkedIn</span><span>↗</span></a></li>
          </ul>

          <div className="mt-auto text-left pt-6 text-[10px] font-sans text-muted">
            <p>&copy; {currentYear} Shubham Upadhyay.</p>
            <p className="mt-1">All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
