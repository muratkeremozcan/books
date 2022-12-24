// Every value has a type, but types do not have values.

// Constructs such as type and interface exist only in the type space.

// Some constructs such as class or enum introduce both a type and a value.

{
  interface ICylinder {
    radius: number
    height: number
  }

  // symbols after a type or interface are in type space
  // symbols in a const or let declaration are values

  const VCylinder = (radius: number, height: number) => ({radius, height})

  function calculateVolume(shape: unknown) {
    if (shape instanceof VCylinder) {
      shape.radius
      // ~~~~~~ Property 'radius' does not exist on type '{}'
    }
  }

  // the interface/type
  function calculateVolume2(shape: ICylinder) {
    // the value
    if (shape instanceof VCylinder) {
      shape.radius
    }
  }
}

// type vs value space
{
  interface Person {
    first: string
    last: string
  }
  const p: Person = {first: 'Jane', last: 'Jacobs'}
  //    -           --------------------------------- Values
  //       ------ Type
  function email(p: Person, subject: string, body: string): Response {
    //     ----- -          -------          ----  Values
    //              ------           ------        ------   -------- Types
    return new Response()
  }

  class Cylinder {
    radius = 1
    height = 1
  }

  function calculateVolume(shape: unknown) {
    if (shape instanceof Cylinder) {
      shape // OK, type is Cylinder
      shape.radius // OK, type is number
    }
  }
  const v = typeof Cylinder // Value is "function"
  type T = typeof Cylinder // Type is typeof Cylinder
  type PersonEl = Person['first' | 'last'] // Type is string
  type Tuple = [string, number, Date]
  type TupleEl = Tuple[number] // Type is string | number | Date
}
