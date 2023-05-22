import { existsSync, statSync } from "node:fs";
import { glob } from "glob";
import { Collection } from "@discordjs/collection";

/** Base class responsible for loading the files of the provided path */
export default class FileLoader<V> {
	/** The directory with all files that should be loaded */
	public path: string;

	/** A collection that holds all the loaded files */
	public collection: Collection<string, V>;

	public constructor(path: string) {
		this.path = path;
		this.collection = new Collection();
	}

	/**
	 * Returns an Array of valid filepaths found in the provided directory
	 * @throws InvalidDirectoryError if the provided path is not a directory
	 */
	protected async getFiles(): Promise<string[]> {
		if (!existsSync(this.path)) throw new Error("InvalidDirectory");
		if (!statSync(this.path).isDirectory()) throw new Error("InvalidDirectory"); // TODO: replace with custom error

		const paths = await glob("**/*.js", { cwd: this.path, withFileTypes: true, nodir: true });
		return paths.map((path) => path.fullpath());
	}
}
