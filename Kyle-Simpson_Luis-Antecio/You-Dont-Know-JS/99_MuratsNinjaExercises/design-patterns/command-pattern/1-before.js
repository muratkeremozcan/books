// https://www.youtube.com/watch?v=GQzfF5EMD7o&list=WL&index=16

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

/*
// https://www.youtube.com/watch?v=GQzfF5EMD7o&list=WL&index=16

class Calculator {
  constructor() {
    this.value = 0;
  }

  add(num) {
    this.value += num;
    return this;
  }

  subtract(num) {
    this.value -= num;
    return this;
  }

  multiply(num) {
    this.value *= num;
    return this;
  }

  divide(num) {
    this.value /= num;
    return this;
  }

  result() {
    return this.value;
  }
}

const calculator = new Calculator();
calculator.add(10).result(); //?
calculator.divide(2).result(); //?
*/
