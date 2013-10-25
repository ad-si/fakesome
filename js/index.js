!function (window, document) {

	var templates = {

		section: function (target, data) {

			return [target,
				['hr'],
				['section',
					['h2',
						{id: data.name},
						'fakesome.' + data.name +
							(data.type === 'property' ? '' : '(') +
							(data.args ? data.args.map(function (item) {
								return item.name
							}).join(', ') : '') +
							(data.type === 'property' ? '' : ')')
					],
					['p&', data.desc],
					['h3', 'Parameters', data.args ? '' : false],
					['dl.args$args'],
					['h3', data.return ? 'Returns' : false],
					['span.returns$returns', data.return ? data.return.type : false],
					['p.returns', data.return ? data.return.desc : false],
					['h3', data.tests ? 'Examples' : false],
					['table', data.tests ? '' : false,
						['thead',
							['tr',
								['th', 'Code'],
								['th', 'Description'],
								['th', 'Example Return']
							]
						],
						['tbody$examples']
					]
				]
			]
		},
		arguments: function (target, arg) {
			return [target,
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
		},
		toc: function(target, data){

			return [target,
				['li',
					['a', {href: '#' + data.name}, capitalize(data.name)],
					['br']
				]
			]
		}

	}

	function $(query) {
		query = document.querySelectorAll(query)

		return (query[1]) ? query : query[0]
	}

	function truncate(str) {

		str = String(str)

		return (str.search(/\s/) === -1 && str.length > 40) ?
			str.substr(0, 40) + '…' :
			str
	}

	function capitalize(str){

		return str.charAt(0).toUpperCase() + str.substr(1)
	}

	// TODO: Catch exceptions globally
	// TODO: Include https://github.com/fent/randexp.js


	documentation.forEach(function (method) {

		var testIsVisibile = method.tests && method.tests.some(function(test){return test.visible})

		if (!fakesome[method.name]) return

		var html = shaven(templates.section($('#documentation'), method))

		if (method.args)
			method.args.forEach(function (arg) {

				var list = shaven(templates.arguments(html.args, arg))

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


		if (testIsVisibile)

			method.tests.forEach(function (test) {

				var testArgs = []

				if (test.args) {

					test.args.forEach(function (arg) {

						if (arg.constructor === Object)
							testArgs.push(JSON.stringify(arg, null, '    '))
						else if (Array.isArray(arg))
							testArgs.push(JSON.stringify(arg, null, ''))
						else
							testArgs.push(String(arg).replace(/\t/g, '    '))

					}, test)
				}

				var exampleReturn =  fakesome[method.name].apply(null, test.args)


				if(typeof exampleReturn === 'object')
					exampleReturn = JSON.stringify(exampleReturn, null, '    ').replace(/\n/g, '<br>')
				else
					exampleReturn = truncate(exampleReturn)

				shaven(
					[html.examples,
						['tr',
							['td.code',
								['pre',
									['code', 'fakesome.' + method.name + '(' + testArgs.join(', ') + ')']
								],
							],
							['td', test.desc],
							['td&', exampleReturn]
						]
					]
				)

			})


		// TODO Categories: Basic, General, Language Specific, Special

		shaven(templates.toc($('nav ul'), method))
	})


	var codeSnippets = document.querySelectorAll('pre code')

	for (var a = 0; a < codeSnippets.length; a++)
		codeSnippets[a].innerHTML = hljs.highlight('javascript', codeSnippets[a].innerHTML).value

}(window, document)