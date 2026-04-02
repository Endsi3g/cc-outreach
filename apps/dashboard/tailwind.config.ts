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
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // Luxury Light Mode Palette
        canvas: {
          DEFAULT: '#FFFFFF',
          warm: '#FAF9F6', // Off-white luxury
          depth: '#F5F4EF',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          elevated: 'rgba(255, 255, 255, 0.9)',
          glass: 'rgba(255, 255, 255, 0.4)',
        },
        accent: {
          slate: {
            DEFAULT: '#5F799D', // User selected
            muted: 'rgba(95, 121, 157, 0.1)',
            deep: '#4A5E7A',
          },
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#5A5A5A',
          tertiary: '#9A9A9A',
          muted: '#C5C5C5',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          light: 'rgba(0, 0, 0, 0.04)',
          glass: 'rgba(255, 255, 255, 0.2)',
        },
        // Shadcn compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#5F799D',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: 'rgba(95, 121, 157, 0.1)',
          foreground: '#5F799D',
        },
        muted: {
          DEFAULT: '#F5F5F3',
          foreground: '#737373',
        },
        accent_ui: {
          DEFAULT: '#F5F5F3',
          foreground: '#171717',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FAFAFA',
        },
        ring: '#5F799D',
      },
      borderRadius: {
        '3xl': '2.5rem', // User requested
        '2xl': '1.5rem',
        xl: '1rem',
        lg: '0.75rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

