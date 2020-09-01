// Readonly as type 
// There is a type Readonly that takes a type T and marks all of its properties as readonly using mapped types

type Foo = {
  bar: number;
  bas: number;
}

type FooReadonly = Readonly<Foo>; 

let foo:Foo = {bar: 123, bas: 456};
let fooReadonly:FooReadonly = {bar: 123, bas: 456};

foo.bar = 456; // Okay
fooReadonly.bar = 456; // ERROR: bar is readonly


// TypeScript ships with a ReadonlyArray<T> to allow you to use native JavaScript arrays in an immutable fashion.
let fooArr: ReadonlyArray<number> = [1, 2, 3];
console.log(fooArr[0]);   // Okay
fooArr.push(4);           // Error: `push` does not exist on ReadonlyArray as it mutates the array
fooArr = fooArr.concat([4]); // Okay: create a copy

// still mutates it, but at least you were warned
fooArr; //?