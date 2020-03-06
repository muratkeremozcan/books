var Foo = {
  init(a, b) {
    this.x = a;
    this.y = b;
  },
  gimmeXY() {
    return this.x * this.y;
  }
}

var Bar = Object.create(Foo);
Bar.setup = function(a, b, c) {
  // delegated call (replaces super)
  this.init(a,b);
  this.z = c;
};
Bar.gimmeXYZ = function() {
  return this.gimmeXY() * this.z;
};

// With class constructors, you are forced (not really, but it is strongly suggested) to do both construction and initialization in the same step.
// OLOO better supports the principle of separation of concerns,
// where creation and initialization are not necessarily conflated into the same operation.

var b = Object.create(Bar);
b.setup(5, 15, 25);

b.x; //?
b.y; //?
b.z; //?
b.gimmeXYZ(); //?
b.gimmeXY(); //?