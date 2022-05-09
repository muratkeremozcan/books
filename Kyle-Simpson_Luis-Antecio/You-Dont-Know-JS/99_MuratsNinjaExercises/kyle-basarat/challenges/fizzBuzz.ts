/**
 * Print the integers from 1 to 100 (inclusive)
 * But:
 *  - for multiples of three, print Fizz (instead of the number)
 *  - for multiples of five, print Buzz (instead of the number)
 *  - for multiples of both three and five, print FizzBuzz (instead of the number)
 */

import { _ } from "lodash";

export default function fizzBuzz() {
  return _.range(1, 101).map((n) =>
    n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : n
  );
}
