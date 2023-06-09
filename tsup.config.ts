import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	dts: true,
	entry: ["src/**/*.ts"],
	format: ["cjs", "esm"],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: "es2020",
	tsconfig: "tsconfig.build.json",
	keepNames: true,
	treeshake: true,
	bundle: true,
	splitting: false
});
