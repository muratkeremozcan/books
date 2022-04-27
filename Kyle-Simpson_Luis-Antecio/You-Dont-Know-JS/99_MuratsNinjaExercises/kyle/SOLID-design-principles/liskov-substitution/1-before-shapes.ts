// LSP: if you have a class called Animal and its child Dog
// every place you use Animal, you should be able to substitute it with Dog

{
  class Rectangle {
    constructor(public width: number, public height: number) {}

    setWidth(width: number) {
      this.width = width;
    }

    setHeight(height: number) {
      this.height = height;
    }

    area(): number {
      return this.width * this.height;
    }

    increaseRectangleWidth(n = 1) {
      return this.setWidth(this.width + n);
    }
  }

  class Square extends Rectangle {
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

  // problem: the subclass is not compatible with the superclass
  // toggle the below; when replacing Rectangle with Square, you get different results for the area

  // const rectangle2 = new Rectangle(5, 5);
  const rectangle2 = new Square(5, 5);

  rectangle1.area(); //?
  rectangle2.area(); //?

  rectangle1.increaseRectangleWidth();
  rectangle2.increaseRectangleWidth();

  rectangle1.area(); //?
  rectangle2.area(); //?
}
