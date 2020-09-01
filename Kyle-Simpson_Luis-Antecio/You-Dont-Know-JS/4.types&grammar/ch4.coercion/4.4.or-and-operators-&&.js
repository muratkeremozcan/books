/////
// “operand selector operators.”   , not really boolean
// The value produced by a && or || operator is not necessarily of type Boolean. 
// The value produced will always be the value of one of the two operand expressions.

var a = 42;
var b = "abc";
var c = null;

// gotcha: || selects the first if both are true
a || b; //?
b || a; //?

// gotcha: && selects the last if both are true
a && b; //?
b && a; //? 

// if you want it to act in usual boolean logic, explicitly coerce it
Boolean(a || b); //?
Boolean(b || a); //?
Boolean(a && b); //?
Boolean(b && a); //?

// more senseful: if only one of them is true, || gets the truthy one no matter the order
c || b; //?
b || c; //?

// more senseful: if only one of them is false, && gets the false one not matter the order
c && b; //? 
b && c; //?

// if you want it to act in usual boolean logic, explicitly coerce it
Boolean(c && b); //? 
Boolean(b && c); //? 
Boolean(c || b); //? 
Boolean(b || c); //? 



// remember falsy values: false, "", -0, +0, null, undefined, NaN


// IMPORTANT! the GUARD operator
// && , the guard operator. “Selects” the second operand if and only if the first operand tests as truthy,

function foob() {
  return k;
  // return a;
}

var k = 42;

k && foob(); //?


"foo" && "bar"; //?
"bar" && "foo"; //? 
"foo" && ""; //?
"" && "foo"; //?


// the || operator: selects the first or selects the truthy value no matter the order
"foo" || "bar"; //?
"bar" || "foo"; //?
"foo" || "";   //?
""    || "foo"; //?

/// || operator vs tertiary

// This || idiom is extremely common, and quite helpful, but you have to use it only in cases where all falsy values should be skipped. 
// Otherwise, you’ll need to be more explicit in your test, and probably use a ? : ternary instead.

function foo(a, b) {
  a = a || "hello";
  b = b || "world";
  // b ? b : "world"; // better in this case

  console.log(a + " " + b);
}

foo();                  // "hello world"
foo("yeah", "yeah!"); // "yeah yeah!"
foo('That\'s it', ''); // oops


