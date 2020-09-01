// Decorators are a mechanism for  modifying, or replacing classes, methods, or properties


// A class decorator makes it possible to intercept the constructor of class. 
// They are called when the class is declared, not when a new instance is instantiated.


function Frozen(constructor: Function) {
  Object.freeze(constructor);
  Object.freeze(constructor.prototype);
}

@Frozen // toggle to see the value change
class IceCream {}

Object.isFrozen(IceCream); //?


// When a class is decorated you have to be careful with inheritence 
// because its decendents will not inherit the decorators. 
// note: this would be false whether we freeze the parent or not

class Froyo extends IceCream {}; //?
Object.isFrozen(Froyo); //?