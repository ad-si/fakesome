import {readFile, writeFile, unlink} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'
import {build} from 'esbuild'
import {minify as minifyHtml} from 'html-minifier-terser'
import htmlGenerator from '../src/htmlGenerator.js'
import pkg from '../package.json' with {type: 'json'}

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const version = pkg.version
const banner = `// fakesome ${version} by Adrian Sieber (adriansieber.com)\n\n`

const browserStubPlugin = {
	name: 'browser-stubs',
	setup(build) {
		const stubPath = resolve(rootDir, 'src/browserStubs/nodeModule.js')

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

async function bundleBrowserJs({minify}) {
	const result = await build({
		entryPoints: [resolve(rootDir, 'src/fakesome.js')],
		bundle: true,
		write: false,
		format: 'iife',
		globalName: 'fakesome',
		platform: 'browser',
		target: ['es2019'],
		minify,
		banner: {js: banner},
		plugins: [browserStubPlugin],
		logLevel: 'warning',
	})

	return result.outputFiles[0].text
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
		catch (err) {
			if (err.code !== 'ENOENT') throw err
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
