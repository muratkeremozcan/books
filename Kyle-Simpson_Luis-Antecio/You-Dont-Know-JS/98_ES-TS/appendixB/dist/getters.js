// a class can include constructor, fields/properties and methods
// when a function is declared in a class, it's called a method
// fields and methods are called CLASS MEMBERS
// note: class member variables are not supported in JS, must declare class members w/o var, let, const
class Person1 {
    // When you use a constructor with access modifiers, the TypeScript compiler takes it as
    // an instruction to create and retain class properties matching the constructor arguments
    // You don’t need to explicitly declare and initialize them. Both the short and
    // long versions of the Person class generate the same JavaScript
    // SHORT WAY
    constructor(firstName, lastName, age, _ssn) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this._ssn = _ssn;
    }
    // LONG WAY
    // public firstName: string;
    // public lastName: string;
    // public age: number;
    // private _ssn: string;
    // constructor(firstName: string, lastName: string, age: number, ssn: string
    // ) {
    //     this.firstName = firstName;
    //     this.lastName = lastName;
    //     this.age = age;
    //     this._ssn = ssn;
    // }
    // you can only access private variables with getters and setters
    // underscore is convention to indicate private variable _ssn
    // the getter and setter access the private variable as ssn (without _ )
    get ssn() {
        return this._ssn;
    }
    set ssn(value) {
        this._ssn = value;
    }
}
let person = new Person1("John", "Smith", 29);
person.ssn = "456-70-1234";
console.log("Last name: " + person.lastName + " SSN: " + person.ssn);
