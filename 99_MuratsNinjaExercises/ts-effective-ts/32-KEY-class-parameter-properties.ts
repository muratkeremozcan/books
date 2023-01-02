// TS provides a more compact syntax
{
  class Person {
    name: string
    constructor(name: string) {
      this.name = name
    }
  }
}
{
  class Person {
    constructor(public name: string) {}
  }
}

{
  class Person {
    first: string
    last: string
    name: string
    constructor(name: string) {
      this.name = name
      ;[this.first, this.last] = this.name.split(' ')
    }
  }
}

{
  class Person {
    constructor(public name: string, public first: string, public last: string) {
      ;[this.first, this.last] = name.split(' ')
    }
  }
}
