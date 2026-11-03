import shaven from 'shaven'
import documentationData from './documentation.ts'
import type {DocArgument, DocEntry, DocExample} from './documentation.ts'
import fakesome from './fakesome.ts'


type ShavenNode = unknown[]

export interface GeneratedHtml {
	tableOfContents: string
	documentation: string
}


const methods = fakesome as unknown as Record<string, unknown>


function escapeHtml(str: unknown): string {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

function truncate(value: unknown): string {
	const str = String(value)

	return (str.search(/\s/) === -1 && str.length > 40)
		? str.slice(0, 40) + '…'
		: str
}

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function removeLeadingTabs(string: string): string {
	const tabRuns = string.match(/\t+/g) ?? []
	const offset = tabRuns.length > 0
		? Math.min(...tabRuns.map(run => run.length))
		: 0

	return string
		.replace(new RegExp('\t'.repeat(offset), 'g'), '')
		.replace(/\t/g, '    ')
}

function prettyPrint(item: unknown): string {
	if (item === null)
		return 'null'

	if (typeof item === 'object' && item.constructor === Object)
		return JSON.stringify(item, null, '    ')

	if (Array.isArray(item))
		return JSON.stringify(item, null, '')

	if (typeof item === 'function')
		return removeLeadingTabs(String(item))

	if (typeof item === 'string')
		return '"' + item + '"'

	return String(item).replace(/\t/g, '    ')
}


function argumentTemplate(arg: DocArgument): ShavenNode {

	const argumentProperties: ShavenNode = ['dl&']

	for (const property of arg.properties ?? []) {
		const type = Array.isArray(property.type)
			? property.type.join(' | ')
			: property.type

		argumentProperties.push(
			['dt',
				['em', property.name],
			],
			['dd.type&', '<span>' + type + '</span>'],
			['dd.default',
				['span', String(property.default) || false],
			],
			['dd.desc&', property.desc || false],
		)
	}

	return [
		['dt.name',
			['sup', arg.required ? '*' : false],
			['em', arg.name],
		],
		['dd.type',
			['span', arg.type],
		],
		['dd.default',
			['span', arg.default || false],
		],
		['dd.desc&', arg.desc || false],
		arg.properties
			? ['dd.properties', argumentProperties]
			: undefined,
	]
}

function exampleTemplate(method: DocEntry, example: DocExample): ShavenNode {

	const args = example.args ?? []
	const generator = methods[method.name] as (...args: unknown[]) => unknown
	const result = generator(...args)

	const exampleReturn = typeof result === 'object'
		? JSON
			.stringify(result, null, '    ')
			.replace(/\n/g, '<br>')
		: truncate(result)

	return [
		['tr',
			['td.code',
				['pre',
					['code.js.hljs&',
						escapeHtml(
							'fakesome.' + method.name +
							'(' + args.map(prettyPrint).join(', ') + ')',
						),
					],
				],
			],
			['td&', example.desc],
			['td&', exampleReturn],
		],
	]
}

function sectionTemplate(data: DocEntry): ShavenNode {

	const isProperty = data.type === 'property'
	// All examples are shown as soon as one of them is marked as visible
	const examples = data.examples ?? []
	const hasExamples = examples.some(example => example.visible)
	const exampleRows = hasExamples
		? examples.map(example => exampleTemplate(data, example))
		: false

	return ['section',
		['h2&',
			{id: data.name},
			[
				'<span>fakesome.</span>',
				data.name,
				isProperty ? '' : '( ',
				'<span>',
				data.args
					? data.args.map(item => item.name).join('</span>, <span>')
					: '',
				'</span>',
				isProperty ? '' : ' )',
			].join(''),
		],
		['p&', data.desc ? data.desc : false],
		['h3', 'Parameters', data.args ? '' : false],
		['dl.args&', data.args ? data.args.map(argumentTemplate) : false],
		['h3', data.return ? 'Returns' : false],
		['span.returns', data.return ? data.return.type : false],
		['p.returnDesc', data.return ? data.return.desc : false],
		['h3', hasExamples ? 'Examples' : false],
		['table', hasExamples,
			['thead',
				['tr',
					['th', 'Code'],
					['th', 'Description'],
					['th', 'Example Return'],
				],
			],
			['tbody', exampleRows],
		],
	]
}

function tableOfContentsTemplate(documentation: DocEntry[]): ShavenNode {
	return ['ul',
		documentation
			.filter(method => methods[method.name])
			.map(method =>
				['li',
					['a', capitalize(method.name), {href: '#' + method.name}],
				],
			),
	]
}

function documentationTemplate(documentation: DocEntry[]): ShavenNode {
	return ['div',
		documentation
			.filter(method => methods[method.name])
			.map(sectionTemplate),
	]
}


// TODO: Catch exceptions globally
// TODO: Include https://github.com/fent/randexp.js

export default function htmlGenerator(): GeneratedHtml {
	return {
		tableOfContents: shaven(tableOfContentsTemplate(documentationData))[0],
		documentation: shaven(documentationTemplate(documentationData))[0],
	}
}
