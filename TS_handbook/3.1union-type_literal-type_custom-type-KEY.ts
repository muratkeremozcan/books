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
  // custom type : typically custom types are used by union types. Also called Type Alias.
  
  type ConversionDescriptor = 'as-number' | 'as-string'; // custom type with a literal type
  type Combinable = number | string; // custom type with a union type

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
      // if you instead use parseInt or parseFloat, you have to use typeCasting, because input can be either string or number
      // result = parseInt(<string>input1) + +input2; //? 
    } else {
      result = input1.toString() + input2.toString();
    }
    return result;
  }

  combineAndForceConversion(30, 26, 'as-number'); //?
  combineAndForceConversion(30, 26, 'as-string'); //?


  /// other type alias examples
  type Text = string | { text: string };
  type Coordinates = [number, number];
  type Callback = (data: string) => void;
  // tip: if you need to have hierarchies of Type annotations use an interface. They can be used with implements and extends
  // tip: Use a type alias for simpler object structures (like Coordinates) just to give them a semantic name. 
  // Also when you want to give semantic names to Union or Intersection types, a Type alias is the way to go.
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
