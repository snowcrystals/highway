import { Router, type IRouterMatcher, type Request, type Response, type NextFunction } from "express";
import type { Server } from "../../Server.js";
import { methods, type MethodCallback } from "#types/Methods.js";
import type { Middleware } from "./Middleware.js";

export class Route<TServer extends Server = Server> {
	/** The router responsible for handling the requests of this route */
	public readonly router: Router;

	/** The express server */
	public server!: TServer;

	/**
	 * The registered middleware that should be applied to this route
	 * @example [[Methods.POST, "auth"]]
	 */
	public readonly middleware: [symbol, ...string[]][];

	public constructor(originalRoute: string, options: Route.Options = {}) {
		this.router = Router();
		this.middleware = options.middleware ?? [];

		for (const [method, symbol] of Object.entries(methods)) {
			const callback = Reflect.get(this, symbol) as MethodCallback;
			if (typeof callback === "function") this.loadRoute(callback.bind(this), options.route || originalRoute, method);
		}
	}

	/**
	 * A listener called when the route is first loaded. When overriding this function, make sure to call to make a super call.
	 * @example
	 * ```ts
	 * public override onLoad(server: Server) {
	 *  super.onLoad(server);
	 *  // your code stuff
	 * }
	 * ```
	 */
	public onLoad(server: TServer) {
		this.server = server;
		this.server.addRouter(this.router);
	}

	private loadRoute(route: MethodCallback, routePath: string, method: string) {
		const [, ...middlewareIds] = (this.middleware.find((array) => array[0] === Reflect.get(methods, method)) ?? []) as string[];
		const middlewares = middlewareIds.map((id) => this.server.middlewareHandler.get(id)).filter(Boolean) as Middleware[];
		const transformedMiddleware = middlewares.map(
			(middleware) => (req: Request, res: Response, next: NextFunction) => middleware.call(req, res, next, context)
		);

		const context = {};
		const expressRouteFn = Reflect.get(this.router, method.toLowerCase()) as IRouterMatcher<any>;
		if (typeof expressRouteFn === "function")
			expressRouteFn.bind(this.router)(routePath, ...transformedMiddleware, (req, res, next) => route(req, res, next, context));
	}
}

export interface RouteOptions {
	/**
	 * The route that this class represents, this is automatically set but can be overwritten if necessary
	 * @default The path between the base route directory and the file name
	 * @example "/api/ping"
	 */
	route?: string;

	/**
	 * The registered middleware that should be applied to this route
	 * @default []
	 * @example [[Methods.POST, "auth"]]
	 */
	middleware?: [symbol, ...string[]][];
}

export namespace Route {
	export type Options = RouteOptions;
}
