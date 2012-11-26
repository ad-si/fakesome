(function (window, document, undefined) {


	var tld = ['com', 'de', 'org', 'net'],
		syllables = [
			['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'z', 'do'],
			['nu', 'ri', 'mi'],
			['an', 'el', 'us', 'mas']
		];

	function number(min, max) {

		if (max === undefined) {
			if (min === undefined)
				return Math.random();

			max = min;
			min = 0;
		}

		return min + Math.round(Math.random() * (max - min));
	}

	fakesome = {
		number: number,
		normal: function (min, max) {
			if (max === undefined) {
				if (min === undefined)
					return (Math.random() + Math.random()) / 2;

				max = min;
				min = 0;
			}

			return (min + Math.round(Math.random() * (max - min))) + (min + Math.round(Math.random() * (max - min))) / 2;
		},
		name: function () {
			var name = '';

			syllables.forEach(function (syl) {
				name += syl[number(syl.length)];
			});

			return name;
		},

		domain: function () {
			return this.name() + '.com'
		}
	}


}(window, document));