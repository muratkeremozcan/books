// LSP: if you have a class called Animal and its child Dog
// every place you use Animal, you should be able to substitute it with Dog

{
  class Shape {
    constructor(public width: number, public height: number) {}

    area(): number {
      return this.width * this.height;
    }
  }

  class Rectangle extends Shape {
    setWidth(width: number) {
      this.width = width;
    }

    setHeight(height: number) {
      this.height = height;
    }

    increaseRectangleWidth(n = 1) {
      return this.setWidth(this.width + n);
    }
  }

  class Square extends Shape {
    setWidth(width: number) {
      this.width = width;
      this.height = width;
    }

    setHeight(height: number) {
      this.height = height;
      this.width = height;
    }
  }

  const rectangle1 = new Rectangle(10, 2);

  // solution: the subclass is now compatible with the superclass
  // toggle the below, you can't mess it up because TS is enforcing the LSP
  const rectangle2 = new Rectangle(5, 5);
  // const rectangle2 = new Square(5, 5);

  rectangle1.area(); //?
  rectangle2.area(); //?

  rectangle1.increaseRectangleWidth();
  rectangle2.increaseRectangleWidth();

  rectangle1.area(); //?
  rectangle2.area(); //?
}
