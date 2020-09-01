// method decorator
// Method decoractors allow us override a method, change its control flow, and execute additional code before/after it runs.

// the target — which is either the constructor function of the class for a static member, or the prototype of the class for an instance member 
// the key — the method name
// the descriptor — the property descriptor for the method which has the signature:
/*
{ value: [λ], 
  writable: true, 
  enumerable: true, 
  configurable: true } 
*/


export class IceCreamComponent {

  toppings = [];

  @Confirmable('Are you sure?')
  // @Confirmable('Are you super, super sure? There is no going back!')
  addTopping(topping) {
    this.toppings.push(topping);
  }

// Method Decorator
function Confirmable(message: string) {

  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    target; //?
    key; //?
    descriptor; //?

    descriptor.value = function (...args: any[]) {

      this; //?
      args; //?

      if (message) {
        const result = original.apply(this, args);
        return result;
      } else {
        return null;
      }
    };

    return descriptor;
  };
}


const tops = new IceCreamComponent();

tops.addTopping('choco');

tops; //?