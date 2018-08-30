// Examples from https://rollbar.com/blog/top-10-javascript-errors/

// Case 1:

var foo;
foo.bar;

class Quiz {
  render() {
    return this.state.items.map(item => `<li key=${item.id}>${item.name}</li>`);
  }
}
var quiz = new Quiz();
console.log(quiz.render());

// Case 2:

var testArray = undefined;
if (testArray.length === 0) {
  console.log("Array is empty");
}

// Case 3:

var testArray = null;
if (testArray.length === 0) {
  console.log("Array is empty");
}

// Case 5:

this.isAwesome();

// Case 6:

this.foo();

// Case 7: Broken

/*
  var a = new Array(1);
  function recurse(a) {
    a[0] = new Array(1);
    recurse(a[0]);
  }

  recurse(a);

  var a = new Array(4294967295); //OK
  var b = new Array(-1); //range error

  var num = 2.555555;
  document.writeln(num.toExponential(4)); //OK
  document.writeln(num.toExponential(-2)); //range error!

  num = 2.9999;
  document.writeln(num.toFixed(2)); //OK
  document.writeln(num.toFixed(105)); //range error!

  num = 2.3456;
  document.writeln(num.toPrecision(1)); //OK
  document.writeln(num.toPrecision(0)); //range error!
*/

// Case 8:

var testArray = ["Test"];

function testFunction(testArray) {
  for (var i = 0; i < testArray.length; i++) {
    console.log(testArray[i]);
  }
}

testFunction();

// Case 9:

var test = undefined;
test.value = 0;

// Case 10: Broken

/*
  function testFunction() {
    var bar;
  }
  console.log(bar);
*/

console.log("Success! No errors!");
