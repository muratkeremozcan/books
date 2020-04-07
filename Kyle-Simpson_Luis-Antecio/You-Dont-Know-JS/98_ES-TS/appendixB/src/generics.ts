class Person {
    name: string;
}

class Employeee extends Person {
    department: number;
}

class Animal {
    name: string;
    breed: string;
}

let myWorkers: Array<Person> = []; // only for Person class or its descendants

myWorkers[0] = new Person();
myWorkers[1] = new Employeee();
// myWorkers[2] = new Animal();

let worker: Person = new Animal(); // if you want to declare a person, and animal has Person's properties, it's fine because TS uses structural type system
let worker2: Animal = new Person(); // if you want to declare an Animal, you cannot declare it as a Person person is missing breed property