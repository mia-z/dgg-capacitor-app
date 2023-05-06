/** @type {import("tailwindcss").Config} */

const colours = require("tailwindcss/colors");

module.exports = {
    content: ["src/**/*.{tsx,ts,js,jsx,html}"],
	darkMode: "class",
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["dark"]
	}
}