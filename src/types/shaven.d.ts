declare module 'shaven' {
	/** Converts a nested array (shaven / JsonML-like syntax) to an HTML string */
	export default function shaven(
		arrayOrObject: unknown[] | Record<string, unknown>,
	): [string, ...unknown[]]
}
