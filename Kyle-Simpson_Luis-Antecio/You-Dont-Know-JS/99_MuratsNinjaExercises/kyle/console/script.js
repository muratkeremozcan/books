// blog.webdevsimplified.com/2022-03/console-methods/

// BASIC LOGGING
console.log("Log");
console.debug("Debug");
console.info("Info");
console.warn("Warn");
console.error("Error");

// LIVE VIEW
{
  // problem: the browser always shows the latest value
  const person = { name: "Kyle" };
  console.log(person);
  person.name = "Sally";
}

{
  // solution: clone the object
  const person = { name: "Kyle" };
  console.log({ ...person }); // shallow cloning
  console.log(JSON.parse(JSON.stringify(person))); // deep cloning
  person.name = "Sally";
}

// ADVANCED STRING LOGGING
// https://developer.mozilla.org/en-US/docs/Web/API/console
console.log(
  "String: %s, Int: %d, OtherInt: %i, Float: %.2f, Object: %o",
  "abc",
  1,
  1,
  1.123, // precision formatting doesn't work in Chrome
  { name: "Kyle", age: 30 }
);
// css
console.log(
  "Normal, %cRed, %cGreen, %cBlue",
  "color: red",
  "background-color: green; color: white",
  "color: blue"
);

// FORMATTING
// log as json vs html with console.log
console.dir(document);
console.log(document);

// table
const people = [
  { name: "Kyle", age: 27, programmer: true },
  { name: "Sally", age: 15, programmer: false },
  { name: "John", age: 34, programmer: false },
  { name: "Beth", age: 72, programmer: true },
];
console.table(people);

// grouping
console.log("Outside");

console.group();
console.log("Inside First Group");
console.log("Still Inside First Group");
console.groupEnd();

console.group("Label");
console.log("Inside Second Group");

console.groupCollapsed();
console.log("Inside Nested Group");
console.groupEnd();

console.log("Still Inside Second Group");
console.groupEnd();

// UTILITY
const n = 2;
console.assert(n === 1, "Not equal to one");
// if (n !== 1) console.error("Not equal to one"); // same thing

// count
console.count();
console.count();
console.countReset();
console.count();
// default: 1
// default: 2
// default: 1

console.count("Label");
console.count("Label");
console.countReset("Label");
console.count("Label");
// Label: 1
// Label: 2
// Label: 1

// trace: prints out the current stack trace
console.trace();
