import type { Server } from "../../Server.js";
import { methods, type MethodCallback } from "#types/Methods.js";
import { Collection } from "@discordjs/collection";
import type { Request, Response, NextFunction } from "express";

export class Middleware<TServer extends Server = Server> {
	/** The express server */
	public server!: TServer;

	/** The unique identifier for the middleware */
	public readonly id: string;

	public readonly methods = new Collection<string, MethodCallback>();

	public constructor(options: Middleware.Options) {
		this.id = options.id;

		for (const [method, symbol] of Object.entries(methods)) {
			const callback = Reflect.get(this, symbol) as MethodCallback;
			if (typeof callback === "function") this.methods.set(method, callback);
		}
	}

	/**
	 * Calls the middleware if a method callback is registered
	 * @param req The express request object
	 * @param res The express response object
	 * @param next The express next function
	 * @param context The context object
	 */
	public async call(req: Request, res: Response, next: NextFunction, context: Record<string, unknown>) {
		const methodCallback = this.methods.get(req.method);
		if (methodCallback && typeof methodCallback === "function") {
			await methodCallback(req, res, next, context);
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
	}
}

interface MiddlewareOptions {
	/**
	 * The unique identifier for the middleware
	 * @example "auth"
	 */
	id: string;
}

export namespace Middleware {
	export type Options = MiddlewareOptions;
}
