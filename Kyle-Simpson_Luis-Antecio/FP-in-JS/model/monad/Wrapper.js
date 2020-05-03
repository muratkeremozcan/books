/** used to encapsulate potentially erroneous values*/
exports.Wrapper = class Wrapper {
	/** stores a value in a new wrapped context/container */
	constructor(value) {
		this._value = value;
	}
	/** creates a new wrapper/container/context for the value */
	static of(a) {
		return new Wrapper(a);
	}
	/** takes a wrapped/containerized value, applies a function to it, creates & returns a new wrapped context */
	map(f) {
		return Wrapper.of(f(this._value));
	}
	/** Join function, flattens layers of monadic structures into one. (flattens nested layers). 
 	* Important for composing multiple monad returning functions */
	join() {
		if (!(this._value instanceof Wrapper)) {
			return this;
		}
		return this._value.join();
	}
	/** used to extract the final value out */
	get() {
		return this._value;
	}
	/** Returns a textual representation of this structure*/
	toString() {
		return `Wrapper (${this._value})`;
	}
}