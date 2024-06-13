// vite.config.js
// import glsl from "vite-plugin-glsl"

export default {
	// config options
	publicDir: "./src/assets",
	//plugins: [glsl()],
	build: {
		minify: false,
		rollupOptions: {
			input: "./src/js/main.js",
			output: {
				entryFileNames: `[name].js`,
				chunkFileNames: `[name].js`,
				assetFileNames: `[name].[ext]`
			}
		}
	}
}
