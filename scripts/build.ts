import {readFile, writeFile, unlink} from 'node:fs/promises'
import {resolve} from 'node:path'
import {build} from 'esbuild'
import type {Plugin} from 'esbuild'
import {minify as minifyHtml} from 'html-minifier-terser'
import htmlGenerator from '../src/htmlGenerator.ts'
import pkg from '../package.json' with {type: 'json'}

const rootDir = resolve(import.meta.dirname, '..')
const version = pkg.version
const banner = `// fakesome ${version} by Adrian Sieber (adriansieber.com)\n\n`

const browserStubPlugin: Plugin = {
	name: 'browser-stubs',
	setup(build) {
		const stubPath = resolve(rootDir, 'src/browserStubs/nodeModule.ts')

		build.onResolve({filter: /^node:module$/}, () => ({path: stubPath}))

		build.onResolve({filter: /^canvas$/}, () => ({
			path: 'canvas',
			namespace: 'missing-canvas',
		}))

		build.onLoad({filter: /.*/, namespace: 'missing-canvas'}, () => ({
			contents: 'throw new Error("canvas is not available in the browser")',
			loader: 'js',
		}))
	},
}

async function bundleBrowserJs({minify}: {minify: boolean}): Promise<string> {
	const result = await build({
		entryPoints: [resolve(rootDir, 'src/fakesome.ts')],
		bundle: true,
		write: false,
		format: 'iife',
		globalName: 'fakesome',
		platform: 'browser',
		target: ['es2019'],
		minify,
		banner: {js: banner},
		// Expose the default export directly instead of the module namespace
		footer: {js: 'fakesome = fakesome.default;'},
		plugins: [browserStubPlugin],
		logLevel: 'warning',
	})

	const output = result.outputFiles[0]

	if (!output) throw new Error('esbuild produced no output')

	return output.text
}

async function buildJs() {
	const code = await bundleBrowserJs({minify: false})
	await writeFile(resolve(rootDir, 'fakesome.js'), code)
	console.log('Building fakesome.js succeeded')
}

async function buildMinJs() {
	const code = await bundleBrowserJs({minify: true})
	await writeFile(resolve(rootDir, 'fakesome.min.js'), code)
	console.log('Building fakesome.min.js succeeded')
}

async function buildHtml() {
	const html = htmlGenerator()
	const template = await readFile(resolve(rootDir, 'src/index.hbs'), 'utf8')
	const filled = template
		.replace('{{documentation}}', html.documentation)
		.replace('{{tableOfContents}}', html.tableOfContents)
		.replace(/Version [\.0-9]+/g, `Version ${version}`)

	const minified = await minifyHtml(filled, {
		removeComments: true,
		collapseWhitespace: true,
		removeAttributeQuotes: true,
		removeRedundantAttributes: true,
		minifyJS: true,
	})

	await writeFile(resolve(rootDir, 'index.html'), minified)
	console.log('Building index.html succeeded')
}

async function clean() {
	for (const name of ['fakesome.js', 'fakesome.min.js', 'index.html']) {
		try {
			await unlink(resolve(rootDir, name))
			console.log('Deleted ' + name)
		}
		catch (error) {
			if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
		}
	}
}

const command = process.argv[2] || 'all'

if (command === 'clean') {
	await clean()
}
else {
	await buildJs()
	await buildMinJs()
	await buildHtml()
}
