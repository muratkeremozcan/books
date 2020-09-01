// @@species symbol controls which constructor is used by built-in methods of a class 
// The most common example is when sub-classing Array and wanting to define which constructor (Array(..) or your subclass) 
// inherited methods like slice(..) should use.

class Cool {
  // defer @@species to derived constructor
  static get [Symbol.species]() { 
    return this; 
  }
  again() {
    // If you need to define methods that generate new instances, 
    // use the meta programming of the new this.constructor[Symbol.species](..) pattern 
    // Derived classes will then be able to customize Symbol.species to control which constructor vends those instances.
    return new this.constructor[Symbol.species]();
  }
}

// @@species will use child constructor
class Fun extends Cool {} 

class Awesome extends Cool {
  // force @@species to be parent constructor
  static get [Symbol.species]() {
    return Cool;
  }
}

var a = new Fun(),
    b = new Awesome(),
    c = a.again(),
    d = b.again();

c instanceof Cool; //?
c instanceof Fun; //? 

d instanceof Cool; //?
d instanceof Awesome; //?

