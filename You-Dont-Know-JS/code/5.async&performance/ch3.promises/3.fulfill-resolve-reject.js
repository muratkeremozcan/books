// takeaway: promise constructor takes 2 callback parameters generally called (resolve, reject) . 
    // The callbacks provided to then  can also be called anything, generally called onFulfilled, onRejected
    // end with a catch(function(error) { .. }) for the whole package


var p = new Promise(function (X, Y) {
  X(); //  for fulfillment
  Y(); // for rejection
})
// The second parameter name is easy to decide. Almost all literature uses reject(..) as its name,
// and because that’s exactly (and only!) what it does.
// why do we not call X fulfill instead of resolve?

// note the difference : then <value> vs  catch<value>
var fulfilledPr = Promise.resolve(42); //?
var rejectedPr = Promise.reject('oops'); //?


///////
// the word 'resolve' in Promise.resolve(..) is accurate because it can result in fulfillment or rejection 

var rejectedThen = {
  then: function (resolved, rejected) {
    rejected('ooop pala');
  }
};
var rejectedProm = Promise.resolve(rejectedThen); //?


///////

// The first callback parameter of the Promise(..) constructor will unwrap either a thenable (identically to Promise.resolve(..)) or a genuine Promise

var rejectedPr = new Promise(function (resolver, rejector) {
  // whether this promise is fulfilled or rejected, the 1st parameter is used to 'unwrap' a promise or thenable just like Promise.resolve
  resolver(Promise.reject('Oopsow'));
  rejector(Promise.resolve('say hi'));
});
// note: in contrast, reject(..) does not do the unwrapping that resolve(..) does.
// If you pass a Promise/thenable value to reject(..), that untouched value will be set as the rejection reason.


rejectedPr.then(
  // how about the callbacks provided to then(..). What should they be called (both in literature and in code)? 
  // I would suggest fulfilled(..) and rejected(..):
  // note: the ES6 specification uses onFulfilled(..) and onRejected(..)

  function fulfilled() {
    // never gets here: A promise can be resolved , and not fulfilled! Because promise resolution can also end up in a rejection
  },
  function rejected(e) {
    console.log(e);
    console.log('haha');
  }
)
.catch(
  function(err) {
    console.log(err);
  }
)

// Promise.resolve does what the first promise constructor parameter does, so we can call them both 'resolve'
var hey = Promise.resolve(rejectedPr); //?