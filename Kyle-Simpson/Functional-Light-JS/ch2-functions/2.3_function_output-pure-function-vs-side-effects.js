// two functions accomplish the same task, which should you prefer
// implicit vs explicit output
// we want to prefer pure functions and avoid side effects where possible

{ // the y assignment in the former is an implicit output.
  var y;
  function f(x) {
    y = 2 * Math.pow(x, 2) + 3;
  }
  f(2);
  y; //?
}

{ // the return in the latter version signals an explicit output : pure function
  function f(x) {
    return  2 * Math.pow(x, 2) + 3;
  }
  var y = f(2);
  y; //?
}



{ // side effects: changing a variable in an outer scope can be more subtle
  function sum(list) {
    var total = 0;

    for ( let i = 0; i < list.length; i++ ) {
      if (!list[i]) {
        // The harmless looking list[i] = 0 operation ends up affecting the array value on the outside,
        // even though we operated on a local list parameter variable.
        // Because list holds a reference-copy of the nums reference, not a value-copy of the [1,3,9,..] array value.
        // JavaScript uses references and reference-copies for arrays, objects, and functions, 
        // so we may create an accidental output from our function all too easily.
        list [i] = 0; 
      }
      total = total + list[i];
    }
    return total;
  }
  var nums = [1, 3, 9, 27, , 84];
  sum (nums); //?
  nums; //?
}