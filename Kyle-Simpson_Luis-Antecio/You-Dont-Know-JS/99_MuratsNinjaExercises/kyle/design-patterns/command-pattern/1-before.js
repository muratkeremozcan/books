class Calculator {
  constructor() {
    this.value = 0;
  }

  add(num) {
    this.value += num;
  }

  subtract(num) {
    this.value -= num;
  }

  multiply(num) {
    this.value *= num;
  }

  divide(num) {
    this.value /= num;
  }
}

const calculator = new Calculator();
calculator.add(10);
calculator.value; //?
calculator.divide(2);
calculator.value; //?
