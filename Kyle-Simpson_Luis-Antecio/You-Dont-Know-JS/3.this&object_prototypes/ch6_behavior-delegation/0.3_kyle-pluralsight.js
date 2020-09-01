// OLOO pattern : pure objects linked to other objects

// (1) get rid of functions and function prototype. 
// (2) Have an init function
var Foo = {
  init: function (who) {
    this.me = who;
  },
  identify: function () {
    return 'I am ' + this.me;
  }
};


// (3) get rid of 'child' function and child function.prototype
// just utilize Object.create() to create a new object
var Bar = Object.create(Foo);

Bar.speak = function () {
  console.log('Hello ' + this.identify() );
}

// (4) get rid of the new references with Object.create(), utilize init()
var b1 = Object.create(Bar)
b1.init('b1')
b1.speak();

var b2 = Object.create(Bar)
b2.init('b2');
b2.speak();

b1.constructor; //?
b2.constructor; //?
