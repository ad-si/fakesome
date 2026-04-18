export function createRequire() {
	return function () {
		throw new Error('node:module is not available in the browser')
	}
}
