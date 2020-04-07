// you could not extend natives pre-ES6


class MyCoolArray extends Array {
  first() {return this[0];}
  last() {return this[this.length - 1];}
}

var a = new MyCoolArray(1, 2, 3);
a.length; //?
a; //?
a.first(); //?
a.last(); //?
a.push(4); 
// pre-ES6 length property would not be updated
a.length; //?

////////
// pre-es6 this was not capturing the line number and file

class Oops extends Error {
  constructor(reason) {
    super();
    this.oops = reason;
  }
}

var ouch = new Oops("I messed up!");
throw ouch;
