// fakesome {{ VERSION }} by Adrian Sieber (adriansieber.com)

!function (window, document) {

	var tld = ['com', 'de', 'org', 'net'],
		syllables = [
			['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'z', 'do'],
			['nu', 'ri', 'mi'],
			['an', 'el', 'us', 'mas']
		],
		lorem = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."


	function randomInt(min, max) {

		// (2^53/2) - 1
		if (min === undefined || min === null) min = -4503599627370495
		if (max === undefined || max === null) max = 4503599627370495

		min = Number(min)
		max = Number(max)

		if (typeof(min) !== "number")
			throw new TypeError("Min must be a number.")
		if (typeof(max) !== "number")
			throw new TypeError("Max must be a number.")

		if (!isInt(min))
			throw new TypeError("Min must be an Integer. Not " + min)

		if (!isInt(max))
			throw new TypeError("Max must be an Integer. Not " + max)

		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function randomFloat(min, max, decimalPlaces) {

		if (min === undefined || min === null) min = -1e12
		if (max === undefined || max === null) max = 1e12


		if (decimalPlaces)
			return (Math.random() * (max - min) + min).toFixed(decimalPlaces)

		else
			return Math.random() * (max - min) + min
	}

	function isInt(number) {
		return Number(number) % 1 === 0
	}

	// http://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
	function decimalPlaces(number) {

		var s = "" + (+number),
			match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s)

		if (!match) return 0

		return Math.max(0, (match[1] == '0' ? 0 : (match[1] || '').length) - (match[2] || 0))
	}

	// TODO: Feature to make the return of values optional (inclusive weight argument)

	window.fakesome = {

		config: function (object) {

			var defaultValues = {
				outputFormat: "JSON"
			}

		},

		boolean: function (chanceOfTrue) {

			chanceOfTrue = chanceOfTrue || 0.5

			if (typeof(chanceOfTrue) !== "number")
				throw new TypeError("ChanceOfTrue must be a number and not a " + typeof(chanceOfTrue))

			if (chanceOfTrue >= 0 && chanceOfTrue <= 1)
				return Boolean(Math.random() < chanceOfTrue)
			else
				throw new RangeError("Must be a number between 0 and 1")
		},

		string: function (alphabet, length) {

			if (typeof(alphabet) == "String")
				alphabet = alphabet.split("")


		},

		number: function (min, max, filter) {

			var randInt

			if (filter && typeof(filter) != 'function')
				throw new TypeError('Filter must be a function.')

			/*randInt{
			 randInt = random(min, max)

			 }while(!filter())*/

			return randomFloat(min, max)
		},

		integer: function (min, max, filter) {

			var randInt

			if (filter) {

				if (typeof(filter) != 'function')
					throw new TypeError('Filter must be a function.')

				do {
					randInt = randomInt(min, max)

				} while (!filter(randInt))

				return randInt
			}

			return randomInt(min, max)
		},

		float: randomFloat,

		name: function () {
			var name = ''

			syllables.forEach(function (syl) {
				name += syl[randomNumber(syl.length)]
			})

			return name
		},

		url: function () {
			return this.name() + '.com'
		},

		matrix: function (width, height, valueSet) {

			var a,
				i,
				matrix = []

			valueSet = valueSet || [0, 1]

			for (i = 1; i <= height; i++) {
				for (a = 1; a <= width; a++) {

					matrix.push(valueSet[randomNumber(valueSet.length - 1)])
				}
			}

			return matrix

		},

		text: function (quantity) {
			return lorem
				.split("")
				.slice(0, quantity)
				.join("")
		},

		character: this.text,

		word: function (quantity) {
			return lorem
				.split(" ")
				.slice(0, quantity)
				.join(" ")
		},

		sentence: function (quantity) {
			return lorem
				.split(". ")
				.slice(0, quantity)
				.join(". ")
		},

		date: function (startDate, endDate) {

		},

		email: function () {

		},

		imgURL: function (width, height, topic) {

			return 'http://lorempixel.com/' + width + '/' + height + '/' + topic

		},

		object: function (scheme, number) {

			var obj = {}

			for (var key in scheme) {
				if (scheme.hasOwnProperty(key)) {


				}
			}

		}

	}


}(window, document)
