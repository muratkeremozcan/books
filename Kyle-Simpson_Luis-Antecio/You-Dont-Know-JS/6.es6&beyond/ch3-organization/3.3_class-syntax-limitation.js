// super seems to work intuitively if you have a static class hierarchy with no cross-pollination.
// the choice is between static hierarchies — class, extends, and super — 
// or dropping all attempts to “fake” classes and instead embrace dynamic and flexible, classless objects and [[ Prototype]] delegation (book 3 chapter 6)

// if you’re in the habit of taking a method from one “class” and “borrowing” it for another class by overriding its this,
// say with call(..) or apply(..), that may very well create surprises if the method you’re borrowing has a super in i

{
  class ParentA {
    constructor() {
      this.id = 'a';
    }
    foo() {
      console.log('ParentA:', this.id);
    }
  }

  class ParentB {
    constructor() {
      this.id = 'b';
    }
    foo() {
      console.log('ParentB:', this.id);
    }
  }

  class ChildA extends ParentA {
    foo() {
      super.foo();
      console.log('ChildA:', this.id);
    }
  }

  class ChildB extends ParentB {
    foo() {
      super.foo();
      console.log('ChildB:', this.id);
    }
  }

  let a = new ChildA();
  a.foo();

  let b = new ChildB();
  b.foo();

  // all good until here

  // borrow b.foo() to use in 'a' context
  // a is bound but the super.foo() is dynamically rebound: so we still get ParentB and ChildB
  b.foo.call(a); // ParentB: a , ChildB: a
}