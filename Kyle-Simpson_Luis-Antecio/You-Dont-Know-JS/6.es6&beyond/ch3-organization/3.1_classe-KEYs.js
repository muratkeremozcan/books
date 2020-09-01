// mind that a class is not hoisted; you must declare it before using it
class Foo { // class Foo implies creating a (special) function of the name Foo, much like you did pre-ES6.
  constructor(a, b) { // constructor(..) identifies the signature of that Foo(..) function, as well as its body contents.
    this.x = a;//?
    this.y = b;//?
  }
  // classes use "concise method" syntax available to object literals. Also getter/setters. But note they are non-enumerable unlike objects
  // Unlike object literals, there are no commas separating members in a class body
  gimmeXY() {
    return this.x * this.y; //?
  }
}

// A Foo(..) call of class Foo must be made with new, as the pre-ES6 option of Foo.call( obj ) will not work.
let k = new Foo(2,3); //?
k.x; //?
k.y; //?
k.gimmeXY(); //?



/////////////
{ // pre es6
  // class Foo in the top global scope creates a lexical Foo identifier in that scope, but unlike function Foob, class Foo does not create a global object property of that name.
  function Foob(a, b) {
    this.x = a;
    this.y = b;
  }
  Foob.prototype.gimmeXY = function() {
    return this.x * this.y;
  }
  
  let l = new Foob(4,5); //?
  l.gimmeXY(4,5);
}