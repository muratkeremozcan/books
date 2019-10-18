interface Comparator<T> { // an interface with generic type
    compareTo(value: T): number;
}

class Rectangle implements Comparator<Rectangle> {

    constructor(private width: number, private height: number) { };

    compareTo(value: Rectangle): number { // ensure the argument to be of generic type Rectangle when a rectangle invokes it
        if (this.width * this.height >= value.width * value.height) {
            return 1;
        }
        else {
            return -1;
        }
    }
}

let rect1: Rectangle = new Rectangle(2, 5); // ensures that rect1 and 2 are of generic type Rectangle
let rect2: Rectangle = new Rectangle(2, 3);

rect1.compareTo(rect2) === 1
    ? console.log("rect1 is bigger or equal")
    : console.log("rect1 is smaller");


class Programmer implements Comparator<Programmer> {

    constructor(public name: string, private salary: number) { };

    compareTo(value: Programmer): number { // ensure the argument to be of generic type Programmer, when a Programmer invokes it
        if (this.salary >= value.salary) {
            return 1;
        }
        else {
            return -1;
        }
    }
}

let prog1: Programmer = new Programmer("John", 20000); // ensures that prog1 and prog2 are of generic type Programmer
let prog2: Programmer = new Programmer("Alex", 30000);


prog1.compareTo(prog2) === 1
    ? console.log(`${prog1.name} is richer or equal`)
    : console.log(`${prog1.name} is poorer`);

////////////////
// readonly keyword

// you can modify the property, but not the object
class Persona {

    readonly bestFriend: { name: string } = { name: "Mary" };

    changeFriend() {
        // this.bestFriend = { name: "John" }; // compiler error 
    }

    changeFriendName() {
        this.bestFriend.name = "John"; // no errors
    }

}
// if you want to readonly the entirety of the object's properties you can use Readonly type

type Friendo = Readonly<{ name: string, lastName: string }>;

class Personb {

    bestFriend: Friendo = { name: "Mary", lastName: "Smith" };

    changeFriend() {
        // this.bestFriend = { name: "John" }; // compiler error
    }

    changeFriendName() {
        // this.bestFriend.name = "John"; // compiler error
        // this.bestFriend.lastName = "Lou"; // compiler error
    }

}