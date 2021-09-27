function getData() {
  // ..
  return {
    a: 42,
    b: "foo"
  };
}

// { a, b } is actually ES6 destructuring shorthand for { a: a, b: b },
  // this is why you cannot rename a & b
var { a, b } = getData();
a
b
// roughly equivalent to
// var res = getData();
// var a = res.a;
// var b = res.b;
// the only difference is that you can rename the variables with this explicit form
var res = getData();
var x = res.a; //?
var y = res.b; //?

// Object destructuring with a { .. } pair can also be used for named function arguments,
  // which is sugar for this same sort of implicit object property assignment:
function foo({a, b, c}) {
  // noo need for var a = obj.a, b = obj.b, c = obj.c
  console.log(a, b, c);
}
// the verbose alternative
// function foo(obj) {
//   var a = obj.a;
//   var b = obj.b;
//   var c = obj.c;
//   console.log(a, b, c);
// }
foo( {
  c: [1,2,3],
  a: 42,
  b: "foo"
} );

// object destructuring with optional parameters: every parameter is optional with this. You can also set default parameters
function retrieveData({ section, sectionItem , callback, defaultTest = 1 }) {
  console.log('',section);
  console.log('', sectionItem); // omitted
  console.log('', callback);
  console.log('', defaultTest); // default
}

retrieveData({
  section: 'a',
  callback: () => {}
});

