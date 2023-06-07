import type { Route } from "#structures/Route.js";
import type { Server } from "../../Server.js";
import FileLoader from "./FileLoader.js";

export class RouteHandler extends FileLoader<Route> {
	/**
	 * Loads all the found routes of a given directory
	 * @param server The server requesting to load all routes
	 */
	public async loadAll(server: Server) {
		const files = await this.getFiles();

		for (const file of files) {
			const { default: construct } = await import(file);
			if (typeof construct === "function" && typeof construct.prototype === "object") {
				const originalRoute = this.parseRoute(file.replace(this.path, "").replace(".js", ""));
				const route = new construct();

				this.collection.set(originalRoute, route);
				route.onLoad(server, originalRoute);
			}
		}
	}

	/**
	 * Parses the routes to suite express routes requirements
	 * @param route The route to parse
	 */
	protected parseRoute(route: string): string {
		if (route.endsWith("index")) route = route.slice(0, route.length - 5);
		route = route.replace(/\[(.*?)\]/g, (matcher) => `:${matcher.slice(1, matcher.length - 1)}`);

		return route;
	}
}
