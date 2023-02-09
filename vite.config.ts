import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	root: "./src",
	build: {
		target: "ES6",
		outDir: "../dist",
		minify: false,
		emptyOutDir: true,
	}
});
