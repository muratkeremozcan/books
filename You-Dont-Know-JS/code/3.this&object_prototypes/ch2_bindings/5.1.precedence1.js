function foo() {
  console.log( this.a );
}

var obj1 = {
  a: 1,
  foo: foo
};

var obj2 = {
  a: 2,
  foo: foo
};

obj1.foo(); //? 1
obj2.foo(); //? 2
// explicit binding > implicit binding
obj1.foo.call( obj2 ); //? 2
obj2.foo.call( obj1 ); //? 1
