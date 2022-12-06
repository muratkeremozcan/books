import { _ } from "lodash";

/**
 * Find the min in an array of numbers
 */
export function min(array: number[]): number {
  return _.min(array);
}

export function minNaive(array: number[]): number {
  if (array.length === 0) return undefined;

  let minimum = Infinity;

  for (let item of array) {
    if (item < minimum) {
      minimum = item;
    }
  }
  return minimum;
}

export function minNative(array: number[]): number {
  if (array.length === 0) return undefined;

  return Math.min(...array);
}
