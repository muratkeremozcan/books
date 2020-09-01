// unknown is a bit more restrictive than any, should not use it all the time but is stricter than any

let userInput: unknown;
let userName: string;

userInput = 'Murat';

// unknown first checks the type stored in userInput before it can be assigned to a variable that wants for ex: a string like userName
userName = userInput; 

// we have to do this
if (typeof userInput === 'string') {
  userName = userInput;
}


