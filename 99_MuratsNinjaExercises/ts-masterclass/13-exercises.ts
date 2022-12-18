export interface Foo {
  a: {
    b: {
      c: {
        d: number
      }
    }
  }
}

function woooot(foo: Foo) {}

const foo = {
  a: {
    b: {
      c: {
        // d: 'abc', // error if string
        d: 5,
      },
    },
  },
}

woooot(foo)

////////////

interface MyEvent {
  target: {
    id?: string
  }
}

interface Props {
  width: number
  height: number
  callbacks: {
    onSuccess: (event: MyEvent) => void
  }
}

const component: (props: Props) => string = props =>
  `<div width="${props.width}"></div>`

const props = {
  width: 100,
  height: 200,
  callbacks: {
    // onSuccess: (event: {target: {id: string}}) => { // error if id isn't optional
    onSuccess: (event: {target: {id?: string}}) => {
      console.log(event.target.id)
    },
  },
}

component(props)

///////////

interface Person {
  name: string
  employer?: string
}

function getEmployers(persons: Person[]): string[] {
  // possible undefined
  // function getEmployers(persons: Person[]) { // easy fix - infer it!
  return (
    persons
      // .filter((person: Person) => person.employer !== undefined)  // infer it, who cares?
      .filter(
        (person): person is Required<Person> => person.employer !== undefined, // try hard fix. TS should be able to handle this!!
      )
      .map(person => person.employer)
  )
}
