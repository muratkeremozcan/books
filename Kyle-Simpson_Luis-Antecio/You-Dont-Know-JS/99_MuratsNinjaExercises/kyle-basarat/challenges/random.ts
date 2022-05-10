// https://www.youtube.com/watch?v=Ld13qCL_4LY&t=158s

import { _ } from "lodash";
/**
 * @returns a random int between
 * @param min inclusive
 * @param max inclusive
 */
export function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
