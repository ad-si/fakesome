var assert = require("assert"),
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


describe('Fakesome', function () {


	describe('array()', function () {

		it('should generate different objects', function () {

			var array,
				elementEquality

			array = fakesome.array(5).data({
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


	describe('data()', function () {

		it('should have different values ', function () {


			/*console.log(fakesome.array(5).data({
			 name: 'word()',
			 age: 'integer(0, 100)',
			 note: 'asdfasdf sfd asdf '
			 }))*/

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


	describe('unique()', function () {

		var length = 8

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

			var values = []

			for (i = 0; i < length; i++)
				values.push(fakesome.unique().integer(0, 9))

			assert.equal(values.length, length)
			assert(!testForDuplicates(values), values)
		})


		it('should be resetted', function () {

			var values = [fakesome.unique(true).integer(0, 9)]

			for (i = 1; i < length; i++)
				values.push(fakesome.unique().integer(0, 9))

			assert.equal(values.length, length)
			assert(!testForDuplicates(values), values)
		})


		it('should throw Error if unique value can\'t be generated', function () {

			var values = []

			assert.throws(function () {
				for (i = 0; i < length; i++)
					values.push(fakesome.unique().integer(0, 5))
			}, Error, values)
		})
	})
})