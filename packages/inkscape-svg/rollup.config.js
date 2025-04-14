import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';

export default {
	input: ['src/index.ts'],
	output: {
		dir: 'dist',
		format: 'cjs'
	},
	external: ['@to-motion-canvas/utilities'],
	plugins: [
		resolve(), // Resolves node_modules
		sucrase({
			transforms: ['typescript'],
		}),
		commonjs({ // Converts CommonJS modules to ES6
			include: '../../node_modules/**', // Include all modules in node_modules
		}),
		typescript(),
	]
};
