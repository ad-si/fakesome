export function createRequire(): (id: string) => never {
	return function () {
		throw new Error('node:module is not available in the browser')
	}
}
