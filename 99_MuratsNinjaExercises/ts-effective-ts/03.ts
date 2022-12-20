function asNumber(val: number | string): number {
  // return val as number
  // better way
  return typeof val === 'string' ? Number(val) : val
}

// Code generation is independent of the type system.
// This means that TypeScript types cannot affect the runtime behavior or performance of your code. 

// It is possible for a program with type errors to produce code (“compile”). 

// TypeScript types are not available at runtime. To query a type at runtime, you need some way to reconstruct it.
// Tagged unions and property checking are common ways to do this. 
// Some constructs, such as class, introduce both a TypeScript type and a value that is available at runtime.
