import type { NextFunction, Request, Response } from "express";
import { METHODS } from "http";

/** All possible HTTP methods */
export type Methods =
	| "ACL"
	| "BIND"
	| "CHECKOUT"
	| "CONNECT"
	| "COPY"
	| "DELETE"
	| "GET"
	| "HEAD"
	| "LINK"
	| "LOCK"
	| "M-SEARCH"
	| "MERGE"
	| "MKACTIVITY"
	| "MKCALENDAR"
	| "MKCOL"
	| "MOVE"
	| "NOTIFY"
	| "OPTIONS"
	| "PATCH"
	| "POST"
	| "PRI"
	| "PROPFIND"
	| "PROPPATCH"
	| "PURGE"
	| "PUT"
	| "REBIND"
	| "REPORT"
	| "SEARCH"
	| "SOURCE"
	| "SUBSCRIBE"
	| "TRACE"
	| "UNBIND"
	| "UNLINK"
	| "UNLOCK"
	| "UNSUBSCRIBE";

export const methods = Object.fromEntries(METHODS.map((method) => [method, Symbol(`HTTP-${method}`)])) as Record<Methods, symbol>;

export type MethodContext = Record<string, unknown>;
export type Awaitable<T> = Promise<T> | T;
export type MethodCallback = (req: Request, res: Response, next: NextFunction, context: MethodContext) => Awaitable<unknown>;
