const ninja = {
  name: "Yoshi",
  action: "subterfuge"
};

const concatMessage = "Name: " + ninja.name + " Action: " + ninja.action;
const templateMessage = `Name: ${ninja.name} Action: ${ninja.action}`; // template literal uses backticks ` ` and placeholders ${}
const multiLineString =
`Name: ${ninja.name}
Action: ${ninja.action}`; // template literals can be multi line

console.log(concatMessage);
console.log(templateMessage);
console.log(multiLineString);