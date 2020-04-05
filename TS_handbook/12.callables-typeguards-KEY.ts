// You can annotate callables as a part of a type or an interface as follows
// An interface can provide multiple callable annotations to specify function overloading


// declarations
function stringOrNumber(foo: number): number;
function stringOrNumber(foo: string): string;
function stringOrNumber(foo: boolean, bar?: number, ...others: string[]): 'string'

// with the implementation you use type guard, which allows you to narrow down the type of an object within a conditional blocs

// Type Guard (1) : using typeof with function argument signatures
function stringOrNumber(foo: any): any {
  if (typeof foo === 'number') {
    return foo ** 2;
  } else if (typeof foo === 'string') {
    return `hello ${foo}`;
  } else {
    return 'wth';
  }
}
stringOrNumber(11); //?
stringOrNumber('oi'); //?
stringOrNumber(true, 0, ''); //?

// using interface instead of multiple function declarations
interface Overloaded {
  (foo: string): string,
  (foo: number): number,
  (foo: boolean, bar?: number, ...others: string[]): string
}
const overloaded: Overloaded = stringOrNumber;

overloaded(11); //?
overloaded('oi'); //?
overloaded(true, 0, ''); //?

// can also do type annotation, instead of an interface
const overloadedTypeAnno: {
  (foo: string): string
  (foo: number): number
  (foo: boolean, bar?: number, ...others: string[]): string
} = stringOrNumber;

overloadedTypeAnno(11); //?


//////
// arrow syntax: a function that takes a number and returns a string
// Only limitation of the arrow syntax: You can't specify overloads. 
// For overloads you must use the full bodied function(someArgs): someReturn  syntax
const simple: (foo: number) => string
  = (foo) => foo.toString();
    
typeof simple(3); //?
///////


// Type Guard (2): using instanceof with classes
class Foo {
  foo = 123;
  common = '123';
}
class Bar {
  bar = 123;
  common = '123';
}
function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo);
    console.log(arg.bar);
  }
  else {
    console.log(arg.bar);
    console.log(arg.foo);
  }
}
doStuff(new Foo());
doStuff(new Bar());


//////
// Type Guard (3): using in with function argument interfaces
// in operator does a safe check for the existence of a property in an object
interface A {
  x: number;
}
interface B {
  y: string
}
function doStuffs(arg: A | B) {
  if ('x' in arg) {
    arg; //?
  } 
  else {
    arg; //?
  }
}
doStuffs({ x: 1 });
doStuffs({ y: '2' });


/////
// Type Guard (4): using literal types

type TriState = 'yes' | 'no' | 'unknown';

function logOutState(state:TriState) {
  if (state == 'yes') {
    console.log('User selected yes');
  } else if (state == 'no') {
    console.log('User selected no');
  } else {
    console.log('User has not made a selection yet');
  }
}
logOutState('yes');
logOutState('bla');

// strictNullCheck strict null check !=
// TypeScript is smart enough to rule out both null and undefined with a == null / != null check
function notNullOrUndef(a?: number | null) {
  if (a != null) {
    return a;
  } else if (a == null) { // not necessary. For demo purpose
    return 'nothing';
  }
}
notNullOrUndef(1);//?
notNullOrUndef(); //?
