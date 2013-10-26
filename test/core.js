var assert = require("assert"),
	fakesome = require('../src/fakesome'),
	repetitions = 100000,
	i

describe('Fakesome', function () {

	describe('boolean()', function () {

		function testBoolean(probability) {

			var bool,
				trueCounter = 0,
				falseCounter = 0,
				diff

			probability = probability || 0.5

			for (i = 0; i < repetitions; i++) {

				bool = fakesome.boolean(probability)
				assert(bool === true || bool === false)

				if (bool) trueCounter++
				else falseCounter++
			}

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

	describe('integer()', function () {

		var max = Math.pow(2, 53) / 2 + 1,
			min = -max

		it('should return a value between including ' + max + ' and ' + min, function () {

			var value

			for (i = 0; i < repetitions; i++) {
				value = fakesome.integer()
				assert(value >= min && value <= max, value)
			}
		})


		it('should return a value between including -10 and +10', function () {

			var value

			for (i = 0; i < repetitions; i++) {
				value = fakesome.integer(-10, 10)
				assert(value >= -10 && value <= 10, value)
			}
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

			for (i = 0; i < length; i++) {
				values.push(fakesome.unique().integer(0, 9))
			}

			assert.equal(values.length, length)
			assert(!testForDuplicates(values), values)
		})

		it('should be resetted', function () {

			var values = [fakesome.unique(true).integer(0, 9)]

			for (i = 1; i < length; i++) {
				values.push(fakesome.unique().integer(0, 9))
			}

			assert.equal(values.length, length)
			assert(!testForDuplicates(values), values)
		})

		it('should throw Error if unique value can\'t be generated', function () {

			var values = []

			assert.throws(function(){
				for (i = 0; i < length; i++) {
					values.push(fakesome.unique().integer(0, 5))
				}
			}, Error)
		})
	})
})
