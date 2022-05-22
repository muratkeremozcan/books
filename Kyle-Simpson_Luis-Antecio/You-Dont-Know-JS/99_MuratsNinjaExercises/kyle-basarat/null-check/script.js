const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector("#error");
const successMsg = document.querySelector("#success");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Coerce a string to a number (with Number(..) or +) when the only acceptable values are numeric and something like "42px" should be rejected as a number.
  // Parse a string as a number (with parseInt or parseFloat) when you don’t know/care what other non-numeric characters there may be on the right-hand side.
  const numberOfChildren = parseInt(input.value);

  errorMsg.textContent = "";
  successMsg.textContent = "";

  // Problem: enter 0 and it falls to error case, because of implicit type coercion
  // if (!numberOfChildren) {
  //   errorMsg.textContent = "Please enter the number of children";
  // } else {
  //   successMsg.textContent = `You have ${numberOfChildren} children`;
  // }

  // solution 1: can use == null to check if it's equal to null or undefined (since == null is coerced to undefined)
  // we also need to cover the NaN case for a string
  if (numberOfChildren == null || isNaN(numberOfChildren)) {
    errorMsg.textContent = "Please enter the number of children";
  } else {
    successMsg.textContent = `You have ${numberOfChildren} children`;
  }

  // solution 2: flip solution 1
  // you can use null check:  != null, but you have to check the success case first
  // || isNaN would also flip: && !isNaN
  // if (numberOfChildren != null && !isNaN(numberOfChildren)) {
  //   successMsg.textContent = `You have ${numberOfChildren} children`;
  // } else {
  //   errorMsg.textContent = "Please enter the number of children";
  // }
});
