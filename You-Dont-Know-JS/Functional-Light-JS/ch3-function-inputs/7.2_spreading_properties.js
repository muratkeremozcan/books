import { curryProps, partialProps } from './7.1_order_matters';
// we can only take advantage of currying with named arguments if we have control over the signature of foo(..) 
// and define it to destructure its first parameter.
// What if we wanted to use this technique with a function that had its parameters individually listed (no parameter destructuring!), 
// and we couldn’t change that function signature?


function spreadArgProps(
  fn,
  propOrder =
    fn.toString()
      .replace(/^(?:(?:function.*\(([^]*?)\))|(?:([^\(\)]+?)\s*=>)|(?:\(([^]*?)\)\s*=>))[^]+$/, "$1$2$3")
      .split(/\s*,\s*/)
      .map(v => v.replace(/[=\s].*$/, ""))
) {
  return function spreadFn(argsObj) {
    return fn(...propOrder.map(k => argsObj[k]));
  };
}

// usage

function bar(x, y, z) {
  console.log(` x: ${x} y: ${y} z: ${z} `);
}

var f3 = curryProps(spreadArgProps(bar), 3);
var f4 = partialProps(spreadArgProps(bar), { y: 2 });

f3({ y: 2 })({ x: 1 })({ z: 3 });
f4({ z: 3, x: 1 });