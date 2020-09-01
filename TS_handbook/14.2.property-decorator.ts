// A property decorator is declared just before a property declaration. 
// they are useful for listening to state changes on a class.

// target — either the constructor function of the class for a static member, or the prototype of the class for an instance member 
// key — the property name


class IceCreamComponent {
  @Emoji() // toggle to see the effect
  flavor = 'vanilla;'
}

// property decorator
function Emoji() {
  return function(target: Object, key: string | symbol) {

    let val = target[key];

    const getter = () =>  {
        return val;
    };
    const setter = (next) => {
        console.log('updating flavor...');
        val = `🍦 ${next} 🍦`;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });

  };
}


const newFlava = new IceCreamComponent();

newFlava.flavor; //?