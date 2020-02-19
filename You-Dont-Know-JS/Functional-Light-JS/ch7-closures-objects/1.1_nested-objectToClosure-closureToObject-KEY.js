// nested objects

{ // object -> closure
  var person = {
    name: 'Kyle Simpson',
    address: {
      street: '123 Easy St',
      city: 'JS ville',
      state: 'ES'
    }
  };
  person; //?

  // can be represented with nested closures
  function outer() {
    var name = 'Kyle Simpson';
    return middle();

    function middle() {
      var street = '123 Easy St';
      var city = 'JS ville';
      var state = 'ES';

      return function inner() {
        return [name, street, city, state];
      }
    }
  }

  outer()(); //?

}

{ // closure -> object
  function pointDistance(x1, y1) {
    return function distFromPoint(x2, y2) {
      return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
      );
    };
  }
  pointDistance(1,1)(4,5); //? 

  // point object replaces the closure that was created with distFromPoint
  function pointDist(point, x2, y2) { 
    return Math.sqrt(
      Math.pow(x2 - point.x1, 2) + Math.pow(y2 - point.y1, 2)
    );
  }
  pointDist( { x1: 1, y1: 1 }, 4, 5); //?

}