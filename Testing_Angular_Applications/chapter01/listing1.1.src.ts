export class Cat {
  private _name: string = ''; // private access modifier

  constructor(name?: string) { // optional parameter
    this._name = name; // if an arg is passed, gets instantiated as the private variable
  }

  get name(): string { // getter. If we are not passing an arg, it is the getter
    return this._name;
  }

  set name(name: string) { // setter. If we are passing an arg, it is the setter
    this._name = name;
  }

  toString(): string {
    return `This cat\'s name is ${this.name}!`; // template literal
  }

}
// const cat = new Cat('Nicky'); // instantiate constant cat