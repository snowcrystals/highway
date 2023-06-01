### Documentation

The documentation (API Reference) can be found on our [website](https://snowcrystals.dev/docs/highway)

### Examples

The following examples are written in TypeScript with decorators enabled. The examples do not show the required imports (because the only imports you will need are @snowcrystals/highway components).

For a non-decorator version, use a constructor and move the options to the super function inside the constructor (example below)

```js
class HelloWorldRoute extends Route {
	constructor(route) {
		super(route, options); // <-- Options are the options from the decorator, they are all optional
	}
}
```

#### Route Example

```ts
@ApplyOptions<Route.Options>({
	middleware: [[Methods.GET, "log"]]
})
class HelloWorldRoute extends Route {
	public [Methods.GET](req: Request, res: Response) {
		res.send("Hello World");
	}
}
```

#### Middleware Example

```ts
@ApplyOptions<Middleware.Options>({
	name: "log"
})
class LogMiddleware extends Middleware {
	public [Methods.GET](req: Request, res: Response, next: NextFunction) {
		console.log("Hello world route");
		next();
	}
}
```
