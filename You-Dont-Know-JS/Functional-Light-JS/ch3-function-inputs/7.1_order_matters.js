// currying and partial provide individual arguments to a function separately. 
// The downside is that they are based on positional arguments. How do we address ordering concerns in partial and curry?

// with these utilities Even with currying or partial application, order doesn’t matter anymore
// We can now specify which arguments we want in whatever sequence makes sense. No

export function curryProps(fn, arity = 1) {
  return (function nextCurried(prevArgsObj) {
    return function curried(nextArgObj = {}) {
      var [key] = Object.keys(nextArgObj);
      var allArgsObj = Object.assign({}, prevArgsObj, { [key]: nextArgObj[key] });

      if (Object.keys(allArgsObj).length >= arity) {
        return fn(allArgsObj);
      } else {
        return nextCurried(allArgsObj);
      }
    };
  })({});
}

export function partialProps(fn, presetArgsObj) {
  return function partiallyApplied(laterArgsObj) {
    return fn(Object.assign({}, presetArgsObj, laterArgsObj));
  };
}

// usage

function foo({ x, y, z } = {}) {
  console.log(`x: ${x} y: ${y} z: ${z}`);
}

var f1 = curryProps(foo, 3);
var f2 = partialProps(foo, { y: 2 });

f1({ y: 2 })({ x: 1 })({ z: 3 });
f2({ z: 3, x: 1 });