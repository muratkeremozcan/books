{
  // solution: refactor the superclass into multiple superclasses
  // which the subclasses can inherit from
  class FlyingBird {
    fly(): any {
      return "I am flying";
    }
  }

  class SwimmingBird {
    swim() {
      return "I am swimming";
    }
  }

  class Duck extends FlyingBird {
    quack() {
      return "Quack";
    }
  }

  class Penguin extends SwimmingBird {}

  function makeBirdFly(bird: FlyingBird) {
    return bird.fly();
  }

  function makeBirdSwim(bird: SwimmingBird) {
    return bird.swim();
  }

  const duck = new Duck();
  // toggle
  // solution: now the subclass can be replaced with the superclass
  // const penguin = new SwimmingBird();
  const penguin = new Penguin();

  makeBirdFly(duck); //?
  makeBirdSwim(penguin); //?
}
