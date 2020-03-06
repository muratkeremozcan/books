// The algorithm first calls ToPrimitive coercion on both values, 
// and if the return result of either call is not a string, then both values are
// coerced to number values using the ToNumber operation rules, and compared numerically.

[42] < ['43']; //?
['43'] < 42; //?

// if both values are strings for the < comparison, simple lexicographic (natural alphabetic) comparison on the characters is performed:
// a and b are not coerced to numbers, because both of them end up as strings after the ToPrimitive coercion on the two arrays. 
 // So, "42" is compared character by character to "043", starting with the first characters "4" and "0", respectively. 
 // Since "0" is lexicographically less than "4", the comparison returns false.

['42'] < ['043']; //?
[4, 2] < [0, 4, 3]; //?


var a = { b: 42 };
var b = { b: 43 };
// a becomes [object Object] and b becomes [object Object], and so clearly a is not lexicographically less than b.
a < b; //?
a > a; //?
a == b; //?
// wtf
a <= b; //?
a >= b; //?
// Because the spec says for a <= b, it will actually evaluate b < a first, and then negate that result. 
// Since b < a is also false, the result of a <= b is true.
// there’s no way to prevent implicit coercion from occurring with relational comparisons like a < b, 
// lesson: ensure that a and b are of the same type explicitly before making the comparison.

// If coercion is helpful and reasonably safe, like in a 42 < "43" comparison, use it. 
 // On the other hand, if you need to be safe about a relational comparison, explicitly coerce the values first, before using < 
var a = [42];
var b = '043';

a < b; //?
Number(a) < Number(b); //?