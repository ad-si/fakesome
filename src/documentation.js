var documentation = [
	{
		name: "config",
		desc: "Change settings.",
		args: [
			{
				desc: "Contains values to configure fakesome.",
				name: "configObject",
				properties: [
					{
						name: "outputFormat",
						type: ["JSON", "XML", "YAML"],
						desc: "Set the format of data generation.",
						default: "JSON"
					},
					{
						name: "generator",
						type: "function",
						desc: "Change the random number generator. (Is is also used to generate most of the other values).",
						default: "Math.rand()"
					}
				],
				required: true,
				type: "Object"
			}
		],
		tests: [
			{
				desc: "true or false",
				args: null,
				test: function (value) {
					return value === true || value === false
				}
			}
		]
	},
	{
		name: "boolean",
		desc: "return randomly true or false.",
		args: [
			{
				name: "chanceOfTrue",
				desc: "Set the likelihood of getting returned true.",
				type: "Number",
				required: false,
				default: 0.5
			}
		],
		return: "boolean",
		tests: [
			{
				desc: "true or false",
				args: null,
				test: function (value) {
					return value === true || value === false
				}
			},
			{
				desc: "70% probability of true",
				args: [0.7],
				test: function (value) {
					return value === true || value === false
				}
			}
		]
	},
	{
		name: "integer",
		desc: "Returns a random integer.<br><br>For unlimited large integers (string of digits) use <code>fakesome.string()</code>",
		args: [
			{
				name: "minimum",
				desc: "Set the lower boundary of the range",
				type: "Number",
				required: false,
				default: "-(2^53/2)+1"
			},
			{
				name: "maximum",
				desc: "Set the upper boundary of the range",
				type: "Number",
				required: false,
				default: "(2^53/2)-1"
			},
			{
				name: "filter",
				desc: "Function to filter the possible numbers. Receives the number as a parameter and returns true or false. <code>function(number)</code>",
				type: "Function",
				optional: true
			}
		],
		return: "Number",
		tests: [
			{
				desc: "Integers between inclusive 0 and 9",
				args: [],
				test: function (value) {
					return value >= 0 && value <= 1
				}
			},
			{
				desc: "Integers between 0 and 1000",
				args: [0, 1000],
				test: function (value) {
					return value >= 0 && value <= 1000
				}
			},
			{
				desc: "Integers between -1000 and 0",
				args: [-1000, 0],
				test: function (value) {
					return value >= -1000 && value <= 0
				}
			},
			{
				desc: "Prime Numbers between inclusive 2 and inclusive 1000",
				args: [2, 1000,
function(n){

	if (isNaN(n) || !isFinite(n) || n % 1 || n < 2)
		return false

	if (!(n % 2)) return (n === 2)
	if (!(n % 3)) return (n === 3)

	for (var i = 5; i <= Math.sqrt(n); i += 6) {
		if (n % i === 0) return false
		if (n % (i + 2) === 0) return false
	}

	return true
}
				],
				test: function (value) {
					return value >= -1000 && value <= 0
				}
			}
		]
	},
	{
		name: "float",
		desc: "Returns a random float between -1e12 and 1e12.",
		args: [
			{
				name: "minimum",
				desc: "Set the lower boundary of the range",
				type: "Number",
				required: false,
				default: "0"
			},
			{
				name: "maximum",
				desc: "Set the upper boundary of the range",
				type: "Number",
				required: false,
				default: "1"
			},
			{
				name: "filter",
				desc: "Function to filter the possible numbers",
				type: "Function",
				optional: true
			}
		],
		return: "Number",
		tests: [
			{
				desc: "Integers between inclusive 0 and 9",
				args: [],
				test: function (value) {
					return value >= 0 && value <= 1
				}
			},
			{
				desc: "Integers between 0 and 1000",
				args: [0, 1000],
				test: function (value) {
					return value >= 0 && value <= 1000
				}
			},
			{
				desc: "Integers between -1000 and 0",
				args: [-1000, 0],
				test: function (value) {
					return value >= -1000 && value <= 0
				}
			},
			{
				desc: "Prime Numbers between inclusive 2 and inclusive 1000",
				args: [2, 1000,
					function(n){

						if (isNaN(n) || !isFinite(n) || n % 1 || n < 2)
							return false

						if (!(n % 2)) return (n === 2)
						if (!(n % 3)) return (n === 3)

						for (var i = 5; i <= Math.sqrt(n); i += 6) {
							if (n % i === 0) return false
							if (n % (i + 2) === 0) return false
						}

						return true
					}
				],
				test: function (value) {
					return value >= -1000 && value <= 0
				}
			}
		]
	},
	{
		name: "phoneNumber",
		desc: ""
	},
	{
		name: "text",
		desc: ""
	},
	{
		name: "character",
		desc: ""
	},
	{
		name: "word",
		desc: "",
		args: [
			{
				name: "number",
				desc: "",
				type: "Number",
				default: 1,
				required: false
			}
		],
		tests: [
			{
				desc: "1 Word",
				args: null,
				test: function (value) {
					return typeof(value) == 'string' && value.search(" ") == -1
				}
			},
			{
				desc: "10 Words",
				args: [10],
				test: function (value) {
					return typeof(value) == 'string'
				}
			}
		]
	},
	{
		name: "sentence",
		desc: ""
	},
	{
		name: "name",
		desc: ""
	},
	{
		name: "address",
		desc: ""
	},
	{
		name: "zip",
		desc: ""
	},
	{
		name: "city",
		desc: ""
	},
	{
		name: "streetName",
		desc: ""
	},
	{
		name: "latitude",
		desc: ""
	},
	{
		name: "longitude",
		desc: ""
	},
	{
		name: "languageCode",
		desc: ""
	},
	{
		name: "countryCode",
		desc: ""
	},
	{
		name: "email",
		desc: ""
	},
	{
		name: "url",
		desc: ""
	},
	{
		name: "ip",
		desc: ""
	},
	{
		name: "ipv4",
		desc: ""
	},
	{
		name: "ipv6",
		desc: ""
	},
	{
		name: "img",
		desc: ""
	},
	{
		name: "imgURL",
		desc: ""
	},
	{
		name: "audio",
		desc: ""
	},
	{
		name: "video",
		desc: ""
	},
	{
		name: "color",
		desc: ""
	},
	{
		name: "filePath",
		desc: ""
	}
]