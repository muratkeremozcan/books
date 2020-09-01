// Typically, the string literal tag function should compute an appropriate string value and return it, 
// so that you can use the tagged string literal as a value just like untagged string literals

{
  /** function tag just uses reduce(..) to loop over and splice/interleave strings and values together 
   * the same way an untagged string literal would have done. */
  function tag(strings, ...values) {
    // reduce applies the callback function to every element in the array. 
    // Has an accumulator which keeps the returned value after every iteration
    // Has an optional initial value, the value of the accumulator in the first iteration. If not supplied, the first element is used as the initial value
    return strings.reduce(function(s, v, idx) {
      s; //?
      v; //?
      idx; //?
      return s + (idx > 0 ? values[idx - 1] : '') + v;
    }, '');
  }
  let desc = 'great';

  let text = tag`Everything is ${desc}!`; //?
}

// another example
{
  function dollabillsyall(strings, ...values) {
    return strings.reduce(function(s, v, idx) {
      if (idx > 0) {
        // if a number is encountered in the array, we put " $ " in front of it and format it to 2 decimal places
        // otherwise we let that value pass untouched
        if (typeof values[idx - 1] == 'number') {
          // look, also using interpolated string literals
          s += `$${values[idx - 1].toFixed(2)}`;
        } else {
          s += values[idx - 1];
        }
      }
      return s + v;
    }, '');
  }

  var amt1 = 11.989,
      amt2 = amt1 * 1.08,
      name = 'Kyle';

  var text = dollabillsyall
  `Thanks for your purchase, ${name}! Your product cost
  was ${amt1}, which with tax comes out to ${amt2}`;

  text; //?
} 