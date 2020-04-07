// Object Oriented style
// challenge: we want to create a child class Bar (OO style) 
// best way is with Object.create with which an object is created and  prototype-chain-linked: [[Prototype]]

function Foo(who) {
  this.me = who;
}
Foo.prototype.identify = function() {
  return 'I am ' + this.me;
}

function Bar(who) {
  Foo.call(this, who);
}
// Bar.prototype = new Foo(); // has the side effect of calling Foo function and adding .me property
// better to use Object.create: an object is created and  prototype-chain-linked 
Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function() {
  console.log('Hello ' + this.identify());
}


var b1 = new Bar('b1')
b1.speak();

var b2 = new Bar('b2')
b2.speak();

b1.constructor; //?
// constructor here is 'borked': Bar's constructor property got pointed to Foo's when it got prototype-chain-linked to Foo
b2.constructor; //?
// you'd need to use Object.define and do sucky things to 'fix' it. No need to pretend JS is something it is not
