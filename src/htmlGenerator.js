var shaven = require('shaven'),
	documentationData = require('./documentation'),
	fakesome = require('./fakesome')


module.exports = function () {

	var templates = {
			argument: function (arg) {

				var argumentProperties = ['dl&']

				if (arg.properties) {
					arg.properties.forEach(
						function (property) {

							var values = '<span>'

							if (Array.isArray(property.type))
								values += property.type.join(' | ')

							else if (typeof property.type === 'string')
								values += property.type

							else
								values += property.type

							values += '</span>'

							argumentProperties.push(
								['dt',
									['em', property.name]
								],
								['dd.type&', values],
								['dd.default',
									['span', String(property.default) || false]
								],
								['dd.desc&', property.desc || false]
							)
						}
					)
				}

				return [
					['dt.name',
						['sup', arg.required ? "*" : false],
						['em', arg.name]
					],
					['dd.type',
						['span', arg.type]
					],
					['dd.default',
						['span', arg.default || false]
					],
					['dd.desc&', arg.desc || false],
					arg.properties ?
						['dd.properties', argumentProperties] : undefined
				]
			},
			section: function (data) {

				return ['section',
					['h2&',
						{id: data.name},
						[
							'<span>fakesome.</span>',
							data.name,
							data.type === 'property' ? '' : '( ',
							'<span>',
							data.args ? data.args.map(function (item) {
								return item.name
							}).join('</span>, <span>') :
							'',
							'</span>',
							data.type === 'property' ? '' : ' )'
						].join('')
					],
					['p&', data.desc ? data.desc : false],
					['h3', 'Parameters', data.args ? '' : false],
					['dl.args&', data.args ?
					             data.args.map(function (arg) {
						             return templates.argument(arg)
					             }) :
					             false],
					['h3', data.return ? 'Returns' : false],
					[
						'span.returns',
						data.return ? data.return.type : false
					],
					['p.returnDesc', data.return ? data.return.desc : false],
					['h3', data.examples ? 'Examples' : false],
					['table', data.examples ? true : false,
						['thead',
							['tr',
								['th', 'Code'],
								['th', 'Description'],
								['th', 'Example Return']
							]
						],
						[
							'tbody',
							data.examples || false
						]
					]
				]

			},
			tableOfContents: function (documentation) {

				return ['ul',
					documentation.map(function (method) {

						if (!fakesome[method.name])
							return

						return ['li',
							['a', capitalize(method.name), {
								href: '#' + method.name
							}]
						]
					})
				]
			},
			documentation: function (data) {

				return ['div', data.map(function (method) {

					var exampleIsVisible = method.examples &&
						method.examples.some(function (example) {
							return example.visible
						})


					if (!fakesome[method.name])
						return

					if (method.args)
						method.parameters = method.args.map(function (arg) {
							return templates.argument(arg)
						})


					if (exampleIsVisible)
						method.examples = method.examples.map(function (example) {

							var exampleReturn,
								exampleArgs = []

							if (example.args)
								example.args.forEach(function (arg) {
									exampleArgs.push(prettyPrint(arg))
								})

							exampleReturn = fakesome[method.name]
								.apply(null, example.args)


							if (typeof exampleReturn === 'object')
								exampleReturn = JSON
									.stringify(exampleReturn, null, '    ')
									.replace(/\n/g, '<br>')
							else
								exampleReturn = truncate(exampleReturn)

							return [
								['tr',
									['td.code',
										['pre',
											['code.js.hljs',
												'fakesome.' + method.name +
												'(' +
												exampleArgs.join(', ') +
												')'
											]
										]
									],
									['td&', example.desc],
									['td&', exampleReturn]
								]
							]
						})

					return templates.section(method)
				})]
			}
		},
		html = {
			tableOfContents: [],
			documentation: []
		}

	function truncate (str) {

		str = String(str)

		return (str.search(/\s/) === -1 && str.length > 40) ?
		       str.substr(0, 40) + '…' :
		       str
	}

	function capitalize (str) {

		return str.charAt(0).toUpperCase() + str.substr(1)
	}

	function prettyPrint (item) {

		function calculateOffset (string) {

			return string
				.match(/\t+/g)
				.reduce(function (a, b) {
					return a.length < b.length ? a.length : b.length
				})
		}

		function removeLeadingTabs (string) {

			var offset = calculateOffset(string),
				pattern = new RegExp(new Array(offset + 1).join('\t'), 'g')

			return string
				.replace(pattern, '')
				.replace(/\t/g, '    ')
		}

		if (item === null)
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


	console.dir(
		templates.tableOfContents(documentationData),
		{depth: null, colors: true}
	)

	html.tableOfContents = shaven(
		templates.tableOfContents(documentationData)
	)[0]

	html.documentation = shaven(
		templates.documentation(documentationData)
	)[0]

	return html
}
