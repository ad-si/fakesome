!function (window, document) {

	function $(query) {
		query = document.querySelectorAll(query)

		return (query[1]) ? query : query[0]
	}

	function truncate(str){

		str = String(str)

		return (str.search(/\s/) === -1 && str.length > 40) ?
			str.substr(0,40) + '…' :
			str
	}

	// TODO: Catch exception globally
	// TODO: Include https://github.com/fent/randexp.js


	documentation.forEach(function (method) {

		var argNames = []

		if (method.args)
			method.args.forEach(function (arg) {
				argNames.push(arg.name)
			})

		var html = shaven(
			[$('#documentation'),
				['section',
					['h2',
						{id: method.name},
						'fakesome.' + method.name + '(' + argNames.join(', ') + ')'
					],
					['p&', method.desc],
					['h3', 'Parameters'],
					['dl.args$args'],
					['h3', method.return ? 'Returns' : false],
					['span.returns$returns', method.return ? method.return.type : false],
					['p.returns', method.return ? method.return.desc : false],
					['h3', 'Examples'],
					['table',
						['thead',
							['tr',
								['th', 'Code'],
								['th', 'Description'],
								['th', 'Example Return']
							]
						],
						['tbody$examples']
					]
				],
				['hr']
			]
		)

		if (method.args)
			method.args.forEach(function (arg) {

				var list = shaven(
					[html.args,
						['dt.name', arg.name,
							['span', arg.required ? "*" : false]
						],
						['dd.type',
							['span', arg.type]
						],
						['dd.default',
							['span', arg.default || false]
						],
						['dd.desc&', arg.desc]
					]
				)

				if (arg.properties) {

					shaven(
						[html.args,
							['br'],
							['dd.properties',
								['dl$properties']
							]
						], null, list
					)

					arg.properties.forEach(function (property) {

						var values = '<span>'

						if (Array.isArray(property.type))
							values += property.type.join(' | ')

						else if (typeof property.type === 'string')
							values += property.type

						else
							values += property.type


						values += '</span>'


						shaven(
							[list.properties,
								['dt', property.name],
								['dd.type&', values],
								['dd.default',
									['span', String(property.default) || false]
								],
								['dd.desc&', property.desc],
								['br']
							]
						)
					})
				}

				shaven([html.args, ['br']])
			})


		if (method.tests)
			method.tests.forEach(function (test) {

				var testArgs = []

				if (test.args) {

					test.args.forEach(function (arg) {

						if (arg.constructor === Object)
							testArgs.push(JSON.stringify(arg, null, '    '))
						else
							testArgs.push(String(arg).replace(/\t/g, '    '))

					}, test)

					testArgs = testArgs.join(', ')
				}


				shaven(
					[html.examples,
						['tr',
							['td.code',
								['pre',
									['code', 'fakesome.' + method.name + '(' + testArgs + ')']
								],
							],
							['td', test.desc],
							['td&', truncate(fakesome[method.name].apply(null, test.args))]
						]
					]
				)

			})


		shaven(
			[$('nav ul'),
				['li',
					['a', {href: '#' + method.name}, method.name],
					['br']
				]
			]
		)
	})


	var codeSnippets = document.querySelectorAll('pre code')

	for (var a = 0; a < codeSnippets.length; a++) {

		//console.log(hljs.highlight('javascript', codeSnippets[a].innerHTML).value)

		codeSnippets[a].innerHTML = hljs.highlight('javascript', codeSnippets[a].innerHTML).value


	}

	fakesome.img()


	/*console.log(fakesome.matrix(10, 10, ['n', 'e', 's', 'w']))

	 console.log(fakesome.text(10))

	 console.log(fakesome.word(10))

	 console.log(fakesome.sentence(10))

	 console.log(fakesome.objects({
	 event: ["payment", "sleep", "food"],
	 start: "datetime 2010-01-01 2013-01-01",
	 end: "datetime 2010-01-01 2013-01-01",
	 user: "base64 "

	 }, 100))*/

}(window, document)