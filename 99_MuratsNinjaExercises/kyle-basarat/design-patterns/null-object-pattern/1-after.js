// https://www.youtube.com/watch?v=D4Dja5WSZoA&list=FL8lPlH6RrRLc4sYhAE6f3JQ&index=7

// null object pattern
// (1) create a class that represents a non-existent entity
// (2) null check for that entity, and return a NullObject if it is so

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  hasAccess() {
    return true;
  }
}

// (1) create a class that represents a non-existent entity
class NullUser {
  constructor() {
    this.id = -1;
    this.name = "Guest";
  }

  hasAccess() {
    return false;
  }
}

// (2) null check for that entity, and return a NullObject if it is so
function getUser(id) {
  const user = users.find((user) => user.id === id);

  if (user == null) {
    return new NullUser();
  } else {
    return user;
  }
}

function greetUser(id) {
  const user = getUser(id);

  const helloGreeting = `hello ${user.name}`;

  let accessGreeting;
  if (user.hasAccess()) {
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
