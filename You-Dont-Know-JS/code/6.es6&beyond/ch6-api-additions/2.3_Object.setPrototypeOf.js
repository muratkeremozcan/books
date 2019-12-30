// sets the [[ Prototype]] of an object for the purposes of behavior delegation

var o1 = {
  foo() {
    console.log('foo'); 
  } 
};
var o2 = {
  bar() {
    console.log('bar');
  }
}
// prototype delegation
Object.setPrototypeOf(o2, o1); 
o2.foo();

// alternative
var o3 = Object.setPrototypeOf({
  baz() {
    console.log('baz');
  }
}, o1)
o3.foo(); 

// another alternative
// Object.assign is for copying || mixing one object's properties to another
// Object.create(..) is the ES5 standard utility that creates an empty object that is [[ Prototype]]-linked.
var o4 = Object.assign(
  Object.create(o1),
  {
    barb() {
      console.log('barb');
    }
  }
);
o4.foo();

// Note: setting a [[ Prototype]] right after object creation is reasonable, as shown. 
// But changing it much later is generally not a good idea and will usually lead to more confusion than clarity.
