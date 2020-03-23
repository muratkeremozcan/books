
// implements keyword with class example
// Note: here are default Iterator and IteratorResult, so we make our own 

interface Iterator_<T> {
  next(value?: any): IteratorResult_<T>;
  return?(value?: any): IteratorResult_<T>;
  throw?(e?: any): IteratorResult_<T>;
}
interface IteratorResult_<T> {
  done: boolean;
  value: T;
}

class Component {
  constructor (public name: string) {}
}

// implements keyword is used when a class implements an interface
class Frame implements Iterator_<Component> {
  constructor(public name: string, public components: Component[]) {}
  private pointer = 0;

  next(): IteratorResult_<Component> {
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

let frame = new Frame
  ("Door", [
    new Component("top"),
    new Component("bottom"),
    new Component("left"),
    new Component("right")
  ]);

let iteratorResult_1 = frame.next(); //?
let iteratorResult_2 = frame.next(); //?
let iteratorResult_3 = frame.next(); //?
let iteratorResult_4 = frame.next(); //?
let iteratorResult_5 = frame.next(); //?

// It is possible to access the value of iterator result via the value property:
let component = iteratorResult_1.value; //?