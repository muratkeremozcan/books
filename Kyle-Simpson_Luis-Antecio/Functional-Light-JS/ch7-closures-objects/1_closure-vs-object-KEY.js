// a closure is when a function remembers the variables around it
// even when that function is executed elsewhere

{ // a closure is a poor man's object!
  function outer() {
    // the vars in this scope are being used / closed over by function inner
    var one = 1;
    var two = 2;

    return function inner() {
      return one + two;
    };
  }

  var three = outer();
  three(); //?
}


{ // an object is a poor man's closure
  var obj = {
    one: 1,
    two: 2
  };
  // the function is using / closing over the object's scope
  function three(outer) {
    return outer.one + outer.two;
  }
  three(obj); //? 
}


///////////////
///////////////
// 1:1 comparison

{ // represent closure as an object
  function outer() {
    var x = 10;
    var y = 12;
    var z = 14;

    return function inner() {
      return [x, y, z];
    };
  }

  var [x, y, z] = outer()() //?
  x;
  y;
  z;
}

{ // represent an object as a closure
  var point = {
    x: 10,
    y: 12,
    z: 14
  }

  var { x, y, z } = point;
  x;
  y;
  z;
}
