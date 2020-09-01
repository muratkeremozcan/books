// like Object, Array provides the  same iterator methods: entries(), values(), and keys() methods

var a = [5, 6, 7];
[...a.values()]; //?
[...a.keys()]; //?
[...a.entries()]; //?
[...a[Symbol.iterator]()]; //?
