// https://www.youtube.com/watch?v=2O0hwL8fHS4
import { randomInt } from "./random";

/**
 * @param array the array to shuffle
 * @return shuffled version of the input array
 */
export function shuffle<T>(array: T[]): T[] {
  array = [...array];

  for (let i = 0; i < array.length; i++) {
    const randomIndex = randomInt(i, array.length - 1);
    // swap item in the current index with the item in the random index
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

// swap 2 variables in place, without using a temp variable
// https://www.youtube.com/watch?v=QByHja4dm9c

let alpha = "john";
let beta = "jane";
[beta, alpha] = [alpha, beta];

beta; //?
alpha; //?
