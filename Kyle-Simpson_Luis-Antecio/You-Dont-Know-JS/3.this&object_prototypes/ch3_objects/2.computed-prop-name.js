//  computed property names in ES6
  // you can specify an expression, surrounded by a [ ] pair, in the key-name position of an object-literal declaration:

var prefix = 'foo';

var myObject = {
  [ prefix + 'bar' ]: 'hello',
  [ prefix + 'baz' ]: 'world'
}

myObject.foobar    //?
myObject['foobar'] //?
myObject.foobaz    //?
myObject['foobaz'] //?


// method access or property access? Same thing. why?

function foo() {
  console.log('foo');
}
// variable reference to function foo
var someFoo = foo; //?
var myObj = {
  someFoo: foo
};
// function foo references
foo;
someFoo;
myObj.someFoo; //?
// execution of the function
foo(); 
someFoo(); 
myObj.someFoo();

// ..because even when you declare a function expression as part of the object literal, that function doesn’t magically belong more to the object —
  // they are still just multiple references to the same function object:

var myObj2 = { 
  foob: function foob() {
    console.log('foob');
  }
}
var someFoob = myObj2.foob; //?
someFoob;
myObj2.foob; //?