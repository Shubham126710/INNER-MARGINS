import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F4F1EA',
        ink: '#111111',
        muted: '#77736C',
        accent: {
          burgundy: '#6B1F1F',
          orange: '#C95B30',
          blue: '#1D3557',
          green: '#8A9A5B'
        }
      },
      fontFamily: {
        display: ['var(--font-heading)', 'serif'],
        heading: ['var(--font-heading)', 'serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'], 
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#111111',
            '--tw-prose-headings': '#111111',
            '--tw-prose-lead': '#111111',
            '--tw-prose-links': '#6B1F1F',
            '--tw-prose-bold': '#111111',
            '--tw-prose-counters': '#77736C',
            '--tw-prose-bullets': '#77736C',
            '--tw-prose-hr': '#77736C',
            '--tw-prose-quotes': '#111111',
            '--tw-prose-quote-borders': '#6B1F1F',
            '--tw-prose-captions': '#77736C',
            '--tw-prose-code': '#111111',
            '--tw-prose-pre-code': '#F4F1EA',
            '--tw-prose-pre-bg': '#111111',
            fontFamily: 'var(--font-body)',
            maxWidth: '65ch',
            color: 'var(--tw-prose-body)',
            h1: {
              fontFamily: 'var(--font-heading)',
              fontWeight: '400',
            },
            h2: {
              fontFamily: 'var(--font-heading)',
              fontWeight: '400',
            },
            h3: {
              fontFamily: 'var(--font-heading)',
              fontWeight: '400',
            },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              fontWeight: '400',
              '&:hover': {
                color: 'var(--tw-prose-body)',
              }
            },
            code: {
              fontFamily: 'var(--font-mono)',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              fontStyle: 'normal',
              borderLeftWidth: '1px',
              borderColor: 'var(--tw-prose-quote-borders)',
            }
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    typography,
  ],
};
