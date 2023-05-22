import express, { type Router, type Express } from "express";
import { RouteHandler } from "#handlers/RouteHandler.js";

export class Server {
	public express: Express;

	public readonly routeHandler: RouteHandler;

	public constructor(options: ServerOptions) {
		this.express = express();
		this.routeHandler = new RouteHandler(options.routePath);
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
	public listen(port: number, cb?: () => void) {
		void this.routeHandler.loadAll(this);
		return this.express.listen(port, cb);
	}

	public addRouter(router: Router) {
		this.express.use(router);
	}
}

export interface ServerOptions {
	/** The path to a directory routes */
	routePath: string;
}
