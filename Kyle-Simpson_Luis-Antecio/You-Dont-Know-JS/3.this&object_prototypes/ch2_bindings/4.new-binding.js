/*
(binding rule 4) new-binding
When a function is invoked with new in front of it, otherwise known as a constructor call, the following things are done automatically: 

* A brand new object is created (aka constructed) out of thin air.  
* The newly constructed object is [[Prototype]]-linked.  
* The newly constructed object is set as the this binding for that function call. 
* Unless the function returns its own alternate object, the new-invoked function call will automatically return the newly constructed object.
*/

function foo(a) {
  this.a = a;
}

var bar = new foo(4);
bar//?
bar.a//?

// By calling foo(..) with new in front of it, we have 
 // 1. constructed a new object 
 // (2. prototype linked the object)
 // 3. set that new object as the this for the call of foo(..)
