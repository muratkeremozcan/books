{ // union type: uses | , meaning either this type or that type 
 
  function combine(
    input1: number | string, // union type
    input2: number | string
  ) {
    let result: number | string;

    if (typeof input1 === 'number' && typeof input2 === 'number') {
      result = input1 + input2;
    } else {
      result = input1.toString() + input2.toString();
    }
    return result;
  }

  combine(30, 26); //?
  combine('Murat', ' Kerem'); //?
}


{ // literal type : the explicit possible values for the argument 
  // custom type : typically custom types are used by union types
  
  type ConversionDescriptor = 'as-number' | 'as-string'; // custom type (literal type)
  type Combinable = number | string; // custom type (union type)

  function combineAndForceConversion(
    input1: Combinable,
    input2: Combinable,
    forceConversion: ConversionDescriptor
    // forceConversion: 'as-number' | 'as-string' // alternative: literal type
  ) {
    let result: Combinable;

    if (forceConversion === 'as-number') {
      // you can use either Number(..) or + before the variable to covert the type
      result = Number(input1) + +input2; //?
    } else {
      result = input1.toString() + input2.toString();
    }
    return result;
  }

  combineAndForceConversion(30, 26, 'as-number'); //?
  combineAndForceConversion(30, 26, 'as-string'); //?
}


/////
{ // note about parsing numeric strings
  // a number can be parsed out of a string's character contents with parseInt, parseFloat, Number or +
  // parseInt & parseFloat are more tolerant than Number and +, they strips out non-numeric characters

  // Coerce a string to a number (with Number(..) or +) when the only acceptable values are numeric and something like "42px" should be rejected as a number.
  // Parse a string as a number (with parseInt or parseFloat) when you don’t know/care what other non-numeric characters there may be on the right-hand side. 

  var a = '42';
  var b = '42px';
  Number(a); //?
  Number(b); //?
  +a; //?
  +b; //?
  // parseInt and parseFloat are more tolerant than Number and +
  parseInt(a); //?
  parseInt(b); //?
  parseFloat(b); //?
}
