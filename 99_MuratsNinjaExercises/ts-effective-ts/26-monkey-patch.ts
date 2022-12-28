// Prefer structured code to storing data in globals or on the DOM.
// If you must store data on built-in types, use one of the type-safe approaches (augmentation or asserting a custom interface).

// document.monkey = 'Tamarin' // ~~~~~~ Property 'monkey' does not exist on type 'Document'
;(document as any).monkey = 'Tamarin' // OK
;(document as any).monky = 'Tamarin' // Also OK, misspelled
;(document as any).monkey = /Tamarin/ // Also OK, wrong type

// instead we can make use of interface's augmentation ability

interface Document {
  /** Genus or species of monkey patch */
  monkey: string
}

document.monkey = 'Tamarin' // OK

// In a module context (i.e., a TypeScript file that uses import / export), you’ll need to add a declare global to make this work:

export {}
declare global {
  interface Document {
    /** Genus or species of monkey patch */
    monkey: string
  }

  interface MonkeyDocument extends Document {
    /** Genus or species of monkey patch */
    monkey: string
  }
}
document.monkey = 'Tamarin' // OK

// problem: the above  applies globally

// a better approach is to use a more precise type assertion
interface MonkeyDocument extends Document {
  /** Genus or species of monkey patch */
  monkey: string
}

;(document as MonkeyDocument).monkey = 'Macaque'
