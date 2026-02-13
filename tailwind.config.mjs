/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				bg: '#ffffff',
				card: '#f9fafb',
				primary: '#d97706', // Amber-600 for better contrast on white than yellow-400
				text: '#111827', // Gray-900
				muted: '#4b5563', // Gray-600
				border: '#e5e7eb', // Gray-200
				accent: '#F59E0B', // Amber-500
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
		},
	},
	plugins: [],
}
