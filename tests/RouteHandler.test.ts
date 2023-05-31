import { join } from "node:path";
import { RouteHandler } from "../src/lib/handlers/RouteHandler.js";
import { Collection } from "@discordjs/collection";
import { Server } from "../src/Server.js";
import { Route } from "#structures/Route.js";
import { methods } from "#types/Methods.js";

function isClass(input: unknown) {
	return typeof input === "function" && typeof input.prototype === "object";
}

describe("RouteHandler", () => {
	test("RouteHandler should be a class", () => {
		expect(isClass(RouteHandler)).toBe(true);
	});

	test("Constructor", () => {
		const path = join(process.cwd(), "tests", "mocks", "FileLoader");
		const loader = new RouteHandler(path);

		expect(loader.path).toBe(path);
		expect(loader.collection).toStrictEqual(new Collection());
	});

	test("loadAll", async () => {
		const path = join(process.cwd(), "tests", "mocks", "FileLoader");
		const loader = new RouteHandler(path);

		const server = new Server({ routePath: "" });
		await loader.loadAll(server);

		const mockRoute = loader.collection.get("/mock");
		expect(mockRoute).toBeInstanceOf(Route);
		expect(Reflect.get(mockRoute!, methods.GET)).toBeTypeOf("function");
	});
});