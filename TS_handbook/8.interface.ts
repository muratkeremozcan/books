// interfaces are a powerful way of defining contracts within your code
// think of it as a layer over functions, specifying how to use them
// Sometimes called duck typing or structural typing

let myObj = {
  size: 10,
  label: 'Size 10 Object'
}

function printLabel(labelledObj: { label: string }) {
  return labelledObj.label;
}

printLabel(myObj); //?


// you can do the same with an interface
interface LabelledValue {
  label: string;
  color?: string; // can have optional properties, just like optional parameters
  readonly y?: number; // can have readonly properties, which cannot be assigned
}
function printLabel2(labelledObj: LabelledValue) {
  return labelledObj.label;
}

printLabel2(myObj); //?

myObj.y = 5; // TS complaining


// Note: abstract class is very similar to an interface;
// the difference is that it is used for classes and can have access modifiers


// implements keyword with class example

// interface Iterator<T> {
//   next(value?: any): IteratorResult<T>;
//   return?(value?: any): IteratorResult<T>;
//   throw?(e?: any): IteratorResult<T>;
// }
// interface IteratorResult<T> {
//   done: boolean;
//   value: T;
// }

class Component{
  constructor(public name: string) {} // using the shorthand: this.name = name; 
}

// implements keyword is used when a class implements an interface
class Frame implements Iterator<Component> {

  private pointer = 0;

  constructor(public name: string, public components: Component[]) {}

  public next(): IteratorResult<Component> {
    if (this.pointer < this.components.length) {
      return {
        done: false,
        value: this.components[this.pointer++]
      }
    } else {
      return {
        done: true,
        value: null
      }
    }
  }

}

let frame = new Frame("Door", [new Component("top"), new Component("bottom"), new Component("left"), new Component("right")]);
let iteratorResult1 = frame.next(); //{ done: false, value: Component { name: 'top' } }
let iteratorResult2 = frame.next(); //{ done: false, value: Component { name: 'bottom' } }
let iteratorResult3 = frame.next(); //{ done: false, value: Component { name: 'left' } }
let iteratorResult4 = frame.next(); //{ done: false, value: Component { name: 'right' } }
let iteratorResult5 = frame.next(); //{ done: true, value: null }

//It is possible to access the value of iterator result via the value property:
let component = iteratorResult1.value; //Component { name: 'top' }