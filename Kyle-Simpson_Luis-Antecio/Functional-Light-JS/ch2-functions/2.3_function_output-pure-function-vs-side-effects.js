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
    return 2 * Math.pow(x, 2) + 3;
  }
  var y = f(2);
  y; //?
}


{ // side effect example: Kyle FP lite PluralSight
  function foo(x) {
    y = y * x;
    z = y * x;
  }
  let y = 2, z = 3;

  foo(5);
  y; //?
  z; //? 

  // variables change every time foo is called
  foo(5);
  y; //?
  z; //? 
}
{ // how do we address the side effect? 
  // Contain the side effecting function and all variables in a pure wrapping function
  function bar(x, y, z) {
    foo(x);
    return [y, z];

    function foo(x) {
      y = y * x;
      z = y * x;
    }
  }
  bar(5, 2, 3); //?
  bar(5, 2, 3); //?
  bar(5, 10, 15); //?
  let [x, y] = bar(5, 10, 15); //?
  // you can get the values out with destructuring
  x;
  y;
}

{ // exercise : Kyle FP lite PluralSight
  function foo(x) {
    y++;
    z = x * y;
  }
  var y = 5, z;

  foo(20);
  z;

  foo(20);
  z;
}
{ // solution
  function bar(x, y) {
    var z;
    foo(x);
    return z;
    function foo(x) {
      y++;
      z = x * y;
    }
  }
  bar(20, 5); //?
  bar(20, 5); //?
}


{ // side effects: changing a variable in an outer scope can be more subtle
  function sum(list) {
    var total = 0;

    for (let i = 0; i < list.length; i++) {
      if (!list[i]) {
        // The harmless looking list[i] = 0 operation ends up affecting the array value on the outside,
        // even though we operated on a local list parameter variable.
        // Because list holds a reference-copy of the nums reference, not a value-copy of the [1,3,9,..] array value.
        // JavaScript uses references and reference-copies for arrays, objects, and functions, 
        // so we may create an accidental output from our function all too easily.
        list[i] = 0;
      }
      total = total + list[i];
    }
    return total;
  }
  var nums = [1, 3, 9, 27, , 84];
  sum(nums); //?
  nums; //?
}