const unbreakablejs = require("./index.js");
const babel = require("babel-core");

const transform = fixture =>
  babel.transform(fixture, {
    plugins: [unbreakablejs]
  }).code;

it("replaces member calls with optional member calls", () => {
  const fixture = `foo.bar`;
  const expected = `foo?.bar;`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("replaces member calls with optional member calls inside variable asign", () => {
  const fixture = `var bar = foo.bar`;
  const expected = `var bar = foo?.bar;`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("replaces call expressions with optional call expressions", () => {
  const fixture = `bar()`;
  const expected = `bar?.();`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("replaces member and call expression with optional versions", () => {
  const fixture = `foo.bar(baz.qux)`;
  const expected = `foo?.bar?.(baz?.qux);`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("replaces member expressions with computed property", () => {
  const fixture = `foo[1 + 1]`;
  const expected = `foo?.[1 + 1];`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("does not touch console", () => {
  const fixture = `console.log("foo")`;
  const expected = `console.log("foo");`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("protects assign", () => {
  const fixture = `qux.foo.value = 5`;
  const expected = `qux?.foo ? qux.foo.value = 5 : undefined;`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("combines with babel optional parsing", () => {
  const transform = fixture =>
    babel.transform(fixture, {
      plugins: [unbreakablejs, "@babel/plugin-proposal-optional-chaining"]
    }).code;
  const fixture = `
foo.bar;

foo.baz();
`;
  const expected = `
var _foo, _foo$baz, _foo2, _foo3;

(_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar;
(_foo$baz = (_foo3 = _foo2 = foo) === null || _foo3 === void 0 ? void 0 : _foo3.baz) === null || _foo$baz === void 0 ? void 0 : (_foo$baz === null || _foo$baz === void 0 ? void 0 : _foo$baz.call)(_foo2);
`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});
