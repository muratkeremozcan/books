// Summary:
// Code generation is independent of the type system.
// This means that TypeScript types cannot affect the runtime behavior or performance of your code.

// It is possible for a program with type errors to produce code (“compile”).

// TypeScript types are not available at runtime. To query a type at runtime, you need some way to reconstruct it.
// Tagged unions and property checking are common ways to do this.
// Some constructs, such as class, introduce both a TypeScript type and a value that is available at runtime.

// Problem: interfaces & types are removed from the code at during compilation
// therefore we need a way to reconstruct the type at runtime
{
  interface Square {
    width: number
  }
  interface Rectangle extends Square {
    height: number
  }
  type Shape = Square | Rectangle

  function calculateArea(shape: Shape) {
    if (shape instanceof Rectangle) {
      // ~~~~~~~~~ 'Rectangle' only refers to a type,
      //           but is being used as a value here
      return shape.width * shape.height
      //         ~~~~~~ Property 'height' does not exist on type 'Shape'
    } else {
      return shape.width * shape.width
    }
  }

  function calculateArea2(shape: Shape) {
    if ('height' in shape) {
      return shape.width * shape.height
    } else {
      return shape.width * shape.width
    }
  }
}

// using classes instead of interfaces would also work
// class vs interface
{
  class Square {
    constructor(public width: number) {}
  }
  class Rectangle extends Square {
    constructor(public width: number, public height: number) {
      super(width)
    }
  }
  type Shape = Square | Rectangle

  function calculateArea(shape: Shape) {
    if (shape instanceof Rectangle) {
      shape // Type is Rectangle
      return shape.width * shape.height
    } else {
      shape // Type is Square
      return shape.width * shape.width // OK
    }
  }
}

// using a tagged union would also work
{
  interface Square {
    kind: 'square'
    width: number
  }
  interface Rectangle {
    kind: 'rectangle'
    height: number
    width: number
  }
  type Shape = Square | Rectangle

  function calculateArea(shape: Shape) {
    if (shape.kind === 'rectangle') {
      shape // Type is Rectangle
      return shape.width * shape.height
    } else {
      shape // Type is Square
      return shape.width * shape.width
    }
  }
}
