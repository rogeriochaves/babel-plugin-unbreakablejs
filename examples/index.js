var foo = {};
var bar = foo.bar().baz;
console.log("bar", bar);

var qux = undefined;
qux.quux();

console.log("success!");
