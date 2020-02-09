var a = 'foo';
var b = ['f', 'o', 'o']; 

// strings are arrays are somewhat similar 
a.length; //?
b.length; //?

a.indexOf('o'); //?
b.indexOf('o'); //?

var c = a.concat('bar'); //?
var d = b.concat('b', 'a', 'r'); //?

// KEY DIFFERENCE: JS strings are immutable
a[1] = 'O';
b[1] = 'O';
a; //?
b; //?

// none of the string methods that alter its contents can modify in-place, but rather must create and return new strings. 
c = a.toUpperCase(); //?
a === c; //?
// By contrast, many of the array methods that change array contents actually do modify in-place
b.push('!');
b; //?

// we can “borrow” non-mutation array methods against our string:
var j = Array.prototype.join.call(a, '-'); // ?
// j = a.join('-'); // you can't do this because a is a string

a === j //?
var jf = Array.prototype.map.call(a, function(v) {
  return v.toUpperCase() + '.'
}).join('');
jf //?

// reversing a string . Trivia!
// arrays have a reverse in-place-mutator method, strings do not
b.reverse(); //?
// a workaround is to covert the string into an array, perform the operation, and covert it back
a //?
var reverse_a = a.split('') // covert string to array: split into an array of characters
                 .reverse() // perform array operation
                 .join('') // convert array to a string: join array of characters back to a string

reverse_a; //?
// This approach doesn’t work for strings with complex (unicode) characters in them
  // use ESrever library for that https://github.com/mathiasbynens/esrever
