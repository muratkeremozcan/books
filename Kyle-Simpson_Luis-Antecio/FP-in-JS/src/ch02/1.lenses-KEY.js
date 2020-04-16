// in OOP you're accustomed to calling methods that change stateful objects - not good because state is never guaranteed
// one workaround is to implement copy-on-write methods, where you copy the state of all other properties into a new instance (bad)
/*
  set lastname(lastname) {
    return new Person(this._ssn, this._firstname, lastname);
  }
*/

// You need a solution for mutating stateful objects, in an immutable manner,
// Lenses, also known as functional references, are functional programming’s solution 
// to accessing and immutably manipulating attributes of stateful data types.

const ValueObjects = require('../../model/value_objects.js');
const zipCode = ValueObjects.zipCode;
const coordinate = ValueObjects.coordinate;
const Student = require('../../model/Student.js').Student;
const Person = require('../../model/Person.js').Person;
const Address = require('../../model/Address.js').Address;
let z = zipCode('08544', '1234');
let address = new Address('US', 'NJ', 'Princeton', z, 'Alexander St.');

const R = require('ramda');


// Using R.lensProp, you can create a lens that wraps over property of an object:
let person = new Person('1234', 'Alonzo', 'Church', '444-44-4444'); 
const lastnameLens = R.lensProp('lastname');
// you can set the lensed property with R.set, referencing the object : R.set(<property>, <value>, <sourceObj>)
// R.set creates and returns a brand-new copy of the object containing the new value 
// and preserves the original instance state (copy-on-write semantics for free!):
const newPerson = R.set(lastnameLens, 'Mourning', person);
// you can view the contents of the lensed property, referencing the new object:  R.view(<property>, <newObj>)
R.view(lastnameLens, newPerson); //?
R.equals(R.view(lastnameLens, newPerson), 'Mourning'); //?

// the original stays the same
person.lastname; //?


// lenses support nested properties with lensPath

let student = new Student('444-44-4444', 'Joe', 'Smith', 'Princeton University', 1960, address);
student.address = new Address('US', 'NJ', 'Princeton', zipCode('08544','1234'), 'Alexander St.');
// create a lens for address.zip property, instead of lenProp we use lensPath:  R.lensPath([<property>, <sub.property>, ...])
const zipLens = R.lensPath(['address', 'zip']);
// gets student.address.zip
R.view(zipLens, student); //?
R.equals(R.view(zipLens, student), student.address.zip); //?

// Because lenses implement immutable setters, you can change the nested object and return a new object:
let newStudent = R.set(zipLens, zipCode('90210', '5678'), student);  // R.set(<property>, <value>, <sourceObj>)
const newZip = R.view(zipLens, newStudent); //  R.view(<property>, <newObj>)
const originalZip = R.view(zipLens, student);
newZip != originalZip; //?
!R.equals(newZip, originalZip); //?


// This is great because now you have getter and setter semantics in a functional way.
// In addition to providing a protective immutable wrapper, 
// lenses also fit extremely well with FP’s philosophy of isolating field-access logic away from the object, 
// eliminating the reliance on this, and giving you powerful functions that know how to reach into and manipulate the contents of any object.
