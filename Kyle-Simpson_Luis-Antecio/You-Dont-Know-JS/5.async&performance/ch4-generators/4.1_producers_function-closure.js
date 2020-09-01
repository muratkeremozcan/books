// example of a stateful producer that remembers the last value it gave out
// using function closure

var gimmeSomething = (function () {
  var nextVal;
  return function () {
    nextVal; //?
    if (nextVal === undefined) {
      nextVal = 1;
    }
    else {
      nextVal = (3 * nextVal) + 6;
    }
    nextVal; //?
    return nextVal;
  };
})();

gimmeSomething(); //?
gimmeSomething(); //?
gimmeSomething(); //?
gimmeSomething(); //?
