// the saving of keystrokes is a red-herring, a misleading side show
// recall 3.this&object_prototypes/ch2_bindings/lexical_this.3-ways-arrow-self-bind.js
// Inside arrow functions, the this binding is not dynamic, but is instead lexical.

/** fulfillment returns 2, rejection returns 0 */
let controller_arrow = {
  val: 1,
  // IMPORTANT! if you use () => here on a 'this' aware function that doesn't need var self = this, you mess things up
  // because 'this' would not point to rollDice. It would lexically inherit this from the surrounding scope (global scope in this case)
  // SIMILAR ISSUE WITH DESCRIBE, CONTEXT, IT BLOCKS!!! They inherit 'this' from the surrounding scope

  // ALSO IMPORTANT: arrow functions don’t have their own arguments array but instead inherit from their parent — as well as lexical super and new.target

  // mind that you can utilize ES6 concise method shorthand above (refer to 4.1):   rollDice() { ... }, but we miss the arrow function comparison
  rollDice: function () { 
    this.val; //?
    return new Promise((resolve, reject) => {
      this.val; //?

      setTimeout(() => {
        this.val++;
        resolve(this.val);
      }, Math.random() * 1000);

      setTimeout(() => {
        this.val--;
        reject(this.val);
      }, Math.random() * 1500); 
    });
  }
};

controller_arrow.rollDice().then(
  function onFulfilled(promisedValue) {
    console.log(promisedValue);
  },
  function onRejected(reason) {
    console.log(reason);
  }
).catch(
  function (err) {
    console.log(err);
  }
)

/*  
safe usages of arrow functions:

* can use for short, single statement inline function expressions
* can use when there is no recursion
* if you have a function expression using var self = this or   {}.bind(this)  (this is the case in the above example)
* if you have an inner function expression relying on var args = Array.prototype.slice.call(arguments) in the enclosing function to make a lexical copy of the arguments
*/