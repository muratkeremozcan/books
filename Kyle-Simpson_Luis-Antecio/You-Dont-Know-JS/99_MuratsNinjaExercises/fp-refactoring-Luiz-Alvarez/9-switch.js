// switch statement refactor

const hi = (name) => `Hi ${name}`;
const bye = (name) => `Bye ${name}`;
const morning = (name) => `Good morning ${name}`;
const afternoon = (name) => `Good afternoon ${name}`;
const evening = (name) => `Good evening ${name}`;
const anything = (name) => `Anything ${name}`;

{
  function greet(action, name) {
    switch (action) {
      case "sayHi":
        return hi(name);
      case "sayBye":
        return bye(name);
      case "sayMorning":
        return morning(name);
      case "sayAfternoon":
        return afternoon(name);
      case "sayEvening":
        return evening(name);
      default:
        return anything(name);
    }
  }

  greet("sayHi", "Luis"); //?
}

// convert switch statement cases to an object
{
  const greetings = {
    sayHi: hi,
    sayBye: bye,
    sayMorning: morning,
    sayAfternoon: afternoon,
    sayEvening: evening,
  };

  function greet(action, name) {
    return greetings[action] ? greetings[action](name) : anything(name);
  }

  greet("sayHi", "Luis"); //?
}
