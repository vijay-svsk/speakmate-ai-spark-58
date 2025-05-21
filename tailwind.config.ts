
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				playfair: ['"Playfair Display"', "serif"],
				inter: ['Inter', "sans-serif"]
			},
			colors: {
				// Add required semantic color keys for Tailwind utility classes like border-border
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))"
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))"
				},
				primary: {
					DEFAULT: '#9b87f5',
					foreground: '#fff',
					light: '#b3a4f7',
					dark: '#7a68d4'
				},
				accent: {
					DEFAULT: '#33C3F0',
					foreground: '#fff',
					light: '#5ed1f5',
					dark: '#1e9bc5'
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#fff'
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#fff'
				},
				danger: {
					DEFAULT: '#EF4444',
					foreground: '#fff'
				},
				badge: '#E5DEFF',
				neon: {
					pink: '#FF00FF',
					blue: '#00FFFF',
					green: '#00FF00',
					yellow: '#FFFF00'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-16px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(16px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
				},
				'confetti': {
					'0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' }
				},
				'flip-in': {
					'0%': { transform: 'rotateX(90deg)', opacity: '0' },
					'100%': { transform: 'rotateX(0)', opacity: '1' }
				},
				'bounce-light': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(155, 135, 245, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(155, 135, 245, 0.8)' },
				}
			},
			animation: {
				'fade-in': 'fade-in 0.5s cubic-bezier(.4,0,.2,1)',
				'fade-in-left': 'fade-in-left 0.5s cubic-bezier(.4,0,.2,1)',
				'fade-in-right': 'fade-in-right 0.5s cubic-bezier(.4,0,.2,1)',
				'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
				'confetti': 'confetti 3s ease-in-out forwards',
				'flip-in': 'flip-in 0.5s ease-out forwards',
				'bounce-light': 'bounce-light 2s ease-in-out infinite',
				'pulse-light': 'pulse-light 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
			},
			boxShadow: {
				'glow-primary': '0 0 10px rgba(155, 135, 245, 0.7)',
				'glow-accent': '0 0 10px rgba(51, 195, 240, 0.7)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
