import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      colors: {
        // Minimalist warm monochrome palette
        canvas: {
          DEFAULT: '#FFFFFF',
          warm: '#F7F6F3',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F9F9F8',
        },
        text: {
          primary: '#111111',
          secondary: '#787774',
          tertiary: '#A5A5A5',
          muted: '#C5C5C5',
        },
        border: {
          DEFAULT: '#EAEAEA',
          light: 'rgba(0, 0, 0, 0.06)',
        },
        // Semantic accents - muted pastels
        accent: {
          red: {
            bg: '#FDEBEC',
            text: '#9F2F2D',
          },
          blue: {
            bg: '#E1F3FE',
            text: '#1F6C9F',
          },
          green: {
            bg: '#EDF3EC',
            text: '#346538',
          },
          yellow: {
            bg: '#FBF3DB',
            text: '#956400',
          },
          purple: {
            bg: '#F3E8FF',
            text: '#7C3AED',
          },
        },
        // Shadcn compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        ring: 'hsl(var(--ring))',
        input: 'hsl(var(--input))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
