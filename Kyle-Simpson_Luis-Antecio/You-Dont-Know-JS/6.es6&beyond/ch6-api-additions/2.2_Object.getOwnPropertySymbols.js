// Symbols are  mostly used as special (meta) properties on objects. 
// So the Object.getOwnPropertySymbols(..) utility was introduced, which retrieves only the symbol properties directly on an object

var o = {
  foo: 42,
  [Symbol('bar')]: 'hello world',
  baz: true
};
Object.getOwnPropertySymbols(o); //?
