import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true
	},
	esbuild: {
		target: "ES2020"
	}
});
