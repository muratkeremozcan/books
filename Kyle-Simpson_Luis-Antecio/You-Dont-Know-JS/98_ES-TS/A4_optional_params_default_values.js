// default parameter
function calcTax(income, state = "Florida") { // ES6
  // state = state || "Florida"; // ES5
  state; //?
}
calcTax(50000);

// we can also invoke a default function that returns a value
function calcTaxES6(income, state = getDefaultState()) {
  state; //?
}
function getDefaultState() {
  return 'Florida';
}
calcTaxES6(3000);