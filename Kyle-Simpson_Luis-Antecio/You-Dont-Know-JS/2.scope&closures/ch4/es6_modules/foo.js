import { hello } from './bar';

var hungry = 'hippo';

// There can only be one default per module definition.
export default function awesome() {
  return hello(hungry).toUpperCase();
}
// you can have other 'export function's here. So long as there is one default, no problem


// you can also do it this way, if you drop 'export default' above
// export default foo
// (1 - if you never plan to update awesome() ) this and the original has a nuance behavior:
// If you later assign foo to a different value inside your module, 
// the module import still reveals the function originally exported, not the new value.



// or this way
// export { awesome as default };
// (2 - if you might update awesome() ) In this version of the module export, the default export binding is actually to the foo identifier rather than its value, 
// so you get the previously described binding behavior (i.e., if you later change foo’s value, the value seen on the import side will also be updated).
