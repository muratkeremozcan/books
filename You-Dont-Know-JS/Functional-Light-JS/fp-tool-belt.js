/** Creates a function that takes one argument and ignores subsequent arguments 
 * 
 * example: signatures not matching: `map(value, idx, arr)` and `parseInt(str, radix)`
 * 
 * `['1','2','3'].map(parseInt)` will not work
 * 
 * `['1','2','3'].map(unary(parseInt))`
 * 
 * `arrayValue <-- map <-- unary <-- parseInt`
*/
export const unary = fn => arg => fn(arg);

/** Creates a function that takes two arguments and ignores subsequent arguments */
export const binary = fn => (arg1, arg2) => fn(arg1, arg2);

/** Takes a value and returns it 
 * 
 * example: filtering out empty values from an array of words
 * 
 * `words.filter(identity)`
*/
export const identity = value => value;

/** To be used when a function needs to be passed in as an argument, as opposed to a value
 * 
 * example: promise api requires functions to be passed in
 * 
 * `.then(value)` will not work...
 * 
 * `.then(constant(value))`
*/
export const constant = value => () => value;

/** Spreads out a single received array argument into individual arguments
 * 
 * example: foo expects 2 parameters, bar takes 1 (as array) 
 * 
 * `foo(x, y){return x + y}`, `bar(fn){return fn([3,9])}` 
 * 
 * `bar(foo)` will not work
 * 
 * `bar(spreadArgs(foo))`
 */
export const spreadArgs = fn => argsArr => fn(...argsArr);

/** Gathers individual arguments into a single array
 * 
 * example: adapt a function with array destructuring to another utility that expects separate arguments
 * 
 * ex: reduce expects separate arguments, but a function passes in an array as the argument
 * 
 * `const combineFirstTwo = ([v1, v2]) => v1 + v2`
 * 
 * `[1,2,3].reduce(gatherArgs(combineFirstTwo))` 
 */
export const gatherArgs = fn => (...argsArr) => fn(argsArr);

/** Wraps a function, reverses its argument order 
 * 
 * `function join(){Array.from(arguments).join(',')}`
 * 
 * `join(1,2,3)` outputs 1,2,3
 * 
 * `reverseArgs(join)(1,2,3)` outputs 3,2,1
 */
export const reverseArgs = fn => (...argsArr) => fn(...argsArr.reverse());

/** Reduces the arguments , but sets up to partially apply the later arguments after the present ones
 * 
 * ex: getPerson function makes an ajax request with data and callback, we do not know what the data and callback will be
 * 
 * `function getPerson(data, cb){ajax(http://some.api/person', data, cb)}`
 * 
 * `let getPerson = partial(ajax,'http://some.api/person');`
 */
export const partial = (fn, ...presentArgs) => (...laterArgs) => fn(...presentArgs, ...laterArgs);

/** Reduces the arguments, but sets up to partially apply the later arguments before the present ones
 * 
 * `var filterWords = partialRight(compose, unique, words)`
 * 
 * `var biggerWords = filterWords(skipShortWords) // compose(skipShortWords, unique, words)`
 * 
 * `var shorterWords = filterWords(skipLongWords) //  compose(skipLongWords, unique, words)`
*/
export const partialRight = (fn, ...presentArgs) => (...laterArgs) => fn(...laterArgs, ...presentArgs);

/** Currying unwinds a single higher-arity function into a series of chained unary functions.
 *  Like partial, but can be helpful over partial in cases where arguments are known one at a time
 * 
 * `[1,2,3,4,5].map(partial(add,3));`
 * 
 * `[1,2,3,4,5].map(curry(add)(3));`
 * 
 * `curriedSum_loose(1)(2,3)(4,5,6,7);`
 */
export function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArg) { // ... for loose-currying
      let args = [...prevArgs, ...nextArg]; // ... for loose-currying
      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

/** Used for uncurrying a function that comes out curried as a result of some other set of operations,
 * ex: `f(1)(2)(3)` to `g(1,2,3)` 
 * 
 * `curriedSum(1)(2)(3)(4)(5);`
 * 
 * `var uncurriedSum = uncurry(curriedSum);`
 * 
 * `uncurriedSum(1, 2, 3, 4, 5);`
 * 
 * `uncurriedSum(1, 2, 3)(4)(5);`
 */
export const uncurry = fn => (...args) => {
  let ret = fn;
  for (let arg of args) {
    ret = ret(arg);
  }
  return ret;
}

/** Used to address ordering concerns with partial() When using object arguments. 
 * Can now specify which arguments we want in whatever sequence makes sense
 * 
 * `function foo({x,y,z}){console.log(`x: ${x} y: ${y} z: ${z}`)}
 * 
 * `let f1 = partialProps(foo, {y:2})`
 * 
 * `f1({z: 3,x: 1}) // x:1 y:2 z:3`
 */
export const partialProps = (fn, presentArgsObj) => (laterArgsObj) => fn(Object.assign({}, presentArgsObj, laterArgsObj));

/** Used to address ordering concerns with curry() when using objects as arguments.
 * Can now specify which arguments we want in whatever sequence makes sense.
 * 
 * `function foo({x,y,z}){console.log(`x: ${x} y: ${y} z: ${z}`)}
 * 
 * `let f2 = curryProps(foo, {y:2})`
 * 
 * `f2({y:2})({x:1})({z:3}) // x:1 y:2 z:3`
 */
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

/** Negation helper; complement() in FP libraries. 
 * 
 * `let isLongEnough = not(isShortEnough)`
 * 
 * `printIf(isLongEnough, message)`
*/
export const not = predicate => (...args) => !predicate(...args);

/** Utility to create a composition of two functions automatically. Functions compose right to left 
 * 
 * `let wordsFound = words(text)`
 * 
 * `let uniqueWordsFound = unique(wordsFound)`
 * 
 * `let uniqueWordsFoundCondensed = unique(words(text))`
 *   
 *  instead do: 
 * 
 * `let uniqueWordsComposed = compose2(unique,words)`
 * 
 * `uniqueWordsComposed(text)`
*/
export const compose2 = (fn2, fn1) => value => fn2(fn1(value));

/** Utility to compose many functions 
 * 
 * `var biggerWords = compose(skipShortWords, unique, words)`
 * 
 * `biggerWords(text)`
*/
export const compose = (...fns) => result => {
  let list = [...fns]; // copy the array of functions
  while (list.length > 0) { // take the last function off the end of the list and execute it
    result = list.pop()(result);
  }
  return result;
}

/** Composes functions in left to right order instead of compose's right to left 
 * 
 * `var biggerWords = compose(skipShortWords, unique, words)`
 * 
 * with pipe() it becomes:
 * 
 * `var biggerWords = pipe(words, unique, skipShortWords)`
*/
export const pipe = (...fns) => result => {
  let list = [...fns]; // copy the array of functions
  while (list.length > 0) { // take the first function off the beginning of the list and execute
    result = list.shift()(result);
  }
  return result;
}

/** extract a property by name off of an object */
export const prop = (name, obj) => obj[name];

/** sets a property by name to an object */
export const setProp = (name, obj, val) => {
  let o = Object.assign({}, obj);
  o[name] = val;
  return o;
}

/** wraps a value at an object at a specified property name : objOf in Ramda  */
export const makeObjProp = (name, value) => setProp(name, {}, value);

/** As long as a function is returned, the loop keeps going, executing that function and capturing its return, then checking its type. */
export const trampoline = fn => (...args) => {
  let result = fn(...args);
  while (typeof result == 'function') { result = result(); }
  return result;
}