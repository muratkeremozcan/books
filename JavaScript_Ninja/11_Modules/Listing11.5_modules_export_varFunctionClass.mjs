var ninja = "Yoshi"; // top level/ inner module variable
export const message = "Hello"; // exported variable

export function sayHiToNinja() { // exported function
  return message + " " + ninja; // access to inner module variable from the module's API
}