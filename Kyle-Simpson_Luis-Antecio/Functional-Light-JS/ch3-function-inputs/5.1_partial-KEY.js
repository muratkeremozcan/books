// If a function takes multiple arguments, you may want to specify some of those up front and leave the rest to be specified later.
// Let’s imagine you’d like to set up several API calls where the URLs are known up front, 
// but the data and the callback to handle the response won’t be known until later.
// function ajax (url, data, callback) { }


/** partial utility
 * takes an fn for which function we are partially applying. 
 * Then, any subsequent arguments passed in are gathered into the presetArgs array and saved for later.
 * Then, the inner function’s own arguments are gathered into an array called laterArgs.
 * The inner function partiallyApplied(..) closes over both the fn and presetArgs variables so it can keep accessing them later, no matter where the function runs.
 */
function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}
// Partial application is a technique for reducing the arity (that is, the expected number of arguments to a function) 
// by creating a new function where some of the arguments are preset.
var partialArrow = (fn, ...presetArgs) => (...laterArgs) => fn(...presetArgs, ...laterArgs);

// original versions
function getPerson_org(data, cb) { 
  ajax( "http://some.api/person", data, cb ); 
}
function getOrder_org(data, cb) {
  ajax( "http://some.api/order", data, cb ); 
}
function getCurrentUser(cb) { 
  getPerson_org( { user: CURRENT_USER_ID }, cb ); 
} 


var getPerson = partial( ajax, "http://some.api/person" ); 
/*
var getPerson = function partiallyApplied(...laterArgs) { 
  return ajax( "http://some.api/person", ...laterArgs );
};  */
var getOrder  = partial( ajax, "http://some.api/order" );
/*
var getOrder = function partiallyApplied(...laterArgs) {
  return ajax( "http//some.api/order", ...laterArgs);
}; */

// We can either define getCurrentUser(..) with both the url and data arguments specified directly (version 1), 
var getCurrentUser_v1 = partial(ajax, "http://some.api/person", {user: CURRENT_USER_ID} );
/*
var getCurrentUser = function partiallyApplied(...laterArgs) {
  return ajax( "http://some.api/person", {user: CURRENT_USER_ID}, ...laterArgs );
}
*/

// or define getCurrentUser(..) as a partial application of the getPerson(..) partial application,
// specifying only the additional data argument (version 2).
var getCurrentUser_v2 = partial(getPerson,  {user: CURRENT_USER_ID} );
/*
var getCurrentUser = function outerPartiallyApplied(...outerLaterArgs) {
  var getPerson = function innerPartiallyApplied(...innerLaterArgs) {
    return ajax( "http://some.api/person", ...innerLaterArgs );
  }
  return getPerson( {user: CURRENT_USER_ID}, outerLaterArgs );
}
*/

// The idea in FP is wrapping functions into each other