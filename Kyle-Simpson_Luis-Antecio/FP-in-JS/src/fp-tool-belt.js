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

/** This-aware partial to work with array methods in composition.
 * Partial reduces the arguments, but sets up to partially apply the later arguments after the present ones.
*/
export const partialThis = (fn, ...presentArgs) =>
  function partiallyApplied(...laterArgs) { // intentional function to allow this binding
    return fn.apply(this, [...presentArgs, ...laterArgs]);
  }

/** Currying unwinds a single higher-arity function into a series of chained unary functions.
 *  Like partial, but can be helpful over partial in cases where arguments are known one at a time
 * 
 * `[1,2,3,4,5].map(partial(add,3));`
 * 
 * `[1,2,3,4,5].map(curry(add)(3));`
 * 
 * `curriedSum_loose(1)(2,3)(4,5,6,7);`
 * 
 *  TL,DR; if there are more arguments specified in the function than we currently have, return the fn (in curried state).
 *  If we got enough args, execute it
 * 
 *  ex2: find function expects 2 arguments (db, id)
 * 
 * `find(db); //? curried state is returned
 * 
 * `find(db)('123'); //? executed
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
 * 
 * instead of `skipShortWords(unique(words('text')))`
*/
export const compose = (...fns) => result => {
  let list = [...fns]; // copy the array of functions
  while (list.length > 0) { // take the last function off the end of the list and execute it with result argument
    result = list.pop()(result);
  }
  return result;
}

/** This-aware compose to work with array methods in composition */
export const composeChainedMethods = (...fns) => result =>
  fns.reduceRight(
    (result, fn) => fn.call(result),
    result
  );


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
 
/** Sets a property by name to an object. 
 * Clones the object before setting the new property, avoiding side effects
*/
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

/** filters an array to include only unique values. Searches with indexOf() which uses strict equality comparison 
 * 
 * `unique([1,4,7,1,3,1,7]); //? [1,4,7,3]`
*/
export const unique = arr => arr.filter((v, idx) => arr.indexOf(v) == idx);

/** Similar to experimental array.flat() https://devdocs.io/javascript/global_objects/array/flat. 
 * 
 * The difference is that the optional depth is set to infinity; everything is flattened.
 * 
 * `var arr = [1, 2, [3, 4, [5, 6]]];`
 * 
 * `arr.flat(); // [1,2,3,4,[5,6]]`
 * 
 * `flatten(arr); // [1,2,3,4,5,6]`
 */
export const flatten = (arr, depth = Infinity) => arr.reduce(
  (list, v) =>
    list.concat(depth > 0 ?
      (depth > 1 && Array.isArray(v) ?
        flatten(v, depth - 1) : v
      )
      : [v]
    )
  , []);

/** Zip alternates selection of values from each of two input lists into sub-lists.
 * If the two lists are of different lengths, the selection of values will continue until the shorter list has been exhausted, 
 * with the extra values in the other list ignored.
 *
 * `zip([1,3,5,7,9], [2,4,6,8,10]); //? [[1,2], [3,4], [5,6], [7,8], [9,10]]`
*/
export const zip = (arr1, arr2) => {
  let zipped = [];
  arr1 = [...arr1]; //to c lone an array (and work around reference copy), wrap the argument in array and spread it
  arr2 = [...arr2];
  while (arr1.length > 0 && arr2.length > 0) {
    zipped.push([arr1.shift(), arr2.shift()]);
  }
  return zipped;
}

/** Merges two lists by interleaving values from each source.
 * 
 * `merge( [1,3,5,7,9], [2,4,6,8,10] ); // [1,2,3,4,5,6,7,8,9,10]`
 */
export const merge = (arr1, arr2) => {
  let merged = [];
  arr1 = [...arr1];
  arr2 = [...arr2];
  while (arr1.length > 0 || arr2.length > 0) {
    if (arr1.length > 0) {
      merged.push(arr1.shift());
    }
    if (arr2.length > 0) {
      merged.push(arr2.shift());
    }
  }
  return merged;
}

/** Merges multiple lists by interleaving values from each source. */
export const mergeReducer = (merged, v, idx) => (merged.splice(idx * 2, 0, v), merged);

/** FP style filter. Array is received last. */
export const filter = curry(
  (predicateFn, arr) => arr.filter(predicateFn)
);

/** FP style map. Array is received last. 
 * 
 * `var x = [3]`
 
 * `map( v => [v, v + 1], x)` //? [[3, 4]]
*/
export const map = curry(
  (mapperFn, arr) => arr.map(mapperFn)
);

/** FP style flatMap. Array is received last. 
 * 
 * `var x = [3]`
 
 * `map( v => [v, v + 1], x)` //? [3, 4]
*/
export const flatMap = curry(
  (mapperFn, arr) =>
    arr.reduce((list, v) =>
      list.concat(mapperFn(v)), []
    )
)

var flatMapf = curry(function flatMap(mapperFn, arr) {
  return arr.reduce(function reducer(list, v) {
    return list.concat(mapperFn(v));
  }, []);
});

/** FP style reduce. Array is received last. */
export const reduce = curry(
  (reducerFn, initialValue, arr) => arr.reduce(reducerFn, initialValue)
);

/** Used to adapt methods to Stadalones; utilized for curried list operators
 * 
 * `const filter = unboundMethod('filter', 2);`
 * 
 * `const map = unboundMethod('map', 2);`
*/
export const unboundMethod = (methodName, argCount = 2) => curry(
  (...args) => {
    let obj = args.pop();
    return obj[methodName](...args);
  },
  argCount
);

/** Used to map conditional-guarded functions.
 * The result is an array of functions that are ready to compose
 * 
 * `[getSessionId, lookupUser, getUserId, lookUpOrders, processOrders].map(guard);`
 */
export const guard = fn => arg =>
  arg != null
    ? fn(arg)
    : arg;

/** Monad Just. a simple monadic wrapper for any regular (aka, non-empty) value.
  *   
  * all Just instances have map(..), chain(..) / flatMap(..)), and ap(..) methods.
  * 
  * ap(..) takes the value wrapped in a monad and “applies” it to another monad using that other monad’s map(..). 
 */
export function Just(val) { // notice that val is never changed
  return { map, chain, ap, inspect };
  // ********************* 
  function map(fn) {
    return Just(fn(val));
  }
  function chain(fn) { // aka: bind, flatMap 
    return fn(val);
  }
  function ap(anotherMonad) {
    return anotherMonad.map(val);
  }
  function inspect() { // included for demo purposes
    return `Just(${val})`;
  }
}

/** Monad Nothing */
export function Nothing() {
  return { map: Nothing, chain: Nothing, ap: Nothing, inspect };
  function inspect() {
    return "Nothing";
  }
}

/** Maybe, if a value is non-empty, it’s represented by an instance of Just(..) 
 * If it’s empty, it’s represented by an instance of Nothing().
*/
export const Maybe = { Just, Nothing, of/* aka: unit, pure */: Just };

/** true if the value is null or undefined */
export const isEmpty = val => val === null || val === undefined;

/**  
 * does the empty-check, and selects either a Nothing() monad instance if so, 
 * or wraps the value in a Just(..) instance (via Maybe.of(..)).
*/
export const safeProp = curry( function safeProp(prop,obj){
  if (isEmpty(obj[prop])) return Maybe.Nothing();
  return Maybe.of( obj[prop] );
});


/** alternation takes two functions and returns the result of the first one if the value is defined (not false, null, or undefined); 
 otherwise, it returns the result of the second function.
*/
export const alternation = (func1, func2) => val => func1(val) || func2(val)


// functional combinators

/** takes two functions and returns the result of the first one if the value is defined (not false, null, or undefined); 
otherwise, it returns the result of the second function. */
export const alt = curry((func1, func2, val) => func1 ? func1(val) : func2(val));

/** process a single resource (val) in two different ways (f1, f2) and then combine the results */
export const fork = (join, func1, func2) => (val) => join(func1(val), func2(val));