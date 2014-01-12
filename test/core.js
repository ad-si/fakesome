var assert = require("assert"),
	request = require('request'),
	fakesome = require('../src/fakesome'),
	repetitions = 100000,
	fewRepetitions = 1000,
	i

function repeat(number, func) {

	if (number === 'few') number = fewRepetitions
	if (number === 'often') number = repetitions

	for (var i = 0; i < number; i++)
		func()
}

function checkEquality(obj1, obj2) {

	if (Object.keys(obj1).length !== Object.keys(obj1).length)
		return false

	for (var i in obj1)
		if (obj1.hasOwnProperty(i) &&
			(!obj2.hasOwnProperty(i) || obj1[i] !== obj2[i]))
			return false

	return true
}

function toType(obj) {

	return ({})
		.toString
		.call(obj)
		.match(/\s([a-zA-Z]+)/)[1]
		.toLowerCase()
}


describe('Fakesome', function () {


	describe('array()', function () {

		it('should generate different objects', function () {

			var array,
				elementEquality

			array = fakesome.array(5).object({
				name: 'word()',
				age: 'integer(0, 100)',
				note: 'asdfasdf sfd asdf'
			})

			elementEquality = array.some(function (element, index) {

				if (index === 0) return false

				return checkEquality(element, array[index - 1])
			})

			assert(!elementEquality)
		})
	})


	describe('boolean()', function () {

		function testBoolean(probability) {

			var bool,
				trueCounter = 0,
				falseCounter = 0,
				diff

			probability = probability || 0.5

			repeat('often', function () {

				if (probability === 0.5)
					bool = fakesome.boolean()
				else
					bool = fakesome.boolean(probability)

				assert(bool === true || bool === false)

				if (bool) trueCounter++
				else falseCounter++
			})

			diff = Math.abs(probability - trueCounter / repetitions)
			assert.equal(diff.toFixed(2), 0)
		}

		it('should return true or false with a 50:50 chance', function () {
			testBoolean()
		})

		it('should return true with a probability of 80%', function () {
			testBoolean(0.8)
		})
	})


	describe('character()', function () {

		it('should return a random unicode character', function () {

			repeat('often', function () {
				var value = fakesome.character(),
					charCode = value.charCodeAt(0)

				// TODO: Handle non-Basic-Multilingual-Plane characters
				assert(charCode >= 0 && charCode <= 65536, value)
			})
		})

		it('should return a random uppercase character', function () {

			repeat('often', function () {
				var value = fakesome.character(65, 90)

				assert(value.search(/[A-Z]/) === 0, value)
			})
		})
	})


	describe('color()', function () {

		it('should return a valid rgb color without transparency', function () {

			var pattern = /^rgb\(([0-2]?[0-9]?[0-9], ){2}[0-2]?[0-9]?[0-9]\)$/

			repeat('few', function () {

				var color = fakesome.color()

				assert.equal(color.search(pattern), 0, color)
			})
		})


		it('should return a valid hsla color without transparency', function () {

			var pattern = /^hsla\([0-3]?[0-9]?[0-9], ([0-1]?[0-9]?[0-9]%, ){2}1\)$/

			repeat('few', function () {

				var color = fakesome.color(null, null, 'hsla')

				assert.equal(color.search(pattern), 0, color)
			})
		})


		it('should return a slightly transparent medium dark rgba color', function () {

			var pattern = /^rgba\(([5-9]?[0-9], ){3}(0|1)\.[5-9][0-9]*\)$/

			repeat('few', function () {

				var color = fakesome.color('rgba(50, 50, 50, 0.5)', 'rgb(99, 99, 99)')

				assert.equal(color.search(pattern), 0, color)
			})
		})
	})


	describe('date()', function () {

		it('should return a random date between 1970-01-01 and today', function () {

			repeat('few', function () {

				var date = fakesome.date()

				assert(date >= new Date('1970-01-01') && date <= new Date())
				assert(date.toJSON().search(/^[-TZ:\.\d]{24}$/) == 0, date.toJSON())
			})
		})


		it('should generate dates before 2000-01-01 as well', function () {

			var dates  = [],
				hasDateBefore2000

			repeat('few', function () {
				dates.push(fakesome.date())
			})

			hasDateBefore2000 = dates.some(function(date){
				return date >= new Date('1970-01-01') && date <= new Date('2000-01-01')
			})

			assert(hasDateBefore2000)
		})


		it('should return a random date between 2000-07-14 and 2010-12-21', function () {

			repeat('few', function () {

				var date = fakesome.date('2000-07-14', '2010-12-21')

				assert(date >= new Date('2000-07-14') && date <= new Date('2010-12-21'))
			})
		})



	})


	describe('datetime()', function () {

		it('should return a random datetime between 1970-01-01 and today', function () {

			repeat('few', function () {

				var date = fakesome.date()

				assert(date >= new Date('1970-01-01') && date <= new Date())
				assert(date.toJSON().search(/^[-TZ:\.\d]{24}$/) == 0, date.toJSON())
			})
		})


		it('should return a random datetime between 2000-07-14 and 2010-12-21', function () {

			repeat('few', function () {

				var date = fakesome.date('2000-07-14', '2010-12-21')

				assert(date >= new Date('2000-07-14') && date <= new Date('2010-12-21'))
			})
		})
	})


	describe('element()', function () {

		it('should return a random array-element', function () {

			var array = ['a', 9, ['b'], {c: ''}]

			repeat('few', function () {

				var element = fakesome.element(array),
					message = JSON.stringify(element) + ' is not in ' + JSON.stringify(array)

				assert(array.indexOf(element) !== -1, message)
			})
		})
	})


	describe('float()', function () {

		var max = 1e12,
			min = -1e12

		it('should return a float', function () {

			repeat('often', function () {
				var value = fakesome.float()
				assert(String(value).search('.') !== -1, value)
			})
		})

		it('should return a value between including ' + max + ' and ' + min, function () {

			repeat('often', function () {
				var value = fakesome.float()
				assert(value >= min && value <= max, value)
			})
		})

		it('should return a value between including -10 and +10', function () {

			repeat('often', function () {
				var value = fakesome.float(-10, 10)
				assert(value >= -10 && value <= 10, value)
			})
		})
	})


	describe('fn', function () {

		var word = 'supercalifragilisticexpialidocious'

		fakesome.fn.longWord = function () {
			return word
		}

		it('should be possible to register a new module', function () {

			assert(fakesome.longWord() === 'supercalifragilisticexpialidocious')
		})

		it('module should be chainable', function () {

			var value = fakesome.array(2).longWord()

			assert(value[0] === word && value[1] === word)
		})
	})


	describe('img()', function () {

		it('should return an image', function () {

			repeat(10, function () {

				var value = fakesome.img()

				assert(value.search(/^data:image\/png;base64,[a-zA-Z\d\/\+]+=*$/) === 0, value)
			})
		})

	})


	describe('imgURL()', function () {

		it('should return a valid url', function () {

			repeat('few', function () {

				var value = fakesome.imgURL({
						"width": 400,
						"height": 250,
						"grayscale": true
					}),
					pattern = /http(s)?:\/\/[\w-]+\.[\w\/]+/

				assert(value.search(pattern) === 0, value)
			})
		})


		it('should return a reachable url', function (done) {

			var value = fakesome.imgURL({
				"width": 400,
				"height": 250,
				"grayscale": true
			})


			request.head(value, function (error, res) {

				if (error) throw error

				assert(res.statusCode === 200, 'GET ' + value + ' ' + res.statusCode)

				done()
			})
		})

	})


	describe('integer()', function () {

		var max = Math.pow(2, 53) / 2 + 1,
			min = -max

		it('should return a value between including ' + max + ' and ' + min, function () {

			repeat('often', function () {
				var value = fakesome.integer()
				assert(value >= min && value <= max, value)
			})
		})


		it('should return a value between including -10 and +10', function () {

			repeat('often', function () {
				var value = fakesome.integer(-10, 10)
				assert(value >= -10 && value <= 10, value)
			})
		})

	})


	describe('maybe()', function () {


		function testMaybe(probability) {

			var value,
				repetitions = 10000,
				numberCounter = 0,
				nullCounter = 0,
				diff

			probability = probability || 0.5

			repeat(repetitions, function () {

				if (probability === 0.5)
					value = fakesome.maybe().integer(1, 9)
				else
					value = fakesome.maybe(probability).integer(1, 9)

				assert(typeof value === 'number' || value === null)

				if (typeof value === 'number') numberCounter++
				else nullCounter++
			})

			diff = Math.abs(probability - nullCounter / repetitions)

			assert.equal(diff.toFixed(1), 0)
		}

		it('should return a integer or null with a 50:50 chance', function (done) {

			testMaybe()
			done()
		})

		it('should return a integer or null with a 20:80 chance', function (done) {

			testMaybe(0.8)
			done()
		})
	})


	describe('object()', function () {

		it('should generate an object', function () {

			repeat('few', function () {

				var value = fakesome.object({
					name: 'word()',
					age: 'integer(1, 100)',
					note: 'Awesome person'
				})

				assert(value.name)
				assert(value.age)
				assert(value.note)

				assert(value.name.search(/^\w+$/) === 0, value.name + ' is not a valid name')
				assert(value.age >= 1 && value.age <= 100, value.age + ' is not a valid age')
				assert(value.note.search(/^[\w ]+$/) === 0, value.note + ' is not a valid note')
			})
		})

		it('should work recursively', function () {

			repeat('few', function () {

				var value = fakesome.object({
					name: 'John',
					father: {
						name: 'word()',
						age: 'integer(1, 100)'
					}
				})

				assert(value.name)
				assert(value.father)

				assert(value.father.name.search(/^\w+$/) === 0, value.father.name + ' is not a valid name')
				assert(value.father.age >= 1 && value.father.age <= 100, value.father.age + ' is not a valid age')
			})
		})


		it('should work with callback functions', function () {

			var value = fakesome.object({
				name: 'John',
				lastName: fakesome.word,
				age: function () {
					return 100
				},
				size: function(){
					return fakesome.float(1.5,1.9)
				}
			})

			assert(value.name)
			assert(value.lastName)
			assert(value.age)
			assert(value.size)

			assert(value.lastName.search(/^\w+$/) == 0, value.lastName)
			assert.equal(value.age, 100, value.age)
			assert(value.size >= 1.5 && value.size <= 1.9, value.size)
		})
	})


	describe('string()', function () {

		it('should return a random sequence of 10 lowercase ascii characters', function () {

			repeat('few', function () {

				var value = fakesome.string()

				assert(value.length === 10, 'Length should be 10 and not ' + value.length)
				assert(value.search(/^[a-z]+$/) === 0, value + ' contains not just a-z')
			})
		})

		it('should return a random sequence of 50 uppercase ascii characters', function () {

			repeat('few', function () {

				var value = fakesome.string('ABCDEFGHIJKLMNOPQRSTUVW'.split(''), 50)

				assert(value.length === 50, 'Length should be 50 and not ' + value.length)
				assert(value.search(/^[A-Z]+$/) === 0, value + ' contains not just a-z')
			})
		})

	})


	describe('sentence()', function () {

		it('should return a sentence with 5 to 25 words', function () {

			repeat('few', function () {

				var value = fakesome.sentence(),
					length = value.split(' ').length

				assert(length >= 5 && length <= 25, 'Length should be 5-25 and not ' + length)
				assert(value.search(/^[\w ]+\.$/) === 0, value + ' contains invalid characters')
			})
		})

		it('should return a sentence with 2 to 10 words', function () {

			repeat('few', function () {

				var value = fakesome.sentence(2, 10),
					length = value.split(' ').length

				assert(length >= 2 && length <= 10, 'Length should be 2-10 and not ' + length)
				assert(value.search(/^[\w ]+\.$/) === 0, value + ' contains invalid characters')
			})
		})
	})


	describe('sentences()', function () {

		it('should return a sentence with 5 to 25 words', function () {

			repeat('few', function () {

				var value = fakesome.sentence(),
					length = value.split(' ').length

				assert(length >= 5 && length <= 25, 'Length should be 5-25 and not ' + length)
				assert(value.search(/^[\w ]+\.$/) === 0, value + ' contains invalid characters')
			})
		})

		it('should return a sentence with 2 to 10 words', function () {

			repeat('few', function () {

				var value = fakesome.sentence(2, 10),
					length = value.split(' ').length

				assert(length >= 2 && length <= 10, 'Length should be 2-10 and not ' + length)
				assert(value.search(/^[\w ]+\.$/) === 0, value + ' contains invalid characters')
			})
		})
	})


	describe('text()', function () {

		it('should return a text with 50-100 characters', function () {

			repeat('few', function () {

				var value = fakesome.text()

				assert(value.length >= 50 && value.length <= 100, 'Length should be 50-100 and not ' + value.length)
				assert(value.search(/^[\w ]+$/) === 0, value + ' contains invalid characters')
			})
		})

		it('should return a text with 20-40 characters', function () {

			repeat('few', function () {

				var value = fakesome.text(20, 40)

				assert(value.length >= 20 && value.length <= 40, 'Length should be 20-40 and not ' + value.length)
				assert(value.search(/^[\w ]+$/) === 0, value + ' contains invalid characters')
			})
		})

	})


	describe('unique()', function () {


		function testForDuplicates(array) {

			var obj = {},
				i

			for (i = 0; i < array.length; i++) {

				if (obj.hasOwnProperty(array[i]))
					return true

				obj[array[i]] = 0
			}

			return false
		}


		it('should return only unique values', function () {

			var values = [],
				length = 8

			for (i = 0; i < length; i++)
				values.push(fakesome.unique().integer(0, 9))

			assert.equal(values.length, length)
			assert(!testForDuplicates(values), values)
		})


		it('should be resetted', function () {

			var length = 8,
				values = [fakesome.unique(true).integer(0, 9)]

			for (i = 1; i < length; i++)
				values.push(fakesome.unique().integer(0, 9))

			assert.equal(values.length, length)
			assert(!testForDuplicates(values), values)
		})


		it('should keep one array of values per method', function () {

			var length = 10,
				values = [fakesome.unique(true).integer(0, 9)]

			for (i = 1; i < length; i++)
				values.push(fakesome.unique().integer(0, 9))

			fakesome.unique().element([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

			//assert.equal(values.length, length)
			//assert(!testForDuplicates(values), values)
		})


		it('should throw Error if unique value can\'t be generated', function () {

			var values = []

			assert.throws(function () {
				for (i = 0; i < length; i++)
					values.push(fakesome.unique().integer(0, 5))
			}, Error, values)
		})
	})


	describe('word()', function () {

		it('should return a random word with 1 to 20 characters', function () {

			repeat('few', function () {

				var value = fakesome.word()

				assert(value.length >= 1 && value.length <= 20, 'Length is not between 1 to 20 but ' + value.length)
				assert(value.search(/^\w+$/) === 0, value + ' contains not just letters')
			})
		})

		it('should return a random word with 5 to 10 characters', function () {

			repeat('few', function () {

				var value = fakesome.word(5, 10)

				assert(value.length >= 5 && value.length <= 10, 'Length is not between 5 to 10 but ' + value.length)
				assert(value.search(/^\w+$/) === 0, value + ' contains not just letters')
			})
		})

	})


	describe('words()', function () {

		it('should return 10 random space separated words with 1 to 20 characters', function () {

			repeat('few', function () {

				var value = fakesome.words(),
					length = value.split(' ').length

				assert(length === 10, 'Not 10 words but ' + length)
				assert(value.search(/^[\w ]+$/) === 0, value + ' contains not just letters and whitespace')
			})
		})

		it('should return 5 random space separated words with 2 to 4 characters', function () {

			repeat('few', function () {

				var value = fakesome.words(5, 2, 4),
					length = value.split(' ').length

				assert(length === 5, 'Not 5 words but ' + length)
				assert(value.search(/^[\w ]+$/) === 0, value + ' contains not just letters')
			})
		})

	})

})
