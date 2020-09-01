//////////// INHERITANCE

// prototypal inheritance
function Tax() {
  //
}
// declaring methods
Tax.prototype = {
  calcTax: function() {
    // code to calculate tax
  }
}
// inheriting
function NJTax() {
  //
}

NJTax.prototype = new Tax(); // NJTax inherits from Tax. Prototype inheritance
var njTax = new NJTax();

// ES6 syntax
// Note: class declarations are not hoisted
class Tax_ES6 {
  constructor(income) {
    this.income = income;
  }

  calcTaxFederalTax() {
    console.log(`Calculating federal tax for income ${this.income}`);
  }

  calcMinTax() {
    console.log('In Tax_ES6, calculating min tax');
    return 123;
  }
}

class NJTax_ES6 extends Tax_ES6 {
  // if this class does not have its own constructor, the super class' constructor is automatically invoked
  // if a subclass declares a constructor it must invoke the constructor of the super class using super() : first use of super keyword
  constructor(income, stateTaxPercent) {
    super(income);
    this.stateTaxPercent = stateTaxPercent;
  }

  calculateStateTax() {
    console.log(`Calculating state tax for income ${this.income}`); // income value is the same because of inheritance
  }

  // The super keyword can be used two ways. In the constructor of a derived class, you
  // invoke it as a method. You can also use the super keyword to specifically call a method
  // of the superclass. It’s typically used with method overriding. For example, if both a
  // superclass and its descendant have a doSomething() method, the descendant can reuse
  // the functionality programmed in the superclass and add other functionality as well:
  // doSomething() {
  // super.doSomething();
  // // Add more functionality here
  // }

  calcMinTax() {
    // sometimes you want to specifically call the method of the superclass, that's when you use the super keyword : 2nd use of super keyword
    let minTax = super.calcMinTax();
    console.log(`in NJTax_ES6. Will adjust min tax of ${minTax}`);
  }
}

let njTax_ES6 = new NJTax_ES6(50000);
let myTax = new Tax_ES6(60000);

console.log(njTax_ES6.income);
console.log(myTax.income);

const theTax = new NJTax_ES6(5000, 6);
theTax.calcTaxFederalTax(); // the child calls the parent's method
theTax.calculateStateTax(); // the child calls its own parent

theTax.calcMinTax(); // the child invokes its own version of the method


// STATIC VARIABLES
class A {
  printCounter() {
    console.log('static counter = ' + A.counter)
  };
  // let counters = 26; // this does not work in JS, class member variables are not supported
}
// if we need a class property that is shared by multiple class instances, we need to create it outside of the class declaration
A.counter = 25;

let a1 = new A();
let a2 = new A();
// the static variable counter is visible from both instances of the object A by invoking the printCounter method
a1.printCounter();
a2.printCounter();
// but if we access the variable on the instance level, it will be undefined
console.log('In the a1 instance counter = ' + a1.counter);
console.log('In the a2 instance counter = ' + a2.counter);



////// getters setters and method definitions

// getters and setters bind functions to object properties
const Tax_getSet = {
  taxableIncome: 100,
  get income() {
    return this.taxableIncome;
  },
  set income(value) {
    this.taxableIncome = value;
  },
  // in ES6 we can skip the function keyword
  calculateTax() {
    return this.taxableIncome*0.13;
  }
}
// you assign and retrieve the value of income using dot notation, as if it were a declared property of the Tax object
console.log('Income : ' + Tax_getSet.income)
Tax_getSet.calculateTax(); //?

Tax_getSet.income = 50000;
console.log('Income : ' + Tax_getSet.income)
Tax_getSet.calculateTax(); //?