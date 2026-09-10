import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-4 border-retro-border bg-retro-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-heading uppercase mb-4 text-retro-text">Inner Margins</h3>
            <p className="text-retro-text/80 text-sm font-mono leading-relaxed max-w-xs">
              A personal space for thoughts, reflections, and the stories we carry within.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-4 border-b-2 border-retro-border inline-block pb-1 text-retro-text">
              Navigate
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link href="/" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline">
                  Analysis
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline">
                  Write
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-4 border-b-2 border-retro-border inline-block pb-1 text-retro-text">
              Connect
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a href="https://twitter.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline group">
                  <span className="opacity-50 group-hover:opacity-100 mr-2">{'>'}</span>TWITTER
                </a>
              </li>
              <li>
                <a href="https://www.threads.net/@iamshubham_15" target="_blank" rel="noopener noreferrer" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline group">
                  <span className="opacity-50 group-hover:opacity-100 mr-2">{'>'}</span>THREADS
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/iamshubham_15" target="_blank" rel="noopener noreferrer" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline group">
                  <span className="opacity-50 group-hover:opacity-100 mr-2">{'>'}</span>INSTAGRAM
                </a>
              </li>
              <li>
                <a href="https://github.com/Shubham126710" target="_blank" rel="noopener noreferrer" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline group">
                  <span className="opacity-50 group-hover:opacity-100 mr-2">{'>'}</span>GITHUB
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/shubham-upadhyay-a12a9428b/" target="_blank" rel="noopener noreferrer" className="text-retro-text/80 hover:text-retro-primary no-underline hover:underline group">
                  <span className="opacity-50 group-hover:opacity-100 mr-2">{'>'}</span>LINKEDIN
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t-2 border-dashed border-retro-border text-center font-mono text-xs text-retro-text/60">
          <p>
            © {currentYear} Inner Margins. All pixels reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
