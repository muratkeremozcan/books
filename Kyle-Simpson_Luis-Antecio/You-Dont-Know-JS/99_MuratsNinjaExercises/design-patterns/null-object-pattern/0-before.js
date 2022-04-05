// https://www.youtube.com/watch?v=D4Dja5WSZoA&list=FL8lPlH6RrRLc4sYhAE6f3JQ&index=7

// the problem: we have to null check for properties and functions for an entity that may not exist

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  hasAccess() {
    return true;
  }
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function greetUser(id) {
  const user = getUser(id);

  let name = "Guest";
  // problem: we have to null check the property for a user that may not exist
  if (user?.name) {
    name = user.name;
  }

  const helloGreeting = `hello ${name}`;

  // problem: we have to null check the function for a user that may not exist
  let accessGreeting;
  if (user?.hasAccess()) {
    accessGreeting = "you have access";
  } else {
    accessGreeting = "you do not have access";
  }

  return `${helloGreeting} ${accessGreeting}`;
}

const users = [new User(1, "Bob"), new User(2, "John")];

greetUser(1); //?
greetUser(2); //?
greetUser(3); //?
