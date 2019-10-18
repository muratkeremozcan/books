const ninja = "Yoshi"; // top level/ inner module variable
const message = "Hello"; // exported variable

function  sayHiToNinja() { // exported function
  return message + " " + ninja; // access to inner module variable from the module's API
}
export { message, sayHiToNinja }; // NEW: the public interface to our module
