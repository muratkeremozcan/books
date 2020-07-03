class Hero {
  public name: string;
  public power: string;

  constructor(name: string, power: string) {
    this.name = name
    this.power = power
  }

  @logMethod
  showPower(additionalPower) {
    return `${this.name} has special power: ${this.power} and ${additionalPower}`
  }
}

function logMethod(target: Function, key: string, descriptor: TypedPropertyDescriptor<any>) {
  const original = descriptor.value;

  target; //?
  key; //?
  descriptor; //?

  // editing the descriptor.value parameter
  descriptor.value = function (...args: any[]) {
    
    const result = original.apply(this, args);

    this; //?
    args; //?

    console.log(`Called function ${key}(${args}), it returned: ${result}`);
    
    return result;
  }

  // return edited descriptor as opposed to overwriting 
  // the descriptor by returning a new descriptor
  return descriptor;
}


const myHero = new Hero('Robin', 'agile');


myHero.showPower('smart-ass'); //?