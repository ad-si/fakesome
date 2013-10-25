var documentation = [
	{
		name: 'config',
		desc: 'Change settings.',
		args: [
			{
				desc: 'Contains values to configure fakesome.',
				name: 'configObject',
				properties: [
					{
						name: 'outputFormat',
						type: ['JSON', 'XML', 'YAML'],
						desc: 'Set the format of data generation.',
						default: 'JSON'
					},
					{
						name: 'generator',
						type: 'function',
						desc: 'Change the random number generator. (Is is also used to generate most of the other values).',
						default: 'Math.rand()'
					}
				],
				required: true,
				type: 'Object'
			}
		],
		tests: [
			{
				desc: 'true or false',
				visible: true,
				args: null,
				test: function (value) {
					return value === true || value === false
				}
			}
		]
	},
	{
		name: 'boolean',
		desc: 'return randomly true or false.',
		args: [
			{
				name: 'chanceOfTrue',
				desc: 'Set the probability of getting returned true.',
				type: 'Number',
				required: false,
				default: 0.5
			}
		],
		return: {
			desc: 'true or false',
			type: 'Boolean'
		},
		tests: [
			{
				desc: 'true or false with a 50:50 chance',
				visible: true,
				args: null,
				test: function (value) {
					return value === true || value === false
				}
			},
			{
				desc: '80% probability of true',
				visible: true,
				args: [0.8],
				test: function (value) {
					return value === true || value === false
				}
			}
		]
	},
	{
		name: 'integer',
		desc: 'Returns a random integer.<br><br>For unlimited large integers (string of digits) use <code>fakesome.string()</code>',
		args: [
			{
				name: 'minimum',
				desc: 'Set the lower boundary of the range',
				type: 'Number',
				required: false,
				default: '-(2^53/2)+1'
			},
			{
				name: 'maximum',
				desc: 'Set the upper boundary of the range',
				type: 'Number',
				required: false,
				default: '(2^53/2)-1'
			},
			{
				name: 'filter',
				desc: 'Function to filter the possible numbers. Receives the number as a parameter and returns true or false. <code>function(number)</code>',
				type: 'Function',
				optional: true
			}
		],
		return: {
			type: 'Number',
			desc: 'The randomly generated integer.'
		},
		tests: [
			{
				desc: 'Integers between inclusive -4503599627370495 and 4503599627370495',
				visible: true,
				args: [],
				test: function (value) {
					return value >= 0 && value <= 1
				}
			},
			{
				desc: 'Integers between 0 and 1000',
				visible: true,
				args: [0, 1000],
				test: function (value) {
					return value >= 0 && value <= 1000
				}
			},
			{
				desc: 'Integers between -1000 and 0',
				visible: true,
				args: [-1000, 0],
				test: function (value) {
					return value >= -1000 && value <= 0
				}
			},
			{
				desc: 'Prime Numbers between inclusive 2 and inclusive 1000',
				visible: true,
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
		name: 'float',
		desc: 'Returns a random float between  and .',
		args: [
			{
				name: 'minimum',
				desc: 'Set the lower boundary of the range',
				visible: true,
				type: 'Number',
				required: false,
				default: '-1e12'
			},
			{
				name: 'maximum',
				desc: 'Set the upper boundary of the range',
				visible: true,
				type: 'Number',
				required: false,
				default: '1e12'
			},
			{
				name: 'filter',
				desc: 'Function to filter the possible numbers. Receives the number as a parameter and returns true or false. <code>function(number)</code>',
				visible: true,
				type: 'Function',
				optional: true
			}
		],
		return: {
			type: 'Number',
			desc: 'The randomly generated Number (float).'
		},
		tests: [
			{
				desc: 'Floats between inclusive 0 and 9',
				visible: true,
				args: [0, 9],
				test: function (value) {
					return value >= 0 && value <= 1
				}
			},
			{
				desc: 'Floats between 0 and 1000',
				visible: true,
				args: [0, 1000],
				test: function (value) {
					return value >= 0 && value <= 1000
				}
			},
			{
				desc: 'Floats between -1000 and 0',
				visible: true,
				args: [-1000, 0],
				test: function (value) {
					return value >= -1000 && value <= 0
				}
			}
		]
	},
	{
		name: 'character',
		desc: '',
		args: [
			{
				name: 'min',
				desc: '',
				type: 'Number',
				required: false,
				default: 32
			},
			{
				name: 'max',
				desc: '',
				type: 'Number',
				required: false,
				default: 1114112
			},
			{
				name: 'filter',
				desc: '',
				type: 'Function',
				required: false
			}
		],
		return: {
			type: 'String',
			desc: 'The randomly generated character.'
		},
		tests: [
			{
				desc: 'Random Unicode character',
				visible: true,
				test: function (value) {
					return true
				}
			},
			{
				desc: 'Random printable ASCII character',
				visible: true,
				args: [32, 126],
				test: function (value) {
					return true
				}
			},
			{
				desc: 'Random uppercase character',
				visible: true,
				args: [65, 90],
				test: function (value) {
					return true
				}
			}
		]
	},
	{
		name: 'string',
		desc: 'Returns a string of characters from the specified alphabet.',
		args: [
			{
				name: 'alphabet',
				desc: 'All the characters to choose from.',
				type: 'Array',
				default: 'a - z',
				required: false
			},
			{
				name: 'length',
				desc: 'Length of the string to be returned.',
				type: 'Number',
				default: '10',
				required: false
			}
		],
		tests: [
			{
				desc: 'String of 10 lower case ASCII characters.',
				visible: true,
				args: null,
				test: function (value) {
					return typeof(value) == 'string' && value.search(' ') == -1
				}
			},
			{
				desc: 'String of 15 weird characters',
				visible: true,
				args: [
					['●', '☃', ''],
					15
				],
				test: function (value) {
					return typeof(value) == 'string'
				}
			}
		]
	},
	{
		name: 'word',
		desc: 'Returns a single word, or a specified number of words.',
		args: [
			{
				name: 'number',
				desc: '',
				type: 'Number',
				default: 1,
				required: false
			}
		],
		tests: [
			{
				desc: '1 word',
				visible: true,
				args: null,
				test: function (value) {
					return typeof(value) == 'string' && value.search(' ') == -1
				}
			},
			{
				desc: 'String of 10 space separated words',
				visible: true,
				args: [10],
				test: function (value) {
					return typeof(value) == 'string'
				}
			}
		]
	},
	{
		name: 'text',
		desc: 'Get a text section with a certain number of characters.',
		args: [
			{
				name: 'number',
				desc: 'The number of characters in the text section.',
				type: 'Number',
				default: 100,
				required: false
			}
		],
		tests: [
			{
				desc: 'A text section consisting of 100 characters',
				visible: true,
				args: null,
				test: function (value) {
					return typeof(value) == 'string' && value.search(' ') == -1
				}
			},
			{
				desc: 'String of 10 characters',
				visible: true,
				args: [10],
				test: function (value) {
					return typeof(value) == 'string'
				}
			}
		]
	},
	{
		name: 'sentence',
		desc: 'Get a sentence with a minimum and maximum of words.',
		args: [
			{
				name: 'min',
				desc: 'Minimum number of words in the sentence',
				type: 'Number',
				default: 5,
				required: false
			},
			{
				name: 'max',
				desc: 'Maximum number of words in the sentence',
				type: 'Number',
				default: 25,
				required: false
			}
		],
		tests: [
			{
				desc: 'Get a sentence with 5 to 25 words',
				visible: true,
				args: null,
				test: function (value) {
					return typeof(value) == 'string' && value.search(' ') == -1
				}
			},
			{
				desc: 'Get a sentence with 40 to 50 words',
				visible: true,
				args: [40, 50],
				test: function (value) {
					return typeof(value) == 'string' && value.search(' ') == -1
				}
			},
			{
				desc: 'Get a sentence with exactly 4 words',
				visible: true,
				args: [4, 4],
				test: function (value) {
					return typeof(value) == 'string'
				}
			}
		]
	},
	{
		name: 'sentences',
		desc: 'Get specified number of sentences with between 5 and 25 words.',
		args: [
			{
				name: 'number',
				desc: 'The number of sentences.',
				type: 'Number',
				default: 1,
				required: false
			},
			{
				name: 'min',
				desc: 'Minimum number of words per sentence',
				type: 'Number',
				default: 5,
				required: false
			},
			{
				name: 'max',
				desc: 'Maximum number of words per sentence',
				type: 'Number',
				default: 25,
				required: false
			}
		],
		tests: [
			{
				desc: 'Get one sentence',
				visible: true,
				args: null,
				test: function (value) {
					return typeof(value) == 'string' && value.search(' ') == -1
				}
			},
			{
				desc: 'Get 4 sentences',
				visible: true,
				args: [4],
				test: function (value) {
					return typeof(value) == 'string'
				}
			},
			{
				desc: 'Get 10 sentences with 1 to 5 words each.',
				visible: true,
				args: [5, 1, 5],
				test: function (value) {
					return typeof(value) == 'string'
				}
			}
		]
	},
	{
		name: 'name',
		desc: ''
	},
	{
		name: 'address',
		desc: ''
	},
	{
		name: 'zip',
		desc: ''
	},
	{
		name: 'city',
		desc: ''
	},
	{
		name: 'streetName',
		desc: ''
	},
	{
		name: 'phoneNumber',
		desc: ''
	},
	{
		name: 'latitude',
		desc: ''
	},
	{
		name: 'longitude',
		desc: ''
	},
	{
		name: 'languageCode',
		desc: ''
	},
	{
		name: 'countryCode',
		desc: ''
	},
	{
		name: 'email',
		desc: ''
	},
	{
		name: 'url',
		desc: ''
	},
	{
		name: 'ip',
		desc: ''
	},
	{
		name: 'ipv4',
		desc: ''
	},
	{
		name: 'ipv6',
		desc: ''
	},
	{
		name: 'img',
		desc: 'Generate a random placeholder image.',
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
				desc: 'Base64 image data',
				visible: true,
				args: null,
				test: function (value) {
					return true
				}
			},
			{
				desc: 'Base64 image tag',
				visible: true,
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
				desc: 'Base64 image tag',
				visible: true,
				args: [
					{
						tag: true,
						width: 200,
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
				desc: 'Base64 image tag',
				visible: true,
				args: [
					{
						tag: true,
						width: 200,
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
				desc: 'Grayscale image',
				visible: true,
				args: [
					{
						tag: true,
						width: 200,
						elements: 1000,
						filter: 'grayscale'
					}
				],
				test: function (value) {
					return true
				}
			},
			{
				desc: 'Black & white image',
				args: [
					{
						tag: true,
						width: 200,
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
		name: 'imgURL',
		desc: '',
		args: [
			{
				name: 'configObject',
				type: 'Object',
				desc: 'Configure different parameters to narrow down the set of possible images.',
				properties: [
					{
						name: 'width',
						type: 'Number',
						default: 100
					},
					{
						name: 'height',
						type: 'Number',
						default: 100
					},
					{
						name: 'tag',
						type: 'String',
						default: ''
					},
					{
						name: 'text',
						type: 'String',
						default: ''
					},
					{
						name: 'bgColor',
						type: 'Color',
						default: ''
					},
					{
						name: 'textColor',
						type: 'Color',
						default: ''
					},
					{
						name: 'grayscale',
						type: 'Boolean',
						default: false
					},
					{
						name: 'site',
						type: 'String',
						default: 'lorempixel.com',
						desc: 'Select to site to be used for loading the images. You can choose between following sites:' +
							'<a href="http://lorempixel.com">lorempixel.com</a>, ' +
							'<a href="http://placehold.it">placehold.it</a>, ' +
							'<a href="http://placekitten.com">placekitten.com</a>, ' +
							'<a href="http://flickholdr.com">flickholdr.com</a>'
					},
					{
						name: 'number',
						type: 'Number',
						default: false
					},
					{
						name: 'format',
						type: 'png | gif | jpg',
						default: 'png'
					}
				]
			}
		],
		tests: [
			{
				desc: 'URL to a random image on lorempixel.com',
				visible: true,
				args: null,
				test: function (value) {
					return true
				}
			},
			{
				desc: 'URL to a random image on placekitten.com',
				visible: true,
				args: [
					{
						site: 'placekitten.com',
						width: 400,
						height: 250,
						grayscale: true
					}
				],
				test: function (value) {
					return true
				}
			}
		]
	},
	{
		name: 'audio',
		desc: ''
	},
	{
		name: 'video',
		desc: ''
	},
	{
		name: 'color',
		desc: ''
	},
	{
		name: 'filePath',
		desc: ''
	},
	{
		name: 'currency',
		desc: ''
	},
	{
		name: 'data',
		desc: 'Create a javascript Object with custom key-value pairs. ' +
			'The values can either be primitives or be generated with other fakesome methods.',
		args: [
			{
				name: 'schema',
				desc: 'The schema of the object to be returned.',
				type: 'Object',
				required: true
			}
		],
		return: {
			desc: 'Object with specified key-value pairs.',
			type: 'Object'
		},
		tests: [
			{
				desc: 'User entry',
				visible: true,
				args: [{
					name: 'word()',
					age: 'integer(0,100)',
					premium: 'boolean()',
					country: "de",
					logins: 89
				}],
				test: function (value) {
					return value === true || value === false
				}
			}
		]
	},
	{
		name: 'array',
		desc: 'This method enables you to return arrays of faked data. ' +
			'Simply chain one of the other fakesome methods after the array method ' +
			'to get an array of the method\'s values. E.g. <code>fakesome.array(5).boolean()</code> ' +
			'will return an array of 5 random boolean values.',
		args: [
			{
				name: 'number',
				desc: 'Number of elements in the array.',
				type: 'Number',
				required: false,
				default: 10
			}
		],
		return: {
			desc: 'Array of elements',
			type: 'Object',
			properties: [
				{
					name: 'outputFormat',
					type: ['JSON', 'XML', 'YAML'],
					desc: 'Set the format of data generation.',
					default: 'JSON'
				},
				{
					name: 'generator',
					type: 'function',
					desc: 'Change the random number generator. (Is is also used to generate most of the other values).',
					default: 'Math.rand()'
				}
			]
		}
	},
	{
		name: 'maybe',
		desc: 'Chain other faksome methods after <code>maybe()</code> ' +
			'to make the return of values optional. ' +
			'E.g. <code>fakesome.maybe().integer(0,9)</code> ' +
			'will return an integer or null with a 50:50 chance.',
		args: [
			{
				name: 'chanceOfReturn',
				desc: 'Probability that the chained function returns a value. ' +
					'Otherwise it will return <code>null</code>.',
				type: 'Number',
				required: false,
				default: 0.5
			}
		],
		return: {
			desc: 'Array of elements',
			type: 'Array'
		}
	},
	{
		name: 'fn',
		desc: 'Extend fakesome with your own modules. ' +
			'E.g. To create a  module <code>fakesome.longWord()</code> simply extend ' +
			'<code>fakesome.fn</code> with the corresponding function: ' +
			'<code>' +
			'fakesome.fn.longWord = function(){' +
			'   return "supercalifragilisticexpialidocious"'+
			'}' +
			'</code>',
		type: 'property'
	}
]