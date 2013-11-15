!function (window, document) {

	var templates = {

		section: function (target, data) {

			return [target,
				['hr'],
				['section',
					['h2&',
						{id: data.name},
						'<span>fakesome.</span>' + data.name +
							(data.type === 'property' ? '' : '( ') +
							'<span>' +
							(data.args ? data.args.map(function (item) {
								return item.name
							}).join('</span>, <span>') : '') +
							'</span>' +
							(data.type === 'property' ? '' : ' )')
					],
					['p&', data.desc],
					['h3', 'Parameters', data.args ? '' : false],
					['dl.args$args'],
					['h3', data.return ? 'Returns' : false],
					['span.returns$returns', data.return ? data.return.type : false],
					['p.returns', data.return ? data.return.desc : false],
					['h3', data.examples ? 'Examples' : false],
					['table', data.examples ? '' : false,
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

	function prettyPrint(item){

		function calculateOffset(string){

			return string
				.match(/\t+/g)
				.reduce(function (a, b) {
					return a.length < b.length ? a.length : b.length
				})
		}

		function removeLeadingTabs(string){

			var offset = calculateOffset(string),
				pattern = new RegExp(new Array(offset + 1).join('\t'), 'g')

			return string
				.replace(pattern, '')
				.replace(/\t/g, '    ')
		}

		if(item === null)
			return 'null'

		if (item.constructor === Object)
			return JSON.stringify(item, null, '    ')

		if (Array.isArray(item))
			return JSON.stringify(item, null, '')

		if (typeof item === 'function')
			return removeLeadingTabs(String(item))

		if (typeof item === 'string')
			return '"' + item + '"'

		return String(item).replace(/\t/g, '    ')
	}

	// TODO: Catch exceptions globally
	// TODO: Include https://github.com/fent/randexp.js


	documentation.forEach(function (method) {

		var exampleIsVisible = method.examples && method.examples.some(function(example){
			return example.visible
		})

		console.log(fakesome)

		if (!fakesome[method.name])
			return


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


		if (exampleIsVisible)

			method.examples.forEach(function (example) {

				var exampleArgs = []

				if (example.args) {

					example.args.forEach(function (arg) {
						exampleArgs.push(prettyPrint(arg))
					})
				}

				var exampleReturn =  fakesome[method.name].apply(null, example.args)


				if(typeof exampleReturn === 'object')
					exampleReturn = JSON.stringify(exampleReturn, null, '    ').replace(/\n/g, '<br>')
				else
					exampleReturn = truncate(exampleReturn)

				shaven(
					[html.examples,
						['tr',
							['td.code',
								['pre',
									['code', 'fakesome.' + method.name + '(' + exampleArgs.join(', ') + ')']
								],
							],
							['td', example.desc],
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