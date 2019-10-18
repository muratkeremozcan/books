var a = 42;
var b = '42';

a == b; //?
a === b; //?

// The [ 42 ] value has its ToPrimitive abstract operation called 
  // which results in the "42" value. From there, it’s just "42" == 42, which becomes 42 == 42
42 == [42]; //?
42 === [42]; //?


// boolean coercion coerces 42 to 1
var c = true;
a == c; //?
a == false; //?

// best not to use == with boolean
// If you avoid ever using == true or == false (aka loose equality with booleans) in your code,
  // you’ll never have to worry about this truthiness/falsiness mental gotcha.

// checking for truthy
if (a == true) {
  console.log('works');
}

// also bad if checking for truthyness (will fail!)
if (a === true) {
  console.log('works');
}

// good enough (works implicitly):
if (a) {
  console.log('works');
}

// better (works explicitly):
if (!!a) {
  console.log('works');
}

// also great (works explicitly):
if (Boolean( a )) {
  console.log('works');
}

//////
// with == loose equality , null and undefined are indistinguishable

null == undefined;

/*
The coercion between null and undefined is safe and predictable, 
  and no other values can give false positives in such a check. 
  I recommend using this coercion to allow null and undefined to be indistinguishable and thus treated as the same value.

var a = doSomething();
// null check only passes if the function does not return something
if (a == null) {
    // ..
}
// the explicit check is much uglier
if (a === undefined || a === null) {
  // ..
}
*/

// the corner cases around falsy value comparisons,

"0" == null;            // false
"0" == undefined;       // false
"0" == false;           // true -- UH OH!
"0" == NaN;             // false
"0" == 0;               // true
"0" == "";              // false

false == null;          // false
false == undefined;     // false
false == NaN;           // false
false == 0;             // true -- UH OH!
false == "";            // true -- UH OH!
false == [];            // true -- UH OH!
false == {};            // false

"" == null;             // false
"" == undefined;        // false
"" == NaN;              // false
"" == 0;                // true -- UH OH!
"" == [];               // true -- UH OH!
"" == {};               // false

0 == null;              // false
0 == undefined;         // false
0 == NaN;               // false
0 == [];                // true -- UH OH!
0 == {};                // false


// takeaway:
// If either side of the comparison can have true or false values, don’t ever, EVER use ==.  
// If either side of the comparison can have [], "", or 0 values, seriously consider not using ==.

// Four of the seven items on this list involve == false comparison, which we said earlier you should always, always avoid
"0" == false;           // true -- UH OH!
false == 0;             // true -- UH OH!
false == "";            // true -- UH OH!
false == [];            // true -- UH OH!

// and just don't use these for coercion
"" == 0;                // true -- UH OH!
"" == [];               // true -- UH OH!
0 == [];                // true -- UH OH!
