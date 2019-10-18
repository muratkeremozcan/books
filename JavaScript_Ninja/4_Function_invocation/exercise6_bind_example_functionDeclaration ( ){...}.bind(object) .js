var assert = require('assert');
function Ninja() {
  this.whoAmI = function() {
    return this;
  }.bind(this);  // object.method.bind(object) . This forces it to bind to the instantiated object
} // BIND method (available to all functions, similar to apply and call) creates a new function (same body) but the context is bound to a certain Object

var ninja1 = new Ninja();

assert(ninja1.whoAmI() === ninja1, 'function context is not correct');

var ninja2 = {
  whoAmI: ninja1.whoAmI
};

assert(ninja2.whoAmI() === ninja1); // .bind(this) causes it to set THIS as the first instantiated object. Without bind, THIS would refer to ninja2
