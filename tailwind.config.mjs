/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				bg: '#0d1117',
				card: '#161b22',
				primary: '#58a6ff',
				text: '#c9d1d9',
				muted: '#8b949e',
				border: '#30363d',
				accent: '#238636',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
		},
	},
	plugins: [],
}
