const unbreakablejs = require("./index.js");
const babel = require("babel-core");
const traverse = require("babel-traverse");

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

it("replaces memeber call expressions with optional call expressions", () => {
  const fixture = `
var num = 1;
num.toString();
  `;
  const expected = `
var num = 1;
num?.toString?.();
  `;

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

it.skip("combines with babel optional parsing", () => {
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

it.skip("code transfomed with unbreakable is the same as manually transformed and parsed", () => {
  const transformWithUnbreakable = fixture =>
    removeIrrelevantAstData(
      babel.transform(fixture, {
        plugins: [unbreakablejs],
        ast: true
      }).ast
    );
  const parseWithoutUnbreakable = fixture =>
    removeIrrelevantAstData(
      babel.parse(fixture, {
        plugins: ["@babel/plugin-proposal-optional-chaining"],
        ast: true
      })
    );

  expect(transformWithUnbreakable(`foo.bar()`)).toEqual(
    parseWithoutUnbreakable(`foo?.bar?.()`)
  );
});

it.skip("has the same output with optional chaining separate and together", () => {
  const transformUnbreakableWithOptChaining = fixture =>
    babel.transform(fixture, {
      plugins: [unbreakablejs, "@babel/plugin-proposal-optional-chaining"]
    }).code;
  const transformOptChaining = fixture =>
    babel.transform(fixture, {
      plugins: ["@babel/plugin-proposal-optional-chaining"]
    }).code;

  const fixture = `foo.bar()`;

  expect(transformUnbreakableWithOptChaining(fixture).trim()).toBe(
    transformOptChaining(transform(fixture)).trim()
  );
});

it("is indepotent", () => {
  const fixture = `foo?.bar?.();`;
  const transformOptChaining = fixture =>
    babel.transform(fixture, {
      plugins: ["@babel/plugin-proposal-optional-chaining"]
    }).code;

  expect(transform(transformOptChaining(fixture)).trim()).toBe(
    transformOptChaining(fixture.trim())
  );
});

const transform = fixture =>
  babel.transform(fixture, {
    plugins: [unbreakablejs]
  }).code;

const removeIrrelevantAstData = obj => {
  const locationKeywords = [
    "end",
    "loc",
    "column",
    "start",
    "innerComments",
    "leadingComments",
    "trailingComments",
    "checked",
    "__clone",
    "extra"
  ];
  for (const key in obj) {
    if (locationKeywords.includes(key)) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      removeIrrelevantAstData(obj[key]);
    }
  }
  return obj;
};
