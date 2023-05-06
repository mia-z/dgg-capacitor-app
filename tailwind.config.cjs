/** @type {import("tailwindcss").Config} */

const colours = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
    content: ["src/**/*.{tsx,ts,js,jsx,html}"],
	darkMode: "class",
	plugins: [
		require("daisyui"),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities({
				"text-shadow": (value) => ({
					textShadow: value, 
				}), 
			}, { 
				values: theme("textShadow") 
			})
		})
	],
	daisyui: {
		themes: ["dark"]
	},
	theme: {
		extend: {
			textShadow: {
			  	sm: "0 1px 2px var(--tw-shadow-color)",
			  	DEFAULT: "0 2px 4px var(--tw-shadow-color)",
			  	lg: "0 8px 16px var(--tw-shadow-color)",
			},
		},
	}
}