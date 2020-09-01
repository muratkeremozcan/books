// careful when the ++ or --run (runs after the assignment if on the right side of a)
var a = 42;
var b = a++;
b
a

var c = --b;
c

// working around the above, an option is statement series operator.
  // This operator allows you to string together multiple standalone expression statements into a single statement:

//  The expression (x++, x) a means that 
 // the second x statement expression gets evaluated after the after side effects of the x++ expression, 
 // which means it returns the 43 value for assignment to y.

var x = 42, y;
x
y
y = (x++, x);
x
y

// delete is another side effecting operator
var obj = {
  a: 42
};

// The result value of the delete operator is true if the requested operation is valid/allowable, or false otherwise. 
 // But the side effect of the operator is that it removes the property (or array slot).

obj.a; //?   
delete obj.a;   //?
obj.a; //?          

// chained assignments
var k, l, m;

k = l = m = 42;
k
l
m
// A common mistake developers make with chained assignments is like var a = b = 42. 
// While this looks like the same thing, it’s not.


// function scenario
function vowels(str) {
  var matches;

  // if (str) {
  //   // pull out all the vowels
  //     
  //   matches = str.match(/[aeiou]/g); //?

  //   if (matches) {
  //     return matches;
  //   }
  // }

// note that the = operator has an obvious and at the same time non-obvious
  // side effect of assigning the result of the expression from the right side to the left
// using an idiom where we take advantage of the assignment side effect, 
  // we can simplify by combining the two if statements into one:
  if (str && (matches = str.match(/[aeiou]/g))) {
    return matches;
  }

}
vowels('Hello world'); //?


// The same reasoning about side effects goes for the compound-assignment operators like +=, -=, etc. 
 // For example, a = b += 2 is processed first as b += 2 (which is b = b + 2), 
 // and the result of that = assignment is then assigned to a.

a = b = 10;
a = b += 2;
a
b