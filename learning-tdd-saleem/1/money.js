const assert = require('assert')

// Red (2) empty class to address the first failure (no class)
class Dollar {
  // Red (4) constructor to address the 4th failure (something should equal 10)
  constructor(amount) {
    this.amount = amount
  }

  // Red (3) method to address the 2nd failure (no method)
  times(multiplier) {
    // Green (5) to address the 5th failure (should be equal to 10)
    // return new Dollar(10);
    // Refactor (6) what can we have in place of the hardcoded value?
    return new Dollar(this.amount * multiplier)
  }
}

// Red (1) write the failing test
let fiver = new Dollar(5)
let tenner = fiver.times(2)
assert.strictEqual(tenner.amount, 10)
