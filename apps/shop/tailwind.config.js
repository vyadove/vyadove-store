// Tailwind CSS v4 CSS-first configuration
// This stub file exists only to satisfy eslint-plugin-tailwindcss@4.0.0-beta.0
// which expects a config file even when using Tailwind v4's CSS-first approach.
//
// ACTUAL CONFIGURATION: All theme settings are in src/app/globals.css
// using @import "tailwindcss" and @theme blocks (Tailwind v4 native approach)
//
// DO NOT add configuration here - it will be ignored by Tailwind v4.
// See: https://tailwindcss.com/docs/v4-beta

/** @type {import('tailwindcss').Config} */
module.exports = {
	// Minimal config to satisfy ESLint plugin
	// All actual configuration is in src/app/globals.css using Tailwind v4 CSS-first approach
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
