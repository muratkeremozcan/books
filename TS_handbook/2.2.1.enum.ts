// enum type: helps with not having to memorize the appropriate values an argument can have (mapped values)

enum Role { ADMIN, READ_ONLY, AUTHOR }; // uppercase is a convention with enum
// enum Role {ADMIN = 5, READ_ONLY = 'readOnly', AUTHOR = 200}; // can have default values as well

const person = {
  name: 'Max',
  age: 30,
  hobbies: ['Sports', 'Cooking'],
  role: Role.AUTHOR
}

if (person.role === Role.AUTHOR) {
  console.log('user is author');
}

//////////
enum CardSuite {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// Sample usage
var card = CardSuite.Clubs; //?
// Safety
card = "not a member of card suit"; // Error : string is not assignable to type `CardSuite`
//ok like this
var diamondCard = CardSuite.Diamonds; //?
card = diamondCard; //?

//////////
enum Tristate {
  False,
  True,
  Unknown
}
// you can convert a string version of the enum to a number 
// or a number version of the enum to a string
Tristate[0]; //?
Tristate["False"]; //?
Tristate[Tristate.False]; //?

///////
// you can have enums start from any number instead of 0
// initializing with = 1 allows a safe truthy check on an enum value
enum Color {
  DarkRed = 3,  // 3
  DarkGreen,    // 4
  DarkBlue      // 5
}
