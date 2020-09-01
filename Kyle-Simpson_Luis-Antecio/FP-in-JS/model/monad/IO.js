/**
 * IO Monad class
 * Author: Luis Atencio
 */
const _ = require('lodash');

exports.IO = class IO {
  /** The IO constructor is initialized with a read/write operation.
   * Also known as the effect function.
   */
  constructor(effect) {
    if (!_.isFunction(effect)) {
      throw 'IO Usage: function required';
    }  
    this.effect = effect;
  }
  /** Unit function to lift values and function into IO monad */
  static of(a) {    
    return new exports.IO( () => a );
  }
  /** Unit function to lift values and function into IO monad */
  static from(fn) {
    return new exports.IO(fn);
  }
  /** Map functor. */
  map(fn) {
    return new IO(() => fn(this.effect()));
  }

   chain(fn) {
    return fn(this.effect());
  }
  /** Kicks off the lazily initialized chain to perform the IO. */
  run() {    
    return this.effect();
  }
};