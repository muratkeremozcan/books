// Interface use 1:
    // Declare an interface that defines a custom type containing a number of properties. 
    // Then declare a method that has an argument of such a type.


// Declare an interface that defines a custom type containing a number of properties.
// compare this with getter.ts, there we passed in all the properties to the constructor, here we pass in the arg
interface IPerson { // declare an interface with optional parameter
    firstName: string;
    lastName: string;
    age: number;
    ssn?: string;
}

// Then declare a method that has an argument of such a type. This can be a constructor too
// the main difference of declaring the constructor this way is that all properties have to have the same access modifier
class Customer {
    constructor(protected config: IPerson) { }
}

// create an object literal with properties compatible with IPerson
// The compiler will check that the object includes all the properties declared in the interface.
let aPerson: IPerson = {
    age: 35,
    firstName: "John",
    lastName: "Smith",
    ssn: '2323' // optional
    // , birthPlace: 'chicago' // this would not work because it iss not defined in the interface 
};

aPerson; //?
aPerson.firstName; //?

// instantiate a new object, providing an argument of type IPerson
let cust = new Customer(aPerson);
cust//?
cust.config.lastName//?
// even if you didn’t specify the type of the aPerson variable, it still would be considered compatible
// with IPerson and could be used as a constructor argument while instantiating the cust object
// If you change the name or type of one of the members of IPerson, the TypeScript compiler will report an error.
