const unbreakablejs = require("./index.js");
const babel = require("babel-core");

const transform = fixture =>
  babel.transform(fixture, {
    plugins: [unbreakablejs]
  }).code;

it("add protection for member navigation", () => {
  const fixture = `foo.bar`;
  const expected = `typeof foo !== "undefined" && foo.bar;`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});

it("transforms file correct", () => {
  const fixture = `foo.bar()`;
  const expected = `typeof foo === "function" && foo.bar();`;

  expect(transform(fixture).trim()).toBe(expected.trim());
});
