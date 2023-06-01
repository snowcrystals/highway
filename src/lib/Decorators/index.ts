import type { Middleware, Route } from "../index.js";

type Constructor<T = Record<string, any>> = new (...args: any[]) => T;
type ApplyOptionTypes = Route.Options | Middleware.Options;

/**
 * A way to configure the Route or Middleware classes
 * @example
 * ```ts
 * ‎@applyOptions<Route.Options>({ middleware: [[Methods.GET, "ratelimit"]] })
 * export default class extends Route {
 * 	public [Methods.GET](req: Request, res: Response) {
 * 		// Your route code here
 * 	}
 * }
 * ```
 */
export function ApplyOptions<Options extends ApplyOptionTypes>(options?: Options) {
	return <Class extends Constructor>(target: Class) =>
		class extends target {
			public constructor(...args: any[]) {
				super(...args, options ?? {});
			}
		};
}
