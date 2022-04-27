// LSP: if you have a class called Animal and its child Dog
// every place you use Animal, you should be able to substitute it with Dog

{
  class Bird {
    fly(): any {
      return "I am flying";
    }
  }

  class Duck extends Bird {
    quack() {
      return "Quack";
    }
  }

  class Penguin extends Bird {
    fly() {
      throw new Error("Cannot fly");
    }

    swim() {
      return "I am swimming";
    }
  }

  const makeBirdFly = (bird: Bird) => bird.fly();

  const duck = new Duck();
  // toggle
  // problem: the subclass is not compatible/replaceable with the superclass
  // const penguin = new Bird();
  const penguin = new Penguin();

  makeBirdFly(duck); //?
  makeBirdFly(penguin); //?
}
