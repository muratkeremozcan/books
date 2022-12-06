// https://www.youtube.com/watch?v=GQzfF5EMD7o&list=WL&index=16

// Command pattern is used to take the different operations you want out of something
// and encapsulate them into individual commands that have a perform and undo method

class Calculator {
  constructor() {
    this.value = 0;
    this.history = [];
  }

  executeCommand(command) {
    this.history.push(command);
    this.value = command.execute(this.value);

    return this.value;
  }

  undoCommand() {
    const command = this.history.pop();
    this.value = command.undo(this.value);

    return this.value;
  }
}

class AddCommand {
  constructor(valueToAdd) {
    this.valueToAdd = valueToAdd;
  }

  execute(currentValue) {
    return currentValue + this.valueToAdd;
  }

  undo(currentValue) {
    return currentValue - this.valueToAdd;
  }
}

class SubtractCommand {
  constructor(valueToSubtract) {
    this.valueToSubtract = valueToSubtract;
  }

  execute(currentValue) {
    return currentValue - this.valueToSubtract;
  }

  undo(currentValue) {
    return currentValue + this.valueToSubtract;
  }
}

class MultiplyCommand {
  constructor(valueToMultiply) {
    this.valueToMultiply = valueToMultiply;
  }

  execute(currentValue) {
    return currentValue * this.valueToMultiply;
  }

  undo(currentValue) {
    return currentValue / this.valueToMultiply;
  }
}

class DivideCommand {
  constructor(valueToDivide) {
    this.valueToDivide = valueToDivide;
  }

  execute(currentValue) {
    return currentValue / this.valueToDivide;
  }

  undo(currentValue) {
    return currentValue * this.valueToDivide;
  }
}

const calculator = new Calculator();

calculator.executeCommand(new AddCommand(10)); //?
calculator.executeCommand(new MultiplyCommand(2)); //?
calculator.undoCommand(); // ?
calculator.undoCommand(); //?

calculator.executeCommand(new SubtractCommand(5)); //?
calculator.executeCommand(new DivideCommand(2)); //?
calculator.undoCommand(); //?
calculator.undoCommand(); //?

class AddThenMultiplyCommand {
  constructor(valueToAdd, valueToMultiply) {
    this.addCommand = new AddCommand(valueToAdd);
    this.multiplyCommand = new MultiplyCommand(valueToMultiply);
  }

  execute(currentValue) {
    const newValue = this.addCommand.execute(currentValue);
    return this.multiplyCommand.execute(newValue);
  }

  undo(currentValue) {
    const newValue = this.multiplyCommand.undo(currentValue);
    return this.addCommand.undo(newValue);
  }
}

calculator.executeCommand(new AddThenMultiplyCommand(10, 2)); //?
calculator.undoCommand(); //?

