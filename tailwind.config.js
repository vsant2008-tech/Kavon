/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        backgroundImage: {
          'square-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg stroke-width='3.5' stroke='hsla(0, 0%25, 100%25, 1.00)' fill='none'%3E%3Crect width='400' height='400' x='0' y='0'%3E%3C/rect%3E%3Crect width='400' height='400' x='400' y='0'%3E%3C/rect%3E%3Crect width='400' height='400' x='800' y='0'%3E%3C/rect%3E%3Crect width='400' height='400' x='0' y='400'%3E%3C/rect%3E%3Crect width='400' height='400' x='400' y='400'%3E%3C/rect%3E%3Crect width='400' height='400' x='800' y='400'%3E%3C/rect%3E%3Crect width='400' height='400' x='0' y='800'%3E%3C/rect%3E%3Crect width='400' height='400' x='400' y='800'%3E%3C/rect%3E%3Crect width='400' height='400' x='800' y='800'%3E%3C/rect%3E%3C/g%3E%3C/svg%3E")`,
          'square-pattern-light': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg stroke-width='3.5' stroke='hsla(215, 16%25, 47%25, 1.00)' fill='none'%3E%3Crect width='400' height='400' x='0' y='0'%3E%3C/rect%3E%3Crect width='400' height='400' x='400' y='0'%3E%3C/rect%3E%3Crect width='400' height='400' x='800' y='0'%3E%3C/rect%3E%3Crect width='400' height='400' x='0' y='400'%3E%3C/rect%3E%3Crect width='400' height='400' x='400' y='400'%3E%3C/rect%3E%3Crect width='400' height='400' x='800' y='400'%3E%3C/rect%3E%3Crect width='400' height='400' x='0' y='800'%3E%3C/rect%3E%3Crect width='400' height='400' x='400' y='800'%3E%3C/rect%3E%3Crect width='400' height='400' x='800' y='800'%3E%3C/rect%3E%3C/g%3E%3C/svg%3E")`,
        }
      }
    }
  },
  plugins: [],
};
