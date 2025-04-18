import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/main.ts'),
			formats: ['cjs'], // equivalent to "module" in Rollup
			fileName: () => 'main.dist.js',
		},
		outDir: 'ESLint.novaextension/Scripts',
		sourcemap: true,
		rollupOptions: {
			output: {
				entryFileNames: 'main.dist.js',
			},
		},
	},
});
