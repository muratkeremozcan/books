const { always, ifElse } = require("ramda");

// the problem: we have to null check for properties and functions for an entity that may not exist
// null object pattern
// (1) create a class that represents a non-existent entity
// (2) null check for that entity, and return a NullObject if it is so

// @ts-expect-error
class User {
  // use the TS constructor shorthand instead of the lengthy constructor
  // https://dev.to/satansdeer/typescript-constructor-shorthand-3ibd
  constructor(private id: number, private name: string) {}

  // id: number;
  // name: string;
  // constructor(id: number, name: string) {
  //   this.id = id;
  //   this.name = name
  // }

  hasAccess() {
    return true;
  }
}

// (1) create a class that represents a non-existent entity
class NullUser {
  id: number;
  name: string;
  constructor() {
    this.id = -1;
    this.name = "Guest";
  }

  hasAccess() {
    return false;
  }
}

const findUser = (id, users) => users.find((user) => user.id === id);

// (2) null check for that entity, and return a NullObject if it is so
// @ts-expect-error
function getUser(id, users) {
  const user = findUser(id, users);

  return ifElse(
    () => user == null,
    () => new NullUser(),
    () => user
  )();
}

// @ts-expect-error
function greetUser(id, users) {
  const user = getUser(id, users);

  const helloGreeting = `hello ${user.name}`;

  const accessGreeting = ifElse(
    user.hasAccess, // () => user.hasAccess(),
    always("you have access"),
    always("you do not have access")
  )();

  return `${helloGreeting} ${accessGreeting}`;
}

const userList = [new User(1, "Bob"), new User(2, "John")];

greetUser(1, userList); /*?+*/ // expands the expression in the value explorer
greetUser(2, userList); /*?.*/
greetUser(3, userList); //?

// https://quokkajs.com/docs/index.html
