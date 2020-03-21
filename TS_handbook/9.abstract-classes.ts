// abstract classes are very similar to an interfaces
// the difference is that it is used for classes and can have access modifiers (public, protected (only children can access), private)
// Having an abstract modifier primarily means that such functionality cannot be directly invoked
// and a child class must provide the functionality

abstract class FooCommand {
  // TypeScript provides a shorthand where you can prefix the member with an access modifier 
  // and it is automatically declared on the class and copied from the constructor
  constructor(public y: number) { /* nothing needed here */ };
  
  // abstract modifier can only be on a class, method or property
  abstract x: number; // prop
  abstract execute(): string; // method
}

// this class has to implement execute; abstract members cannot be accessed directly
class BarCommand extends FooCommand {
  constructor() { 
    super(10);
  }
  x = 5; // must have this property if 'abstract' modifier was used in the abstract class 
  execute() {
    return 'bla ' + 5; // must return the type specified in the abstract class
  }
}

// Cannot create an instance of an abstract class
const fooCommand: FooCommand = new FooCommand();

// You can create an instance of a class that inherits from an abstract class.
const barCommand = new BarCommand();
barCommand.execute(); //?
barCommand.y; //?
