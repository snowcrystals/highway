<div align="center">
    <img src="https://raw.githubusercontent.com/snowcrystals/.github/main/logo.png" width="100px" />
    <h1>@snowcrystals/highway</h1>
  
  <p>Building API routes has never been easier 🛣️</p>
  
  <p align="center">
    <a href="/">
        <img alt="Version" src="https://img.shields.io/badge/version-1.0.3-blue.svg" />
    </a>
    <a href="/LICENSE" target="_blank">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    </a>
  </p>
</div>


<div align="center">
   <a href="https://ijskoud.dev/discord" target="_blank">
    <img src="https://ijskoud.dev/discord/banner" />
  </a>
  <br />
   <a href="https://vercel.com/?utm_source=snowcrystals&utm_campaign=oss" target="_blank">
    <img src="https://raw.githubusercontent.com/snowcrystals/.github/main/vercel.svg">
  </a>
</div>

---

## Information

Create routes and middleware using classes and a filepath based routing system like Next.js.

## Install

```
yarn add @snowcrystals/highway express
npm install @snowcrystals/highway express
```

### Documentation

The documentation (API Reference) can be found on our [website](https://snowcrystals.dev/docs/highway)

### Examples

The following examples are written in TypeScript with decorators enabled. The examples do not show the required imports (because the only imports you will need are @snowcrystals/highway components).

For a non-decorator version, use a constructor and move the options to the super function inside the constructor (example below)

```js
class HelloWorldRoute extends Route {
	constructor() {
		super(options); // <-- Options are the options from the decorator, they are all optional
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


## Author

👤 **ijsKoud**

-   Website: https://ijskoud.dev/
-   Email: <hi@ijskoud.dev>
-   Twitter: [@ijsKoud](https://ijskoud.dev/twitter)
-   Github: [@ijsKoud](https://github.com/ijsKoud)

## Donate

This will always be open source project, even if I don't receive donations. But there are still people out there that want to donate, so if you do here is the link [PayPal](https://ijskoud.dev/paypal) or to [Ko-Fi](https://ijskoud.dev/kofi). Thanks in advance! I really appriciate it <3

## License

Project is licensed under the © [**MIT License**](/LICENSE)

---
