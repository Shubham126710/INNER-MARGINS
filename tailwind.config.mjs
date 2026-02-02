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
        retro: {
          bg: '#F4CFCB',      // Pinkish background
          surface: '#F7DAD6', // Lighter pink for cards
          text: '#C9413C',    // Dark red text
          border: '#E2554F',  // Medium red borders
          primary: '#C9413C', // Reusing dark red for primary
          secondary: '#E2554F',
          accent: '#C9413C',
          muted: '#E2554F',   // Medium red for muted
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'monospace'],
        display: ['var(--font-heading)', 'monospace'],
        body: ['var(--font-body)', 'monospace'],
        mono: ['monospace'], 
      },
      boxShadow: {
        'retro': '4px 4px 0 0 #C9413C',
        'retro-sm': '2px 2px 0 0 #C9413C',
        'retro-lg': '8px 8px 0 0 #C9413C',
        'retro-hover': '6px 6px 0 0 #C9413C',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#C9413C',
            '--tw-prose-headings': '#C9413C',
            '--tw-prose-lead': '#C9413C',
            '--tw-prose-links': '#C9413C',
            '--tw-prose-bold': '#C9413C',
            '--tw-prose-counters': '#E2554F',
            '--tw-prose-bullets': '#E2554F',
            '--tw-prose-hr': '#E2554F',
            '--tw-prose-quotes': '#C9413C',
            '--tw-prose-quote-borders': '#E2554F',
            '--tw-prose-captions': '#E2554F',
            '--tw-prose-code': '#C9413C',
            '--tw-prose-pre-code': '#F7DAD6',
            '--tw-prose-pre-bg': '#C9413C',
            fontFamily: 'var(--font-body)',
            maxWidth: '65ch',
            color: 'var(--retro-text)',
            h1: {
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
            },
            h2: {
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
            },
            h3: {
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
            },
            code: {
              fontFamily: 'monospace',
              backgroundColor: '#F7DAD6',
              padding: '0.2em 0.4em',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    typography,
  ],
};
