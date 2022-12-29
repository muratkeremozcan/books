// Use JSDoc-/TSDoc-formatted comments to document exported functions, classes, and types.
/// This helps editors surface information for your users when it’s most relevant.
// Use @param, @returns, and Markdown for formatting.
// Avoid including type information in documentation

/**
 * Generate a greeting.
 * @param name  Name of the person to greet
 * @param title The person's title
 * @returns A greeting formatted for human consumption.
 */
function greetFullTSDoc(name: string, title: string) {
  return `Hello ${title} ${name}`
}

// jsdoc can be use by types or interfaces
type Vector3D = {}
/** A measurement performed at a time and place. */
type Measurement = {
  /** Where was the measurement made? */
  position: Vector3D
  /** When was the measurement made? In seconds since epoch. */
  time: number
  /** Observed momentum */
  momentum: Vector3D
}
// hovering over the props, nice documentation appears
const m: Measurement = {
  position: {x: 1, y: 2, z: 3},
  time: 0,
  momentum: {x: 0, y: 0, z: 0},
}

// markdown is supported
/**
 * This _interface_ has **three** properties:
 * 1. x
 * 2. y
 * 3. z
 */
interface Vector3D2 {
  x: number
  y: number
  z: number
}
