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
				inter: ['Inter', "sans-serif"],
                space: ['Space Grotesk', 'sans-serif'],
                mono: ['Space Mono', 'monospace']
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
					dark: '#7a68d4',
					50: '#f5f2ff',
					100: '#ede5ff',
					200: '#dbd0fe',
					300: '#c2affd',
					400: '#a98ef9',
					500: '#9b87f5',
					600: '#7a55ed',
					700: '#6939d8',
					800: '#5a31b4',
					900: '#4b2d92',
				},
				accent: {
					DEFAULT: '#33C3F0',
					foreground: '#fff',
					light: '#5ed1f5',
					dark: '#1e9bc5',
					50: '#eefffd',
					100: '#d4fbff',
					200: '#aef4ff',
					300: '#76e8fb',
					400: '#39d2f3',
					500: '#16b3da',
					600: '#0e8fb6',
					700: '#107293',
					800: '#155d78',
					900: '#164d65',
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#fff',
					light: '#34d399',
					dark: '#059669',
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#fff',
					light: '#fbbf24',
					dark: '#d97706',
				},
				danger: {
					DEFAULT: '#EF4444',
					foreground: '#fff',
					light: '#f87171',
					dark: '#dc2626',
				},
				badge: '#E5DEFF',
				neon: {
					pink: '#FF00FF',
					blue: '#00FFFF',
					green: '#00FF00',
					yellow: '#FFFF00'
				},
				// Learning path colors
				learning: {
					vocabulary: '#6366f1', // indigo
					grammar: '#10b981',    // emerald
					speaking: '#f43f5e',   // rose
					listening: '#f59e0b',  // amber
					writing: '#a855f7',    // purple
					reading: '#ec4899'     // pink
				},
				// New space-themed colors
                space: {
                    dark: '#0F172A',    // deep space blue
                    light: '#F8FAFC',   // star white
                    nebula: '#8B5CF6',  // purple nebula
                    cosmic: '#06B6D4',  // cosmic blue
                    meteor: '#FB7185',  // meteor red
                    dust: '#94A3B8',    // space dust
                    void: '#020617',    // black void
                    starlight: '#E2E8F0', // starlight
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
				'fade-in-scale': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
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
				},
				'twinkle': {
					'0%, 100%': { opacity: '0.2' },
					'50%': { opacity: '0.8' },
				},
				'star-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-2px)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'text-shimmer': {
					'0%': { backgroundPosition: '0% 50%' },
					'100%': { backgroundPosition: '200% 50%' },
				},
				'bubble-float': {
					'0%': { transform: 'translateY(0) scale(0.7)', opacity: '0' },
					'10%': { transform: 'translateY(-10px) scale(1)', opacity: '0.7' },
					'90%': { transform: 'translateY(-100px) scale(1)', opacity: '0.7' },
					'100%': { transform: 'translateY(-110px) scale(0.7)', opacity: '0' },
				},
				'shooting-star': {
					'0%': { transform: 'translateX(0) translateY(0) rotate(45deg)', opacity: '0' },
					'10%': { opacity: '1' },
					'40%': { transform: 'translateX(-100px) translateY(100px) rotate(45deg)', opacity: '0' },
					'100%': { transform: 'translateX(-100px) translateY(100px) rotate(45deg)', opacity: '0' },
				},
				"orbit": {
                    '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
                },
                "nebula-pulse": {
                    '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
                    '50%': { opacity: '0.5', transform: 'scale(1.1)' },
                },
                "meteor": {
                    '0%': { 
                        opacity: '0',
                        transform: 'translateX(0) translateY(0) rotate(315deg) scale(0)'
                    },
                    '10%': { 
                        opacity: '1',
                        transform: 'translateX(-20px) translateY(20px) rotate(315deg) scale(1)'
                    },
                    '90%': { opacity: '1' },
                    '100%': {
                        opacity: '0',
                        transform: 'translateX(-300px) translateY(300px) rotate(315deg) scale(0.2)'
                    },
                },
                "cosmic-ripple": {
                    '0%': { boxShadow: '0 0 0 0 rgba(155, 135, 245, 0.4)' },
                    '70%': { boxShadow: '0 0 0 20px rgba(155, 135, 245, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(155, 135, 245, 0)' },
                },
			},
			animation: {
				'fade-in': 'fade-in 0.5s cubic-bezier(.4,0,.2,1)',
				'fade-in-left': 'fade-in-left 0.5s cubic-bezier(.4,0,.2,1)',
				'fade-in-right': 'fade-in-right 0.5s cubic-bezier(.4,0,.2,1)',
				'fade-in-scale': 'fade-in-scale 0.5s cubic-bezier(.4,0,.2,1)',
				'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
				'confetti': 'confetti 3s ease-in-out forwards',
				'flip-in': 'flip-in 0.5s ease-out forwards',
				'bounce-light': 'bounce-light 2s ease-in-out infinite',
				'pulse-light': 'pulse-light 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'twinkle': 'twinkle 3s ease-in-out infinite',
				'star-float': 'star-float 5s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'text-shimmer': 'text-shimmer 3s infinite linear',
				'bubble-float': 'bubble-float 15s ease-in-out infinite',
				'shooting-star': 'shooting-star 6s ease-in-out infinite',
				"orbit": "orbit 20s linear infinite",
                "nebula-pulse": "nebula-pulse 15s infinite",
                "meteor": "meteor 5s ease-out forwards",
                "cosmic-ripple": "cosmic-ripple 2s infinite",
			},
			boxShadow: {
				'glow-primary': '0 0 10px rgba(155, 135, 245, 0.7)',
				'glow-accent': '0 0 10px rgba(51, 195, 240, 0.7)',
				'glow-success': '0 0 10px rgba(16, 185, 129, 0.7)',
				'glow-warning': '0 0 10px rgba(245, 158, 11, 0.7)',
				'glow-danger': '0 0 10px rgba(239, 68, 68, 0.7)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from var(--angle), var(--tw-gradient-stops))',
				'gradient-spotlight': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
                'space-gradient': 
                  'linear-gradient(to right, rgb(29, 78, 216), rgb(30, 64, 175), rgb(17, 24, 39))',
                'space-glow': 
                  'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(59, 130, 246, 0.5) 25%, rgba(30, 64, 175, 0.3) 50%, transparent 70%)',
                'nebula-pattern':
                  'repeating-radial-gradient(circle at top left, rgba(56, 189, 248, 0.1) 0%, rgba(99, 102, 241, 0.1) 12%, transparent 39%), repeating-radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.1) 0%, rgba(248, 113, 113, 0.1) 12%, transparent 62%)',
			},
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
