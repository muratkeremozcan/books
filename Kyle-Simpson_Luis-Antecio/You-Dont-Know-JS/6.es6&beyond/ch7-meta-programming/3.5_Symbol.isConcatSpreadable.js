// The @@ isConcatSpreadable symbol can be defined as a boolean property (Symbol.isConcatSpreadable) on any object (like an array or other iterable)
//  to indicate if it should be spread out if passed to an array concat(..).

var a = [1, 2, 3],
    b = [4, 5, 6];

[].concat(a, b); //? 
    
b[Symbol.isConcatSpreadable] = false;
[].concat(a, b); //?
