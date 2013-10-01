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
		return: {
			desc: "true or false",
			type: "boolean"
		},
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
		return: {
			type: "Number",
			desc: "The randomly generated integer."
		},
		tests: [
			{
				desc: "Integers between inclusive -4503599627370495 and 4503599627370495",
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
function (n) {

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
		desc: "Returns a random float between  and .",
		args: [
			{
				name: "minimum",
				desc: "Set the lower boundary of the range",
				type: "Number",
				required: false,
				default: "-1e12"
			},
			{
				name: "maximum",
				desc: "Set the upper boundary of the range",
				type: "Number",
				required: false,
				default: "1e12"
			},
			{
				name: "filter",
				desc: "Function to filter the possible numbers. Receives the number as a parameter and returns true or false. <code>function(number)</code>",
				type: "Function",
				optional: true
			}
		],
		return: {
			type: "Number",
			desc: "The randomly generated Number (float)."
		},
		tests: [
			{
				desc: "Floats between inclusive 0 and 9",
				args: [0, 9],
				test: function (value) {
					return value >= 0 && value <= 1
				}
			},
			{
				desc: "Floats between 0 and 1000",
				args: [0, 1000],
				test: function (value) {
					return value >= 0 && value <= 1000
				}
			},
			{
				desc: "Floats between -1000 and 0",
				args: [-1000, 0],
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
		desc: "",
		args: [
			{
				name: "min",
				desc: "",
				type: "Number",
				required: false,
				default: 32
			},
			{
				name: "max",
				desc: "",
				type: "Number",
				required: false,
				default: 1114112
			},
			{
				name: "filter",
				desc: "",
				type: "Function",
				required: false
			}
		],
		return: {
			type: "String",
			desc: "The randomly generated character."
		},
		tests: [
			{
				desc: "Random Unicode character",
				test: function (value) {
					return true
				}
			},
			{
				desc: "Random printable ASCII character",
				args: [32, 126],
				test: function (value) {
					return true
				}
			},
			{
				desc: "Random uppercase character",
				args: [65, 90],
				test: function (value) {
					return true
				}
			}
		]
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
		desc: "Generate a random placeholder image.",
		args: [
			{
				name: 'configObject',
				type: 'Object',
				desc: 'Configure different parameters of the image.',
				properties: [
					{
						name: 'tag',
						type: 'boolean',
						default: false,
						desc: '<code>true</code>: Returns an image tag containing a base64 coded image.<br><code>false</code>: Returns just the base64 string.'
					},
					{
						name: 'width',
						type: 'Number',
						default: 100,
						desc: 'Sets the width of the image.'
					},
					{
						name: 'height',
						type: 'Number',
						default: 100,
						desc: 'Sets the height of the image.'
					},
					{
						name: 'elements',
						type: 'Number',
						default: 100,
						desc: 'Sets the number of elements in the image.'
					},
					{
						name: 'bgColor',
						type: 'Color',
						default: 'white',
						desc: 'Sets the background color of the image.'
					},
					{
						name: 'minColor',
						type: 'Color',
						default: 'rgba(0,0,0,0)',
						desc: 'Sets the minimum color of the elements in the image.'
					},
					{
						name: 'maxColor',
						type: 'Color',
						default: 'rgba(255,255,255,1)',
						desc: 'Sets the maximum color of the elements in the image.'
					}
				]

			}

		],
		tests: [
			{
				desc: "Base64 image data",
				args: null,
				test: function (value) {
					return true
				}
			},
			{
				desc: "Base64 image tag",
				args: [
					{
						tag: true,
						width: 200,
						height: 100
					}
				],
				test: function (value) {
					return true
				}
			},
			{
				desc: "Base64 image tag",
				args: [
					{
						tag: true,
						width: 200,
						height: 100,
						text: true,
						minColor: 'rgba(200,0,0,0.1)',
						maxColor: 'rgba(255,200,200,0.4)'
					}
				],
				test: function (value) {
					return true
				}
			},
			{
				desc: "Base64 image tag",
				args: [
					{
						tag: true,
						width: 200,
						height: 100,
						text: 'Placeholder',
						elements: 10,
						bgColor: 'rgb(120,220,240)'
					}
				],
				test: function (value) {
					return true
				}
			},
			{
				desc: "Grayscale image",
				args: [
					{
						tag: true,
						width: 200,
						height: 100,
						elements: 1000,
						filter: 'grayscale'
					}
				],
				test: function (value) {
					return true
				}
			},
			{
				desc: "Black & white image",
				args: [
					{
						tag: true,
						width: 200,
						height: 100,
						elements: 100,
						bgColor: 'rgb(100,200,230)',
						filter: 'bw'
					}
				],
				test: function (value) {
					return true
				}
			}
		]
	},
	{
		name: "imgURL",
		desc: "",
		tests: [
			{
				desc: "Base64 image data",
				args: null,
				test: function (value) {
					return true
				}
			}
		]
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
	},
	{
		name: "currency",
		desc: ""
	}
]