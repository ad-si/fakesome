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

	function decimalPlaces(number) {

		// http://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of

		var s = "" + (+number),
			match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s)

		if (!match) return 0

		return Math.max(0, (match[1] == '0' ? 0 : (match[1] || '').length) - (match[2] || 0))
	}

	function randomColor(type, min, max) {

		var string = '',
			value

		min = Color(min) || Color('rgba(0,0,0,0)')
		max = Color(max) || Color('rgba(255,255,255,1)')
		type = type || 'rgb'
		value = Color()
			.rgb([
				randomInt(min.red(), max.red()),
				randomInt(min.green(), max.green()),
				randomInt(min.blue(), max.blue()),
			])
			.alpha(randomFloat(min.alpha(), max.alpha()))


		if (type == 'rgb' || type == 'rgba')
			string = value.rgbaString()

		else
			throw new TypeError(type + 'is not allowed as a type value.')


		return string
	}

	function filterImage(filter, image) {


		for (var i = 2; i < arguments.length; i++) {
			args.push(arguments[i])
		}

		return filter.apply(null, args)
	}

	// TODO: Feature to make the return of values optional (inclusive weight argument)

	window.fakesome = {

		boolean: function (chanceOfTrue) {

			chanceOfTrue = chanceOfTrue || 0.5

			if (typeof(chanceOfTrue) !== "number")
				throw new TypeError("ChanceOfTrue must be a number and not a " + typeof(chanceOfTrue))

			if (chanceOfTrue >= 0 && chanceOfTrue <= 1)
				return Boolean(Math.random() < chanceOfTrue)
			else
				throw new RangeError("Must be a number between 0 and 1")
		},

		character: function (min, max) {

			min = min || 32
			max = max || 1114112

			return String.fromCharCode(randomInt(max, min))
		},

		config: function (object) {

			var defaultValues = {
				outputFormat: "JSON"
			}

		},

		color: randomColor,

		date: function (startDate, endDate) {

		},

		email: function () {

		},

		float: function (min, max, filter) {

			var randInt

			if (filter) {

				if (typeof(filter) != 'function')
					throw new TypeError('Filter must be a function.')

				do {
					randInt = randomFloat(min, max)

				} while (!filter(randInt))

				return randInt
			}

			return randomFloat(min, max)
		},

		img: function (conf) {

			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				data,
				key,
				elementSize,
				defaults = {
					tag: false,
					width: 100,
					height: 100,
					elements: 100,
					bgColor: 'white',
					elementSize: 50,
					minColor: 'rgba(0,0,0,0)',
					maxColor: 'rgba(255,255,255,1)'
				},
				a, i

			conf = conf || {}

			for (key in defaults)
				if (defaults.hasOwnProperty(key))
					conf[key] = (conf[key] !== undefined) ? conf[key] : defaults[key]


			canvas.width = conf.width
			canvas.height = conf.height

			ctx.fillStyle = conf.bgColor
			ctx.fillRect(0, 0, conf.width, conf.width)

			for (a = 0; a < conf.elements; a++) {

				ctx.fillStyle = randomColor('rgba', conf.minColor, conf.maxColor)
				ctx.fillRect(
					randomInt(-conf.elementSize, conf.width),
					randomInt(-conf.elementSize, conf.height),
					randomInt(0, conf.elementSize),
					randomInt(0, conf.elementSize)
				)
			}

			function grayscale(imageData) {

				var d = imageData.data, r, g, b, v

				for (i = 0; i < d.length; i += 4) {

					r = d[i]
					g = d[i + 1]
					b = d[i + 2]

					d[i] = d[i + 1] = d[i + 2] = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)
				}

				return imageData
			}

			function blackWhite(imageData) {

				var d = imageData.data,
					threshold = 0.7,
					max = 0,
					min = 255,
					values = [],
					r, g, b, v

				for (i = 0; i < d.length; i += 4) {

					v = (0.2126 * d[i]) + (0.7152 * d[i + 1]) + (0.0722 * d[i + 2])

					if (v > max) max = v
					if (v < min) min = v

					values[i] = v
				}

				threshold = ((min + max) / 2)


				for (i = 0; i < d.length; i += 4) {

					d[i] = d[i + 1] = d[i + 2] = (values[i] >= threshold) ? 255 : 0
				}

				return imageData
			}


			var imgData = ctx.getImageData(0, 0, conf.width, conf.height)

			if (conf.filter === 'grayscale')
				ctx.putImageData(grayscale(imgData), 0, 0)

			else if (conf.filter === 'bw')
				ctx.putImageData(blackWhite(imgData), 0, 0)


			if (conf.text) {

				!function () {

					var textString,
						fontSize,
						textWidth,
						textHeight,
						x,
						y

					textString = (conf.text === true) ? conf.width + '×' + conf.height : conf.text

					fontSize = Math.min((conf.width / textString.length), conf.height * 0.8),

					// TODO: Check background color (histogram) and choose text color accordingly
					ctx.fillStyle = 'rgba(0,0,0,0.7'
					ctx.font = 'bold ' + fontSize + "px Arial"

					textWidth = ctx.measureText(textString).width

					x = (conf.width - textWidth) / 2
					y = conf.height / 2

					ctx.textBaseline = "middle"
					ctx.fillText(textString, x, y)
				}()

			}


			data = canvas.toDataURL()

			if (conf.tag)
				return '<img src="' + data + '" alt="Placeholder Image" title="Placeholder Image">'
			else
				return data
		},

		imgURL: function (width, height, topic) {

			// http://placehold.it/
			// http://flickholdr.com/200/300/sea,sun/bw

			return 'http://lorempixel.com/' + width + '/' + height + '/' + topic

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

		name: function () {
			var name = ''

			syllables.forEach(function (syl) {
				name += syl[randomNumber(syl.length)]
			})

			return name
		},

		object: function (scheme, number) {

			var obj = {}

			for (var key in scheme) {
				if (scheme.hasOwnProperty(key)) {


				}
			}

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

		sentence: function (quantity) {
			return lorem
				.split(". ")
				.slice(0, quantity)
				.join(". ")
		},

		string: function (alphabet, length) {

			if (typeof(alphabet) == "String")
				alphabet = alphabet.split("")


		},

		text: function (quantity) {
			return lorem
				.split("")
				.slice(0, quantity)
				.join("")
		},

		url: function () {
			return this.name() + '.com'
		},

		word: function (quantity) {
			return lorem
				.split(" ")
				.slice(0, quantity)
				.join(" ")
		}
	}


}(window, document)
