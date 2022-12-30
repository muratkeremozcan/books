// By and large, you can convert TypeScript to JavaScript by removing all the types from your code.
// Enums, parameter properties, triple-slash imports, and decorators are historical exceptions to this rule.
// In order to keep TypeScript’s role in your codebase as clear as possible, I recommend avoiding these features.

{
  class Greeter {
    greeting: string
    constructor(message: string) {
      this.greeting = message
    }
    @logged
    greet() {
      return 'Hello, ' + this.greeting
    }
  }

  function logged(target: any, name: string, descriptor: PropertyDescriptor) {
    const fn = target[name]
    descriptor.value = function () {
      console.log(`Calling ${name}`)
      return fn.apply(this, arguments)
    }
  }

  console.log(new Greeter('Dave').greet())
  // Logs:
  // Calling greet
  // Hello, Dave
}
