import assert from 'node:assert'
import fakesome from '../src/fakesome.ts'


// Register the type of the custom generator added in the `fn` tests
declare module '../src/fakesome.ts' {
	interface Generators {
		longWord(): string
	}
}


const repetitions = 100000
const fewRepetitions = 1000

function repeat(times: number | 'few' | 'often', func: () => void): void {
	const count = times === 'few'
		? fewRepetitions
		: times === 'often' ? repetitions : times

	for (let i = 0; i < count; i++)
		func()
}

function checkEquality(
	obj1: Record<string, unknown>,
	obj2: Record<string, unknown>,
): boolean {
	const keys1 = Object.keys(obj1)

	if (keys1.length !== Object.keys(obj2).length)
		return false

	return keys1.every(key => Object.hasOwn(obj2, key) && obj1[key] === obj2[key])
}

function hasDuplicates(array: unknown[]): boolean {
	return new Set(array).size !== array.length
}


describe('Fakesome', () => {

	describe('array()', () => {

		it('should generate different objects', () => {

			const array = fakesome.array(5).object({
				name: 'word()',
				age: 'integer(0, 100)',
				note: 'asdfasdf sfd asdf',
			})

			const elementEquality = array.some((element, index) =>
				index !== 0 && checkEquality(element, array[index - 1] ?? {}),
			)

			assert.equal(array.length, 5)
			assert(!elementEquality)
		})
	})


	describe('boolean()', () => {

		function testBoolean(probability?: number) {
			const expected = probability || 0.5
			let trueCounter = 0

			repeat('often', () => {
				const bool = fakesome.boolean(probability)

				assert(bool === true || bool === false)

				if (bool) trueCounter++
			})

			const diff = Math.abs(expected - trueCounter / repetitions)
			assert.equal(diff.toFixed(2), 0)
		}

		it('should return true or false with a 50:50 chance', () => {
			testBoolean()
		})

		it('should return true with a probability of 80%', () => {
			testBoolean(0.8)
		})
	})


	describe('character()', () => {

		it('should return a random unicode character', () => {
			repeat('often', () => {
				const value = fakesome.character()
				const charCode = value.charCodeAt(0)

				// TODO: Handle non-Basic-Multilingual-Plane characters
				assert(charCode >= 0 && charCode <= 65536, value)
			})
		})

		it('should return a random uppercase character', () => {
			repeat('often', () => {
				const value = fakesome.character(65, 90)

				assert.match(value, /^[A-Z]$/)
			})
		})
	})


	describe('color()', () => {

		it('should return a valid rgb color without transparency', () => {
			repeat('few', () => {
				assert.match(
					fakesome.color(),
					/^rgb\(([0-2]?[0-9]?[0-9], ){2}[0-2]?[0-9]?[0-9]\)$/,
				)
			})
		})

		it('should return a valid hsl color without transparency', () => {
			repeat('few', () => {
				assert.match(
					fakesome.color(null, null, 'hsl'),
					/^hsl\([0-3]?[0-9]?[0-9], ([0-1]?[0-9]?[0-9]%, )[0-1]?[0-9]?[0-9]%\)$/,
				)
			})
		})

		it('should return a valid hsla color with transparency', () => {
			repeat('few', () => {
				assert.match(
					fakesome.color(null, null, 'hsla'),
					/^hsla\([0-3]?[0-9]?[0-9], ([0-1]?[0-9]?[0-9]%, ){2}0\.[0-9]+\)$/,
				)
			})
		})

		it('should infer the type from the bounds', () => {
			repeat('few', () => {
				assert.match(
					fakesome.color('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)'),
					/^hsl\(/,
				)
				// Results in fractional rgb channels
				assert.match(
					fakesome.color('hsl(0, 0%, 0%)', 'hsl(0, 0%, 50%)'),
					/^hsl\(/,
				)
				assert.match(
					fakesome.color('hsla(0, 0%, 0%, 0.5)', 'hsl(0, 0%, 100%)'),
					/^hsla\(/,
				)
				assert.match(
					fakesome.color('rgb(0, 0, 0)', 'rgba(9, 9, 9, 0.5)'),
					/^rgba\(/,
				)
			})
		})

		it('should return a slightly transparent medium dark rgba color', () => {
			repeat('few', () => {
				assert.match(
					fakesome.color('rgba(50, 50, 50, 0.5)', 'rgb(99, 99, 99)'),
					/^rgba\(([5-9]?[0-9], ){3}(0|1)\.[5-9][0-9]*\)$/,
				)
			})
		})
	})


	describe('date()', () => {

		it('should return a random date between 1970-01-01 and today', () => {
			repeat('few', () => {
				const date = fakesome.date()

				assert(date >= new Date('1970-01-01') && date <= new Date())
				assert.match(date.toJSON(), /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/)
			})
		})

		it('should generate dates before 2000-01-01 as well', () => {
			const dates: Date[] = []

			repeat('few', () => {
				dates.push(fakesome.date())
			})

			assert(dates.some(date =>
				date >= new Date('1970-01-01') && date <= new Date('2000-01-01'),
			))
		})

		it('should return a random date between 2000-07-14 and 2010-12-21', () => {
			repeat('few', () => {
				const date = fakesome.date('2000-07-14', '2010-12-21')

				assert(date >= new Date('2000-07-14') && date <= new Date('2010-12-21'))
			})
		})
	})


	describe('datetime()', () => {

		it('should return a random datetime between 1970-01-01 and today', () => {
			repeat('few', () => {
				const date = fakesome.datetime()

				assert(date >= new Date('1970-01-01') && date <= new Date())
				assert.match(date.toJSON(), /^[-TZ:.\d]{24}$/)
			})
		})

		it('should return a random datetime between 2000-07-14 and 2010-12-21', () => {
			repeat('few', () => {
				const date = fakesome.datetime('2000-07-14', '2010-12-21')

				assert(date >= new Date('2000-07-14') && date <= new Date('2010-12-21'))
			})
		})
	})


	describe('element()', () => {

		it('should return a random array-element', () => {
			const array = ['a', 9, ['b'], {c: ''}]

			repeat('few', () => {
				const element = fakesome.element(array)

				assert(
					array.includes(element),
					JSON.stringify(element) + ' is not in ' + JSON.stringify(array),
				)
			})
		})
	})


	describe('float()', () => {

		const max = 1e12
		const min = -1e12

		it('should return a float', () => {
			const values: number[] = []

			repeat('few', () => {
				values.push(fakesome.float())
			})

			assert(values.some(value => !Number.isInteger(value)))
		})

		it('should return a value between including ' + max + ' and ' + min, () => {
			repeat('often', () => {
				const value = fakesome.float()
				assert(value >= min && value <= max, String(value))
			})
		})

		it('should return a value between including -10 and +10', () => {
			repeat('often', () => {
				const value = fakesome.float(-10, 10)
				assert(value >= -10 && value <= 10, String(value))
			})
		})
	})


	describe('fn', () => {

		const word = 'supercalifragilisticexpialidocious'

		fakesome.fn.longWord = () => word

		it('should be possible to register a new module', () => {
			assert.equal(fakesome.longWord(), word)
		})

		it('module should be chainable', () => {
			assert.deepEqual(fakesome.array(2).longWord(), [word, word])
		})
	})


	describe('img()', () => {

		it('should return an image', function () {
			const img = fakesome.img

			if (!img) {
				console.warn('\x1b[33mfakesome.img() is not available.\x1b[0m')
				this.skip()
			}

			repeat(10, () => {
				assert.match(img(), /^data:image\/png;base64,[a-zA-Z\d/+]+=*$/)
			})
		})
	})


	describe('imgURL()', () => {

		const conf = {width: 400, height: 250, grayscale: true}

		it('should return a valid url', () => {
			repeat('few', () => {
				assert.match(fakesome.imgURL(conf), /^https?:\/\/[\w-]+\.[\w/]+/)
			})
		})

		it('should return a reachable url', async () => {
			const value = fakesome.imgURL(conf)
			const res = await fetch(value, {redirect: 'follow'})

			assert.equal(res.status, 200, 'GET ' + value + ' ' + res.status)
		})
	})


	describe('integer()', () => {

		const max = Math.pow(2, 53) / 2 + 1
		const min = -max

		it('should return a value between including ' + max + ' and ' + min, () => {
			repeat('often', () => {
				const value = fakesome.integer()
				assert(value >= min && value <= max, String(value))
			})
		})

		it('should return a value between including -10 and +10', () => {
			repeat('often', () => {
				const value = fakesome.integer(-10, 10)
				assert(value >= -10 && value <= 10, String(value))
			})
		})
	})


	describe('maybe()', () => {

		function testMaybe(probability?: number) {
			const expected = probability || 0.5
			const times = 10000
			let nullCounter = 0

			repeat(times, () => {
				const value = fakesome.maybe(probability).integer(1, 9)

				assert(typeof value === 'number' || value === null)

				if (value === null) nullCounter++
			})

			const diff = Math.abs(expected - nullCounter / times)
			assert.equal(diff.toFixed(1), 0)
		}

		it('should return a integer or null with a 50:50 chance', () => {
			testMaybe()
		})

		it('should return a integer or null with a 20:80 chance', () => {
			testMaybe(0.8)
		})
	})


	describe('object()', () => {

		it('should generate an object', () => {
			repeat('few', () => {
				const value = fakesome.object({
					name: 'word()',
					age: 'integer(1, 100)',
					note: 'Awesome person',
				})

				assert.match(value.name, /^\w+$/)
				assert(value.age >= 1 && value.age <= 100, value.age + ' is not a valid age')
				assert.equal(value.note, 'Awesome person')
			})
		})

		it('should work recursively', () => {
			repeat('few', () => {
				const value = fakesome.object({
					name: 'John',
					father: {
						name: 'word()',
						age: 'integer(1, 100)',
					},
				})

				assert.equal(value.name, 'John')
				assert.match(value.father.name, /^\w+$/)
				assert(
					value.father.age >= 1 && value.father.age <= 100,
					value.father.age + ' is not a valid age',
				)
			})
		})

		it('should work with callback functions', () => {
			const value = fakesome.object({
				name: 'John',
				lastName: fakesome.word,
				age: () => 100,
				size: () => fakesome.float(1.5, 1.9),
			})

			assert.equal(value.name, 'John')
			assert.match(value.lastName, /^\w+$/)
			assert.equal(value.age, 100)
			assert(value.size >= 1.5 && value.size <= 1.9, String(value.size))
		})

		it('should not modify the schema', () => {
			const schema = {name: 'word()'}

			fakesome.object(schema)

			assert.deepEqual(schema, {name: 'word()'})
		})
	})


	describe('string()', () => {

		it('should return a random sequence of 10 lowercase ascii characters', () => {
			repeat('few', () => {
				assert.match(fakesome.string(), /^[a-z]{10}$/)
			})
		})

		it('should return a random sequence of 50 uppercase ascii characters', () => {
			repeat('few', () => {
				assert.match(
					fakesome.string('ABCDEFGHIJKLMNOPQRSTUVW'.split(''), 50),
					/^[A-Z]{50}$/,
				)
			})
		})
	})


	describe('sentence()', () => {

		it('should return a sentence with 5 to 25 words', () => {
			repeat('few', () => {
				const value = fakesome.sentence()
				const length = value.split(' ').length

				assert(length >= 5 && length <= 25, 'Length should be 5-25 and not ' + length)
				assert.match(value, /^[A-Z][\w ]+\.$/)
			})
		})

		it('should return a sentence with 2 to 10 words', () => {
			repeat('few', () => {
				const value = fakesome.sentence(2, 10)
				const length = value.split(' ').length

				assert(length >= 2 && length <= 10, 'Length should be 2-10 and not ' + length)
				assert.match(value, /^[A-Z][\w ]+\.$/)
			})
		})
	})


	describe('sentences()', () => {

		it('should return one sentence by default', () => {
			repeat('few', () => {
				const value = fakesome.sentences()

				assert.match(value, /^[A-Z][\w ]+\.$/)
			})
		})

		it('should return 3 sentences with 2 to 10 words', () => {
			repeat('few', () => {
				const sentences = fakesome.sentences(3, 2, 10)
					.slice(0, -1)
					.split('. ')

				assert.equal(sentences.length, 3)

				for (const sentence of sentences) {
					const length = sentence.split(' ').length

					assert(length >= 2 && length <= 10, 'Length should be 2-10 and not ' + length)
					assert.match(sentence, /^[A-Z][\w ]+$/)
				}
			})
		})
	})


	describe('text()', () => {

		it('should return a text with 50-100 characters', () => {
			repeat('few', () => {
				const value = fakesome.text()

				assert(
					value.length >= 50 && value.length <= 100,
					'Length should be 50-100 and not ' + value.length,
				)
				assert.match(value, /^[\w ]+$/)
			})
		})

		it('should return a text with 20-40 characters', () => {
			repeat('few', () => {
				const value = fakesome.text(20, 40)

				assert(
					value.length >= 20 && value.length <= 40,
					'Length should be 20-40 and not ' + value.length,
				)
				assert.match(value, /^[\w ]+$/)
			})
		})
	})


	describe('unique()', () => {

		it('should return only unique values', () => {
			const values = [fakesome.unique(true).integer(0, 9)]

			for (let i = 1; i < 8; i++)
				values.push(fakesome.unique().integer(0, 9))

			assert.equal(values.length, 8)
			assert(!hasDuplicates(values), String(values))
		})

		it('should be resetted', () => {
			const values = [fakesome.unique(true).integer(0, 9)]

			for (let i = 1; i < 10; i++)
				values.push(fakesome.unique().integer(0, 9))

			assert.equal(values.length, 10)
			assert(!hasDuplicates(values), String(values))
		})

		it('should keep one array of values per method', () => {
			const domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

			fakesome.unique(true).integer(0, 9)
			for (let i = 1; i < 10; i++)
				fakesome.unique().integer(0, 9)

			// The integer domain is exhausted, but element() has its own scope
			const elements = domain.map(() => fakesome.unique().element(domain))

			assert(!hasDuplicates(elements), String(elements))
		})

		it('should throw Error if unique value can\'t be generated', () => {
			fakesome.unique(true).integer(0, 5)

			assert.throws(
				() => {
					// Domain only contains 6 values
					for (let i = 0; i < 6; i++)
						fakesome.unique().integer(0, 5)
				},
				/Unique value couldn't be generated/,
			)
		})
	})


	describe('word()', () => {

		it('should return a random word with 1 to 20 characters', () => {
			repeat('few', () => {
				const value = fakesome.word()

				assert(
					value.length >= 1 && value.length <= 20,
					'Length is not between 1 to 20 but ' + value.length,
				)
				assert.match(value, /^\w+$/)
			})
		})

		it('should return a random word with 5 to 10 characters', () => {
			repeat('few', () => {
				const value = fakesome.word(5, 10)

				assert(
					value.length >= 5 && value.length <= 10,
					'Length is not between 5 to 10 but ' + value.length,
				)
				assert.match(value, /^\w+$/)
			})
		})
	})


	describe('words()', () => {

		it('should return 10 random space separated words with 1 to 20 characters', () => {
			repeat('few', () => {
				const value = fakesome.words()

				assert.equal(value.split(' ').length, 10)
				assert.match(value, /^[\w ]+$/)
			})
		})

		it('should return 5 random space separated words with 2 to 4 characters', () => {
			repeat('few', () => {
				const value = fakesome.words(5, 2, 4)

				assert.equal(value.split(' ').length, 5)
				assert.match(value, /^[\w ]+$/)
			})
		})

		it('should not contain accidentally concatenated words', () => {
			// Longest words in the lorem text have 10 characters
			assert.throws(() => fakesome.word(11, 30), RangeError)
		})
	})
})
