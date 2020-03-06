// Static methods aren't called on instances of the class. 
// Instead, they're called on the class itself

class Foo {
  static cool() {
    console.log('cool');
  }
  wow() {
    console.log('wow');
  }
}
// without 'static' you would have to do something like this
// Foo.cool = () => console.log('cool');


class Bar extends Foo {
  static awesome() {
    super.cool();
    console.log('awesome');
  }
  neat() {
    super.wow();
    console.log('neat');
  }
}

// you can access static methods directly in the class
Foo.cool();
Bar.cool(); 
Bar.awesome();
// Bar.neat(); // neat not a function (not static, can't access via class ) 

// without static, you have to instantiate the class
var b = new Bar();
b.neat();
// and the instances cannot access the static methods
// b.cool(); // cool not a function
// b.awesome(); // awesome not a function
