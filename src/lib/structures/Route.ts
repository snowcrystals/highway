import { Router, type IRouterMatcher, type Request, type Response, type NextFunction, type RequestHandler } from "express";
import type { Server } from "../../Server.js";
import { methods, type MethodCallback } from "#types/Methods.js";
import type { Middleware } from "./Middleware.js";
import { rateLimit, type Options as RatelimitOptions, type RateLimitRequestHandler } from "express-rate-limit";

export abstract class Route<TServer extends Server = Server> {
	/** The router responsible for handling the requests of this route */
	public readonly router: Router;

	/** The ratelimit component */
	public readonly ratelimit?: RateLimitRequestHandler;

	/** The path for this route */
	public route: string;

	/** The express server */
	public server!: TServer;

	/**
	 * The registered middleware that should be applied to this route
	 * @example [[Methods.POST, "auth"]]
	 */
	public readonly middleware: [symbol, ...string[]][];

	public constructor(options: Route.Options = {}) {
		this.router = Router();
		this.middleware = options.middleware ?? [];
		this.route = options.route ?? "";
		this.ratelimit = options.ratelimit ? rateLimit(options.ratelimit) : undefined;
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
	public onLoad(server: TServer, originalRoute: string) {
		this.server = server;
		this.server.addRouter(this.router);
		this.route ||= originalRoute;

		for (const [method, symbol] of Object.entries(methods)) {
			const callback = Reflect.get(this, symbol) as MethodCallback;
			if (typeof callback === "function") this.loadRoute(callback.bind(this), this.route, method);
		}
	}

	private loadRoute(route: MethodCallback, routePath: string, method: string) {
		const [, ...middlewareIds] = (this.middleware.find((array) => array[0] === Reflect.get(methods, method)) ?? []) as string[];
		const middlewares = middlewareIds.map((id) => this.server.middlewareHandler.get(id)).filter(Boolean) as Middleware[];
		const transformedMiddleware = middlewares.map(
			(middleware) => (req: Request, res: Response, next: NextFunction) => middleware.call(req, res, next, context)
		);

		const context = {};
		const expressRouteFn = Reflect.get(this.router, method.toLowerCase()) as IRouterMatcher<any>;
		if (typeof expressRouteFn === "function") {
			const baseHandlers: RequestHandler[] = [...transformedMiddleware, (req, res, next) => route(req, res, next, context)];
			const handlers: RequestHandler[] = this.ratelimit ? [this.ratelimit.bind(this.ratelimit), ...baseHandlers] : baseHandlers;
			expressRouteFn.bind(this.router)(routePath, handlers);
		}
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

	/**
	 * The Express Ratelimit options
	 */
	ratelimit?: Partial<RatelimitOptions>;
}

export namespace Route {
	export type Options = RouteOptions;
}
