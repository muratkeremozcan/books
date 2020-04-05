// abstract classes are very similar to an interfaces
// the difference is that it is used for only classes (no functions) and can have access modifiers (public, protected (only children can access), private)
// Having an abstract modifier primarily means that functionality cannot be directly invoked and a child class must provide the functionality

abstract class FooCommand {
  // Note: TS provides a shorthand for class constructors where you can prefix the member with an access modifier 
  // and it is automatically declared on the class and copied from the constructor: no need for this.y = y
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
    return 'bla ' + this.x; // must return the type specified in the abstract class
  }
}

// Cannot create an instance of an abstract class
// const fooCommand: FooCommand = new FooCommand();

// You can create an instance of a class that inherits from an abstract class.
const barCommand = new BarCommand();
barCommand.execute(); //?
barCommand.y; //?



///////////////
// contrast to interface
interface IFooCommand {
  y: number;
  x: number;
  execute(): string;
}

class BarCommand_usingI implements IFooCommand {
  y = 10;
  x = 5;
  execute() {
    return 'bla ' + this.x;
  }
}

const barCommand_usingI = new BarCommand_usingI();

barCommand_usingI.execute(); //?
barCommand_usingI.y; //?
barCommand_usingI.x; //?