import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { Project } from 'ts-morph'
import blade from './src/blade/plugin';

const project = new Project({
	tsConfigFilePath: './tsconfig.json',
})

// function transform() {
// 	return {
// 		name: 'transformPlugin',

// 		load(code, id, options) {
// 			if (id?.endsWith('.tsx') && !options?.ssr) {
//         console.log(options)
// 				const sourceFile = project.createSourceFile('path/to/myNewFile.ts', code, {
// 					overwrite: true,
// 				})
// 				const loader = sourceFile.getFunction('loader')
// 				const config = sourceFile.getVariableStatement('config')
// 				console.log(loader)
// 				loader?.remove()
// 				config?.remove()

// 				const emitOutput = sourceFile.print()
// 				return emitOutput
// 			}
// 		},
// 	}
// }

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), blade()],
	build: {
		minify: false,
	},
	// ssr: {
	// 	target: 'webworker',
	// 	noExternal: true,
	// },
})
