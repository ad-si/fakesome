import color from 'color'
import clone from 'clone'
import {createRequire} from 'node:module'


export type ColorType = 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hex' | 'percent'

export type DateInput = Date | string | number

export type NumberFilter = (value: number) => boolean

export interface ImgURLConfig {
	width?: number
	height?: number
	grayscale?: boolean
	site?: 'picsum.photos' | 'placekitten.com'
	/** Seed to get the same image for the same number */
	number?: number | string | false
}

export interface ImgConfig {
	/** Return an `<img>` tag instead of the data URL */
	tag?: boolean
	width?: number
	height?: number
	/** Print the size of the image onto it */
	size?: boolean
	/** Text to print onto the image */
	text?: string
	/** Number of rectangles to draw */
	elements?: number
	bgColor?: string
	elementSize?: number
	minColor?: string
	maxColor?: string
	filter?: 'grayscale' | 'bw'
}

/**
 * All methods which generate a value.
 * Extend this interface via module augmentation
 * when adding custom generators to `fakesome.fn`.
 */
export interface Generators {
	boolean(chanceOfTrue?: number): boolean
	character(min?: number, max?: number): string
	color(min?: string | null, max?: string | null, type?: ColorType): string
	date(startDate?: DateInput | null, endDate?: DateInput | null): Date
	datetime(startDate?: DateInput | null, endDate?: DateInput | null): Date
	element<T>(array: readonly T[]): T
	float(min?: number | null, max?: number | null, filter?: NumberFilter): number
	imgURL(conf?: ImgURLConfig): string
	integer(min?: number | null, max?: number | null, filter?: NumberFilter): number
	// Values of the schema get replaced by generated values of any type
	object(schema: object): Record<string, any>
	sentence(min?: number, max?: number): string
	sentences(quantity?: number, min?: number, max?: number): string
	string(alphabet?: readonly string[], length?: number): string
	text(min?: number, max?: number): string
	word(minChars?: number, maxChars?: number): string
	words(quantity?: number, minChars?: number, maxChars?: number): string
	/** Only available if a canvas is available (browser or `canvas` package) */
	img?(conf?: ImgConfig): string
}

type WrappedGenerators<Transform extends 'maybe' | 'array'> = {
	[K in keyof Generators]: Generators[K] extends ((...args: infer A) => infer R) | undefined
		? (...args: A) => Transform extends 'maybe' ? R | null : R[]
		: never
}

export type MaybeGenerators = WrappedGenerators<'maybe'>
export type ArrayGenerators = WrappedGenerators<'array'>
export type UniqueGenerators = Generators

export interface Fakesome extends Generators {
	/** Return `null` instead of a value with a probability of `chanceOfNull` */
	maybe(chanceOfNull?: number): MaybeGenerators
	/** Never return the same value twice */
	unique(reset?: boolean): UniqueGenerators
	/** Return an array of `length` values */
	array(length?: number): ArrayGenerators
	/** Reference to fakesome itself for adding custom generators */
	fn: Fakesome
}

type AnyFunction = (...args: unknown[]) => unknown

interface CanvasLike {
	width: number
	height: number
	getContext(type: '2d'): CanvasRenderingContext2D | null
	toDataURL(): string
}


const isBrowser = typeof window === 'object' &&
	typeof window.document === 'object'

let canvas: CanvasLike | undefined

if (isBrowser) {
	canvas = document.createElement('canvas')
}
else {
	try {
		const require = createRequire(import.meta.url)
		const nodeCanvas = require('canvas') as {
			createCanvas(width: number, height: number): CanvasLike
		}
		canvas = nodeCanvas.createCanvas(100, 100)
	}
	catch {
		canvas = undefined
	}
}


const lorem = [
	'lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor',
	'invidunt ut labore et dolore magna aliquyam erat sed diam voluptua at vero eos et accusam et',
	'justo duo dolores et ea rebum stet clita kasd gubergren no sea takimata sanctus est lorem ipsum',
	'dolor sit amet lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod',
	'tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua at vero eos et accusam',
	'et justo duo dolores et ea rebum stet clita kasd gubergren no sea takimata sanctus est lorem ipsum',
	'dolor sit amet',
].join(' ')

const uniqueMap: Record<string, unknown[]> = {}


function isInt(number: number): boolean {
	return Number(number) % 1 === 0
}

function randomInt(min?: number | null, max?: number | null): number {

	// (2^53/2) - 1
	let lower = Number(min ?? -4503599627370495)
	let upper = Number(max ?? 4503599627370495)

	if (upper < lower) {
		[lower, upper] = [upper, lower]
	}

	if (!isInt(lower))
		throw new TypeError('Min must be an Integer. Not ' + lower)

	if (!isInt(upper))
		throw new TypeError('Max must be an Integer. Not ' + upper)

	return Math.floor(Math.random() * (upper - lower + 1) + lower)
}

function randomFloat(min?: number | null, max?: number | null): number {
	const lower = min ?? -1e12
	const upper = max ?? 1e12

	return Math.random() * (upper - lower) + lower
}

function randomDatetime(
	startDate?: DateInput | null,
	endDate?: DateInput | null,
): Date {
	const start = new Date(startDate ?? 0).getTime()
	const end = new Date(endDate ?? new Date()).getTime()

	return new Date(start + Math.random() * (end - start))
}

function inferColorType(min: string, max: string): ColorType | undefined {
	if (min.includes('rgb') || max.includes('rgb'))
		return (min.includes('rgba') || max.includes('rgba')) ? 'rgba' : 'rgb'

	if (min.includes('hsl') || max.includes('hsl'))
		return (min.includes('hsla') || max.includes('hsla')) ? 'hsla' : 'hsl'

	return undefined
}

function randomColor(
	min?: string | null,
	max?: string | null,
	type?: ColorType,
): string {

	// Infer the type from the format of the bounds if none is set
	if (!type && typeof min === 'string' && typeof max === 'string')
		type = inferColorType(min, max)

	const minColor = color(min || 'rgba(0,0,0,0)')
	const maxColor = color(max || 'rgba(255,255,255,1)')
	const alpha = randomFloat(minColor.alpha(), maxColor.alpha())

	// Channels can be fractional when the bounds are not in rgb notation
	const value = color.rgb([
		randomInt(Math.round(minColor.red()), Math.round(maxColor.red())),
		randomInt(Math.round(minColor.green()), Math.round(maxColor.green())),
		randomInt(Math.round(minColor.blue()), Math.round(maxColor.blue())),
	]).alpha(alpha)

	switch (type || 'rgb') {
		case 'rgb':
			return value.alpha(1).rgb().string()
		case 'rgba':
			return 'rgba(' + value.red() + ', ' + value.green() + ', ' +
				value.blue() + ', ' + alpha + ')'
		case 'hsl':
			return value.alpha(1).hsl().round().string()
		case 'hsla': {
			const hsl = value.hsl().round().object()
			return 'hsla(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%, ' +
				alpha + ')'
		}
		case 'hex':
			return value.hex()
		case 'percent':
			return value.percentString()
		default:
			throw new TypeError(type + ' is not allowed as a type value.')
	}
}

function withDefaults<T extends object>(conf: Partial<T>, defaults: T): T {
	const result = {...defaults}

	for (const key of Object.keys(conf) as (keyof T)[]) {
		if (conf[key] !== undefined) result[key] = conf[key] as T[keyof T]
	}

	return result
}

function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i] as T
		array[i] = array[j] as T
		array[j] = temp
	}

	return array
}

function getType(obj: unknown): string {
	// http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator
	return Object.prototype.toString
		.call(obj)
		.slice(8, -1)
		.toLowerCase()
}

/** Runtime check for callers without type checking */
function typeCheck(value: unknown, expectedType: string): void {
	const actualType = getType(value)

	if (value !== undefined && actualType !== expectedType) {
		throw new TypeError(
			'The argument must be of type ' + expectedType +
			' and not ' + actualType,
		)
	}
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

function randomElement<T>(array: readonly T[]): T {
	return array[Math.floor(Math.random() * array.length)] as T
}

function checkFilter(filter: unknown): void {
	if (typeof filter !== 'function')
		throw new TypeError('Filter must be a function.')
}

function randomSentence(min: number, max: number): string {
	return capitalize(
		shuffle(lorem.split(' '))
			.slice(0, randomInt(min, max))
			.join(' '),
	)
}

/** Methods which are no generators and therefore don't get wrapped */
function isWrappable(method: string): boolean {
	return method !== 'maybe' &&
		method !== 'unique' &&
		method !== 'array' &&
		method !== 'fn'
}

/** Wrap all generator methods (including custom ones) of fakesome */
function wrapGenerators<T>(
	wrap: (generator: AnyFunction, name: string) => AnyFunction,
): T {
	const methods = fakesome as unknown as Record<string, unknown>
	const result: Record<string, AnyFunction> = {}

	for (const name of Object.keys(methods)) {
		const method = methods[name]

		if (isWrappable(name) && typeof method === 'function')
			result[name] = wrap(method as AnyFunction, name)
	}

	return result as T
}


const fakesome = {

	boolean(chanceOfTrue?: number): boolean {

		chanceOfTrue = chanceOfTrue ?? 0.5

		if (typeof chanceOfTrue !== 'number') {
			throw new TypeError(
				'ChanceOfTrue must be a number and not a ' + typeof chanceOfTrue,
			)
		}

		if (chanceOfTrue >= 0 && chanceOfTrue <= 1)
			return Math.random() < chanceOfTrue
		else
			throw new RangeError('Must be a number between 0 and 1')
	},

	character(min?: number, max?: number): string {
		return String.fromCharCode(randomInt(min ?? 32, max ?? 1114112))
	},

	color: randomColor,

	date(startDate?: DateInput | null, endDate?: DateInput | null): Date {
		const randDate = randomDatetime(startDate, endDate)

		return new Date(randDate.toJSON().slice(0, 10))
	},

	datetime: randomDatetime,

	element: randomElement,

	float(
		min?: number | null,
		max?: number | null,
		filter?: NumberFilter,
	): number {

		if (filter) {
			checkFilter(filter)

			let value: number

			do {
				value = randomFloat(min, max)
			} while (!filter(value))

			return value
		}

		return randomFloat(min, max)
	},

	imgURL(conf: ImgURLConfig = {}): string {

		const config = withDefaults<Required<ImgURLConfig>>(conf, {
			width: 100,
			height: 100,
			grayscale: false,
			site: 'picsum.photos',
			number: false,
		})
		let url = 'https://'

		// TODO: http://hhhhold.com/, http://pixelholdr.com/, http://placecreature.com/

		switch (config.site) {

			case 'picsum.photos':
				url += 'picsum.photos'
				url += config.number ? '/seed/' + config.number : ''
				url += config.width ? '/' + config.width : ''
				url += config.height ? '/' + config.height : ''
				url += config.grayscale ? '?grayscale' : ''
				break

			case 'placekitten.com':
				url += 'placekitten.com'
				url += config.grayscale ? '/g' : ''
				url += config.width ? '/' + config.width : ''
				url += config.height ? '/' + config.height : ''
				break

			default:
				throw new Error(config.site + ' is no valid image hoster.')
		}

		return url
	},

	integer(
		min?: number | null,
		max?: number | null,
		filter?: NumberFilter,
	): number {

		if (filter) {
			checkFilter(filter)

			let value: number

			do {
				value = randomInt(min, max)
			} while (!filter(value))

			return value
		}

		return randomInt(min, max)
	},

	object(schema: object): Record<string, any> {

		const methods = fakesome as unknown as Record<string, unknown>

		function evaluateObject(object: Record<string, unknown>) {

			for (const key of Object.keys(object)) {
				const value = object[key]
				const methodName = typeof value === 'string'
					? value.match(/^\w+/)?.[0]
					: undefined

				// If method exists evaluate
				if (typeof value === 'string' && methodName && methods[methodName]) {
					try {
						object[key] = new Function('fakesome', 'return fakesome.' + value)(fakesome)
					}
					catch {
						console.log('Couldn\'t evaluate fakesome.' + value)
					}
				}
				else if (typeof value === 'function') {
					object[key] = value()
				}
				else if (getType(value) === 'object') {
					evaluateObject(value as Record<string, unknown>)
				}
			}

			return object
		}

		return evaluateObject(clone(schema) as Record<string, unknown>)
	},

	sentence(min?: number, max?: number): string {

		typeCheck(min, 'number')
		typeCheck(max, 'number')

		const sentence = randomSentence(min ?? 5, max ?? 25)

		return sentence ? sentence + '.' : ''
	},

	sentences(quantity?: number, min?: number, max?: number): string {

		typeCheck(quantity, 'number')
		typeCheck(min, 'number')
		typeCheck(max, 'number')

		const sentences: string[] = []

		for (let i = 0; i < (quantity ?? 1); i++) {
			const sentence = randomSentence(min ?? 5, max ?? 25)

			if (sentence) sentences.push(sentence)
		}

		return sentences.length > 0 ? sentences.join('. ') + '.' : ''
	},

	string(alphabet?: readonly string[], length?: number): string {

		typeCheck(alphabet, 'array')
		typeCheck(length, 'number')

		const characters = alphabet ?? 'abcdefghijklmnopqrstuvwxyz'.split('')
		const string: string[] = []

		for (let i = 0; i < (length ?? 10); i++)
			string.push(randomElement(characters))

		return string.join('')
	},

	text(min?: number, max?: number): string {

		typeCheck(min, 'number')
		typeCheck(max, 'number')

		return lorem.slice(0, randomInt(min ?? 50, max ?? 100))
	},

	word(minChars?: number, maxChars?: number): string {

		typeCheck(minChars, 'number')
		typeCheck(maxChars, 'number')

		const minimum = minChars ?? 1
		const maximum = maxChars ?? 20

		const word = shuffle(lorem.split(' '))
			.find(element =>
				element.length >= minimum && element.length <= maximum,
			)

		if (word)
			return word
		else
			throw new RangeError(
				'No word with between ' + minimum + ' and ' + maximum +
				' characters available.',
			)
	},

	words(quantity?: number, minChars?: number, maxChars?: number): string {

		typeCheck(quantity, 'number')
		typeCheck(minChars, 'number')
		typeCheck(maxChars, 'number')

		const words: string[] = []

		for (let i = 0; i < (quantity ?? 10); i++)
			words.push(fakesome.word(minChars, maxChars))

		return words.join(' ')
	},

	maybe(chanceOfNull?: number): MaybeGenerators {

		typeCheck(chanceOfNull, 'number')

		const chance = chanceOfNull ?? 0.5

		return wrapGenerators<MaybeGenerators>(generator =>
			(...args) => Math.random() < chance ? null : generator(...args),
		)
	},

	unique(reset?: boolean): UniqueGenerators {

		return wrapGenerators<UniqueGenerators>((generator, name) =>
			(...args) => {
				let counter = 0
				let value: unknown

				if (reset === true || uniqueMap[name] === undefined)
					uniqueMap[name] = []

				const usedValues = uniqueMap[name]

				do {
					if (counter >= 1000) {
						throw new Error(
							'Unique value couldn\'t be generated (efficiently). ' +
							'Please increase the domain.',
						)
					}

					value = generator(...args)
					counter++
				}
				while (usedValues.includes(value))

				usedValues.push(value)

				return value
			},
		)
	},

	array(length?: number): ArrayGenerators {

		const count = length ?? 10

		return wrapGenerators<ArrayGenerators>(generator =>
			(...args) => {
				const array: unknown[] = []

				for (let i = 0; i < count; i++)
					array.push(generator(...args))

				return array
			},
		)
	},
} as Fakesome


function createImg(canvas: CanvasLike) {

	return function img(conf: ImgConfig = {}): string {

		const config = withDefaults<ImgConfig & Required<Omit<ImgConfig, 'text' | 'filter'>>>(
			conf,
			{
				tag: false,
				width: 100,
				size: false,
				height: 100,
				elements: 100,
				bgColor: 'white',
				elementSize: 50,
				minColor: 'rgba(0,0,0,0)',
				maxColor: 'rgba(255,255,255,1)',
			},
		)

		const ctx = canvas.getContext('2d')

		if (!ctx) throw new Error('Could not get a 2d context of the canvas')

		canvas.width = config.width
		canvas.height = config.height

		ctx.fillStyle = config.bgColor
		ctx.fillRect(0, 0, config.width, config.height)

		for (let i = 0; i < config.elements; i++) {
			ctx.fillStyle = randomColor(config.minColor, config.maxColor)
			ctx.fillRect(
				randomInt(-config.elementSize, config.width),
				randomInt(-config.elementSize, config.height),
				randomInt(0, config.elementSize),
				randomInt(0, config.elementSize),
			)
		}

		function luminance(data: Uint8ClampedArray, index: number): number {
			return 0.2126 * (data[index] ?? 0) +
				0.7152 * (data[index + 1] ?? 0) +
				0.0722 * (data[index + 2] ?? 0)
		}

		function grayscale(imageData: ImageData): ImageData {
			const data = imageData.data

			for (let i = 0; i < data.length; i += 4)
				data[i] = data[i + 1] = data[i + 2] = luminance(data, i)

			return imageData
		}

		function blackWhite(imageData: ImageData): ImageData {
			const data = imageData.data
			const values: number[] = []
			let max = 0
			let min = 255

			for (let i = 0; i < data.length; i += 4) {
				const value = luminance(data, i)

				if (value > max) max = value
				if (value < min) min = value

				values[i] = value
			}

			const threshold = (min + max) / 2

			for (let i = 0; i < data.length; i += 4) {
				data[i] = data[i + 1] = data[i + 2] =
					(values[i] ?? 0) >= threshold ? 255 : 0
			}

			return imageData
		}

		// TODO: Check background color (histogram) and choose text color accordingly

		function drawText(context: CanvasRenderingContext2D, text: string) {
			const fontSize = Math.min(
				(config.width / text.length) * 1.4,
				config.height * 0.3,
			)

			context.fillStyle = 'rgba(0,0,0,0.7)'
			context.font = fontSize + 'px Arial'

			const textWidth = context.measureText(text).width
			const x = (config.width - textWidth) / 2
			const y = config.size
				? config.height / 2 + fontSize / 2
				: config.height / 2

			context.textBaseline = 'middle'
			context.fillText(text, x, y)
		}

		function drawSize(context: CanvasRenderingContext2D) {
			const string = config.width + '×' + config.height
			const fontSize = Math.min(
				config.width / string.length,
				config.height * 0.3,
			)

			context.fillStyle = 'rgba(0,0,0,0.7)'
			context.font = 'bold ' + fontSize + 'px Arial'

			const textWidth = context.measureText(string).width
			const x = (config.width - textWidth) / 2
			const y = config.text
				? config.height / 2 - fontSize / 2
				: config.height / 2

			context.textBaseline = 'middle'
			context.fillText(string, x, y)
		}

		const imgData = ctx.getImageData(0, 0, config.width, config.height)

		if (config.filter === 'grayscale')
			ctx.putImageData(grayscale(imgData), 0, 0)
		else if (config.filter === 'bw')
			ctx.putImageData(blackWhite(imgData), 0, 0)

		if (config.text) drawText(ctx, config.text)
		if (config.size) drawSize(ctx)

		const data = canvas.toDataURL()

		return config.tag
			? '<img src="' + data + '" alt="Placeholder Image" title="Placeholder Image">'
			: data
	}
}

if (canvas) fakesome.img = createImg(canvas)


// Add methods via fn for future compatibility
fakesome.fn = fakesome

if (isBrowser) {
	(window as unknown as {fakesome: Fakesome}).fakesome = fakesome
}

export default fakesome
