var assert = require("assert"),
	fakesome = require('../fakesome'),
	repetitions = 100000,
	i = 0

describe('Fakesome', function () {

	describe('boolean()', function () {

		function testBoolean(probability){

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

	describe('integer()', function(){

		var max = Math.pow(2, 53)/2 + 1,
			min = - max

		it('should return a value between ' + max + ' and ' + min, function(){

			var value = fakesome.integer()

			assert(value > min && value < max, value)
		})

	})
})
