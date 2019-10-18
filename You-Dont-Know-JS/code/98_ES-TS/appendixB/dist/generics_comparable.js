class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    ;
    compareTo(value) {
        if (this.width * this.height >= value.width * value.height) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
let rect1 = new Rectangle(2, 5);
let rect2 = new Rectangle(2, 3);
rect1.compareTo(rect2) === 1 ? console.log("rect1 is bigger") :
    console.log("rect1 is smaller");
class Programmer {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
    ;
    compareTo(value) {
        if (this.salary >= value.salary) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
let prog1 = new Programmer("John", 20000);
let prog2 = new Programmer("Alex", 30000);
prog1.compareTo(prog2) === 1 ? console.log(`${prog1.name} is richer`) :
    console.log(`${prog1.name} is poorer`);
