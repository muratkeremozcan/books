// generics are for declaring a type of function that can have multiple run-time type values
// Open - Closed Principle
// In object-oriented programming, the open/closed principle states "software entities (classes, modules, functions, etc.) 
// should be open for extension, but closed for modification"; 
// that is, such an entity can allow its behavior to be extended without modifying its source code.

{
  // ex: 1
  function identity<T>(arg: T): T {
    return arg;
  }
  
  // type of output will be 'string', the compiler will figure out `T` based on the value passed in
  let output = identity<string>('myString'); //?

  // type f output will be number
  let output2 = identity<number>(5);
}

{ // interface with generics
  interface identType<T> { 
    // you can introduce some structure here if you want
  }
  function identityWithInterface<identType>(arg: identType): identType {
    return arg;
  }

  let output: identType<string> = identityWithInterface<string>('myString'); //?

  let output2: identType<number> = identityWithInterface<number>(5); //?
}


////// ex: 2

class Person {
  FirstName: string
}

let people: Person[] = [];  // or  Array<Person> = []
people.push({ FirstName: 'John' });

// john is of type Person, the typescript compiler knows this
// because we've declared the people variable as an array of Person
let john = people.pop();

john.FirstName; //?


////// ex: 3

interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>

x = y; // ok because x's structure matches y

interface NotEmpty<T> {
  data: T;
}

let a: NotEmpty<number>;
let b: NotEmpty<string>;

a = b; // TS will complain because the structure does not match