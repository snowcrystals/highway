import type { Middleware } from "#structures/Middleware.js";
import type { Server } from "../../Server.js";
import FileLoader from "./FileLoader.js";

export class MiddlewareHandler extends FileLoader<Middleware> {
	/**
	 * Loads all the found middleware of a given directory
	 * @param server The server requesting to load all middleware
	 */
	public async loadAll(server: Server) {
		const files = await this.getFiles();

		for (const file of files) {
			const { default: construct } = await import(file);
			if (typeof construct === "function" && typeof construct.prototype === "object") {
				const middleware = new construct();

				this.collection.set(middleware.id, middleware);
				middleware.onLoad(server);
			}
		}
	}

	public get(id: string): Middleware | undefined {
		return this.collection.get(id);
	}
}
