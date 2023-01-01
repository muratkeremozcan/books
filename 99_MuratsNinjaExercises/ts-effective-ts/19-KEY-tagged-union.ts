// Interfaces with multiple properties that are union types are often a mistake
/// because they obscure the relationships between these properties.
// Unions of interfaces are more precise and can be understood by TypeScript.

// Suppose you’re building a vector drawing program and want to define an interface for layers with specific geometry types:
{
  type FillPaint = {}
  type LinePaint = {}
  type PointPaint = {}
  type FillLayout = {}
  type LineLayout = {}
  type PointLayout = {}
  interface FillLayer {
    layout: FillLayout
    paint: FillPaint
  }
  interface LineLayer {
    layout: LineLayout
    paint: LinePaint
  }
  interface PointLayer {
    layout: PointLayout
    paint: PointPaint
  }
  type Layer = FillLayer | LineLayer | PointLayer
}
// would it make sense to have type: 'fill' but then a LineLayout and PointPaint? Certainly not.
// Convert Layer to a union of interfaces to exclude this possibility:

// If you can represent a data type in TypeScript with a tagged union, it’s usually a good idea to do so.
{
  type FillPaint = {}
  type LinePaint = {}
  type PointPaint = {}
  type FillLayout = {}
  type LineLayout = {}
  type PointLayout = {}
  interface FillLayer {
    type: 'fill'
    layout: FillLayout
    paint: FillPaint
  }
  interface LineLayer {
    type: 'line'
    layout: LineLayout
    paint: LinePaint
  }
  interface PointLayer {
    type: 'paint'
    layout: PointLayout
    paint: PointPaint
  }
  type Layer = FillLayer | LineLayer | PointLayer
  // tagged union makes the implementation easy

  function drawLayer(layer: Layer) {
    if (layer.type === 'fill') {
      const {paint} = layer // Type is FillPaint
      const {layout} = layer // Type is FillLayout
    } else if (layer.type === 'line') {
      const {paint} = layer // Type is LinePaint
      const {layout} = layer // Type is LineLayout
    } else {
      const {paint} = layer // Type is PointPaint
      const {layout} = layer // Type is PointLayout
    }
  }
}

// If you think of optional fields as a union of their type and undefined, then they fit this pattern as well.
{
  interface Person {
    name: string

    // These will either both be present or not be present
    // placeOfBirth?: string
    // dateOfBirth?: Date

    // better to move them under a single property then
    birth?: {
      place: string
      date: Date
    }
  }

  // this way TS can find the issue when one value is missing
  const alanT: Person = {
    name: 'Alan Turing',
    birth: {
      // ~~~~ Property 'date' is missing in type
      //      '{ place: string; }' but required in type
      //      '{ place: string; date: Date; }'
      place: 'London',
    },
  }

  // Additionally, a function that takes a Person object only needs to do a single check:
  function eulogize(p: Person) {
    const {birth} = p
    if (birth) {
      console.log(`was born on ${birth.date} in ${birth.place}.`)
    }
  }

  // If the structure of the type is outside your control (e.g., it’s coming from an API),
  // then you can still model the relationship between these fields using a union of interfaces:

  interface Name {
    name: string
  }

  interface PersonWithBirth extends Name {
    placeOfBirth: string
    dateOfBirth: Date
  }

  type Person2 = Name | PersonWithBirth
}
