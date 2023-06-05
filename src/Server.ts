import express, { type Router, type Express } from "express";
import { RouteHandler } from "#handlers/RouteHandler.js";
import { MiddlewareHandler } from "#handlers/MiddlewareHandler.js";

export class Server {
	public express: Express;

	public readonly routeHandler: RouteHandler;
	public readonly middlewareHandler: MiddlewareHandler;

	public constructor(options: ServerOptions) {
		this.express = express();
		this.routeHandler = new RouteHandler(options.routePath);
		this.middlewareHandler = new MiddlewareHandler(options.middlewarePath);
	}

	/**
	 * Listen for connections
	 * @param port The port to listen to
	 * @param cb Optional callback function when the server is running
	 * @example
	 * ```ts
	 * import Server from "@snowcrystals/highway";
	 * const server = new Server();
	 * server.listen(8080, () => console.log("Listening to port 8080!"));
	 * ```
	 */
	public async listen(port: number, cb?: () => void) {
		await this.middlewareHandler.loadAll(this);
		await this.routeHandler.loadAll(this);

		return this.express.listen(port, cb);
	}

	public addRouter(router: Router) {
		this.express.use(router);
	}
}

export interface ServerOptions {
	/** The path to a directory routes */
	routePath: string;

	/** The path to a directory middleware */
	middlewarePath?: string;
}
