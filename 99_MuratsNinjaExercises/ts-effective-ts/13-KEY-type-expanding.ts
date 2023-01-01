// TS infers types by widening them
// Familiarize yourself with the ways you can affect this behavior: const, type annotations, and as const.

{
  interface Vector3 {
    x: number
    y: number
    z: number
  }
  function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
    return vector[axis]
  }
  let x = 'x'
  let vec = {x: 10, y: 20, z: 30}
  getComponent(vec, x)
  // ~ Argument of type 'string' is not assignable to
  //   parameter of type '"x" | "y" | "z"'
}

// use const instead of let
{
  interface Vector3 {
    x: number
    y: number
    z: number
  }
  function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
    return vector[axis]
  }
  const x = 'x' // just use const, why would you use let?
  let vec = {x: 10, y: 20, z: 30}
  getComponent(vec, x)
}

// use a type alias
{
  interface Vector3 {
    x: number
    y: number
    z: number
  }
  function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
    return vector[axis]
  }
  let x: 'x' | 'y' | 'z' = 'x'
  let vec = {x: 10, y: 20, z: 30}
  getComponent(vec, x)
}

// use a const assertion
{
  interface Vector3 {
    x: number
    y: number
    z: number
  }
  function getComponent(vector: Vector3, axis: 'x' | 'y' | 'z') {
    return vector[axis]
  }

  const x = 'x' // automatic const assertion

  const v1 = {
    x: 1,
    y: 2,
    z: 3,
  } // Type is { x: number; y: number; }

  const v2 = {
    x: 1 as const,
    y: 2,
    z: 3,
  } // Type is { x: 1; y: number; z: number; }

  const v3 = {
    x: 1,
    y: 2,
    z: 3,
  } as const // Type is { readonly x: 1; readonly y: 2; readonly z: 3; }

  getComponent(v3, x)
}
