# unbreakable.js babel plugin

## `undefined = function () {}`

What if undefined was actually a function? Have you thought about that? You'd get rid of all those annoying `undefined is not a function` errors for ever. And that's exactly what unbreakable.js is about!

Nowadays there are projects like [Elm](http://elm-lang.org/) which gives you zero runtime exceptions by enforcing very strict types, also [TypeScript](https://www.typescriptlang.org/), [Flow](https://flow.org/) and [PureScript](http://www.purescript.org/) that push you in this direction.

But what if we went through the opposite way? Never break the code, not because we have a very strict language, but because we have a very loose one, that just accepts everything. If you watched the [Wat](https://www.destroyallsoftware.com/talks/wat) talk you probably know that JavaScript is pretty much like that already.

In JS you can do `[] - {}` no problem, and it gives `NaN` which is actually not a lie! Most other languages would complain when you do math operations with things that aren't numbers. But what if we took that to the next level?

```javascript
var analytics = {};
analytics.track(); // undefined is not a function

veryImportantTask();
```

The code above will break, and the `veryImportantTask` will never get executed just because some useless tracking failed.

Errors like those are the top cause of JavaScript errors [according to the Rollbar report](https://rollbar.com/blog/top-10-javascript-errors/). What unbreakable.js does then, is replacing all expressions in your code like the one above with the new [optional chaining](https://github.com/tc39/proposal-optional-chaining).

```javascript
var analytics = {};
analytics?.track?.(); // no errors!

veryImportantTask?.();
```

Unbreakable.js can prevent 7 out of 10 top errors from the [top 10 javascript errors](https://rollbar.com/blog/top-10-javascript-errors/) automatically. Check out the `examples/simple.js` file to see the example cases.

Will you get invalid state and business logic? Probably. Will you get lots of `undefined` and `NaN` on the screen for the user to see? Well, yes, but hey, at least your code will run for sure!

## How to use

1. Install the dependencies

   ```bash
   npm install git+https://github.com/rogeriochaves/babel-plugin-unbreakablejs.git @babel/plugin-proposal-optional-chaining
   ```

1. Add the plugins to your .babelrc file (don't know how to use babel? [check it out](https://babeljs.io/setup))

   ```json
   {
     "plugins": ["unbreakablejs", "@babel/plugin-proposal-optional-chaining"]
   }
   ```

1. Profit!

## Transformations

1. Member Expressions to Optional Member Expressions

   Before:

   ```javascript
   foo.bar;
   ```

   After:

   ```javascript
   foo?.bar;
   ```

1. Call Expressions to Optional Call Expressions

   Before:

   ```javascript
   foo();
   ```

   After:

   ```javascript
   foo?.();
   ```

1. Protected member asignment

   Before:

   ```javascript
   foo.bar.baz = true;
   ```

   After:

   ```javascript
   foo?.bar ? (foo.bar.baz = true) : undefined;
   ```

1. Throws are just console.errors

   Before:

   ```javascript
   throw "some error";
   ```

   After:

   ```javascript
   console.error("some error");
   ```

## Bug Reports

Did your code break in any way after using unbreakable? That's a bug! Unbreakable should strive to be absolutely unbreakable! Please [open an issue](https://github.com/rogeriochaves/unbreakablejs/issues).

## Disclaimer

Please don't use this in production, it's just a crazy idea and also in beta
