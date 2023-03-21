const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');
const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [forms, typography, daisyui],

	daisyui: {
		styled: true,
		themes: ['retro', 'coffee'],
		base: true,
		utils: true,
		darkTheme: 'coffee'
	}
};

module.exports = config;
