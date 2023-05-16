import { join } from "node:path";
import FileLoader from "../src/lib/Handlers/FileLoader.js";
import { Collection } from "@discordjs/collection";

function isClass(input: unknown) {
	return typeof input === "function" && typeof input.prototype === "object";
}

describe("FileLoader", () => {
	test("FileLoader should be a class", () => {
		expect(isClass(FileLoader)).toBe(true);
	});

	test("Constructor", () => {
		const path = join(process.cwd(), "tests", "mocks", "FileLoader");
		const loader = new FileLoader(path);

		expect(loader.path).toBe(path);
		expect(loader.collection).toStrictEqual(new Collection());
	});

	test("getFiles", async () => {
		const path = join(process.cwd(), "tests", "mocks", "FileLoader");
		const loader = new FileLoader(path);

		// @ts-expect-error accessibility error
		expect(await loader.getFiles()).toStrictEqual([join(path, "mock.js")]);
	});
});
