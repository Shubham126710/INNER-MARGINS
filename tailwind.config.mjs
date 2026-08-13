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
        paper: '#E6DFF1',
        surface: '#F1ECF8',
        'content-surface': '#FAF8FC',
        ink: '#4E426B',
        muted: '#756A8F',
        accent: {
          DEFAULT: '#7A6C9D',
          plum: '#4E426B',
          secondary: '#8B86A8',
          blue: '#1D3557'
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
            '--tw-prose-body': '#4E426B',
            '--tw-prose-headings': '#4E426B',
            '--tw-prose-lead': '#4E426B',
            '--tw-prose-links': '#7A6C9D',
            '--tw-prose-bold': '#4E426B',
            '--tw-prose-counters': '#756A8F',
            '--tw-prose-bullets': '#756A8F',
            '--tw-prose-hr': '#756A8F',
            '--tw-prose-quotes': '#4E426B',
            '--tw-prose-quote-borders': '#7A6C9D',
            '--tw-prose-captions': '#756A8F',
            '--tw-prose-code': '#4E426B',
            '--tw-prose-pre-code': '#E6DFF1',
            '--tw-prose-pre-bg': '#4E426B',
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
        },
        loadingBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      }
    },
  },
  plugins: [
    typography,
  ],
};
