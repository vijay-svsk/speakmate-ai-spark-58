
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
				primary: {
					DEFAULT: '#9b87f5',
					foreground: '#fff'
				},
				accent: {
					DEFAULT: '#33C3F0',
					foreground: '#fff'
				},
				badge: '#E5DEFF'
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
			},
			animation: {
				'fade-in': 'fade-in 0.5s cubic-bezier(.4,0,.2,1)'
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

