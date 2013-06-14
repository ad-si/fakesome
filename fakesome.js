!function(window, document, undefined) {

	var tld = ['com', 'de', 'org', 'net'],
		syllables = [
			['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'z', 'do'],
			['nu', 'ri', 'mi'],
			['an', 'el', 'us', 'mas']
		],
		lorem = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."


	function randomNumber(min, max) {

		if(max === undefined) {
			if(min === undefined)
				return Math.random();

			max = min;
			min = 0;
		}

		return min + Math.round(Math.random() * (max - min));
	}

	fakesome = {

		number: randomNumber,

		normal: function(min, max) {
			if(max === undefined) {
				if(min === undefined)
					return (Math.random() + Math.random()) / 2;

				max = min;
				min = 0;
			}

			return (min + Math.round(Math.random() * (max - min))) + (min + Math.round(Math.random() * (max - min))) / 2;
		},

		name: function() {
			var name = '';

			syllables.forEach(function(syl) {
				name += syl[randomNumber(syl.length)];
			});

			return name;
		},

		url: function() {
			return this.name() + '.com'
		},

		matrix: function(width, height, valueSet) {

			var a,
				i,
				matrix = []

			valueSet = valueSet || [0, 1]

			for(i = 1; i <= height; i++) {
				for(a = 1; a <= width; a++) {

					matrix.push(valueSet[randomNumber(valueSet.length - 1)])
				}
			}

			return matrix

		},

		text: function(quantity) {
			return lorem
				.split(" ")
				.slice(0, quantity - 1)
				.join(" ")
		},

		date: function(startDate, endDate) {

		},

		email: function() {

		},

		imgURL: function(width, height, topic) {

			return 'http://lorempixel.com/' + width + '/' + height + '/' + topic

		}
	}


}(window, document)