// variations to consider
// Arrow functions are always function expressions; there is no arrow function declaration
//         they are anonymous functions expressions — they have no named reference for the purposes of recursion or event binding/ unbinding


var f1 = () => 12;
f1(); //?

var f2 = x => x * 2;
f2(2); //?

var f3 = (x, y) => {
  var z = x * 2 + y;
  z; //?
  y++;
  y; //?
  x *= 3;
  x; //?
  return (x + y + z) / 2;
}
f3(3, 5); //?


///////
// readability gains from => arrow function conversion are inversely proportional to the length of the function being converted. 
// The longer the function, the less => helps; the shorter the function, the more => can shine.

{ // example 5.3.2 with arrow function
  var dollabillsyall = (strings, ...values) =>  // you can also remove { here and } at the end, which makes it less readable
    strings.reduce(function (s, v, idx) { // when removing { }, mind the removal of return too
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


  var amt1 = 11.989,
    amt2 = amt1 * 1.08,
    name = 'Kyle';

  var text = dollabillsyall
    `Thanks for your purchase, ${name}! Your product cost
  was ${amt1}, which with tax comes out to ${amt2}`;

  text; //?
} 