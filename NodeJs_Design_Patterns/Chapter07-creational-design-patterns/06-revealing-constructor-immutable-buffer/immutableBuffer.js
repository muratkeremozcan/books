const MODIFIER_NAMES = ['swap', 'write', 'fill']

// simple immutable version of the Node.js Buffer component (nodejsdp.link/docs-buffer) using the Revealing Constructor pattern.
// our ImmutableBuffer is acting as a proxy between its consumers and the internal buffer object.
// Some of the methods of the buffer instance are exposed directly through the ImmutableBuffer interface (mainly the read-only methods),
// while others are provided to the executor function (the modifier methods).


export class ImmutableBuffer {
  constructor (size, executor) {
    // First, we allocate a new Node.js Buffer (buffer) of the size specified in the size constructor argument
    const buffer = Buffer.alloc(size)
    // Then, we create an object literal (modifiers) to hold all the methods that can mutate the buffer.
    const modifiers = {}
    // After that, we iterate over all the properties (own and inherited) of our internal buffer, 
    // making sure to skip all those that are not functions.
    for (const prop in buffer) {
      if (typeof buffer[prop] !== 'function') {
        continue
      }

      // Next, we try to identify if the current prop is a method that allows us to modify the buffer. 
      // We do that by trying to match its name with one of the strings in the MODIFIER_NAMES array.
      // If we have such a method, we bind it to the buffer instance, and then we add it to the modifiers object.
      if (MODIFIER_NAMES.some(m => prop.startsWith(m))) {
        modifiers[prop] = buffer[prop].bind(buffer)
      } else {
        // If our method is not a modifier method, then we add it directly to the current instance (this).
        this[prop] = buffer[prop].bind(buffer)
      }
    }

    // Finally, we invoke the executor function received as input in the constructor and pass the modifiers object as an argument, 
    // which will allow executor to mutate our internal buffer.
    executor(modifiers)
  }
}



