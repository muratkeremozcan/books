// As of ES6, there are now inference rules that can determine a sensible name property value to assign a function 
// even if that function doesn’t have a lexical name to use.

var abc = function() {/* */ };
abc.name; //?

var xyz = function def() {/* */ };
xyz.name; //?

// page 201 has all examples of name intuition; if it can infer a name, it will
// Exceptions: IIFEs don't have a name. window.foo = function() {/* */ }; does not. default function has name "default"

// you can use Object.defineProperty() to change the name if desired