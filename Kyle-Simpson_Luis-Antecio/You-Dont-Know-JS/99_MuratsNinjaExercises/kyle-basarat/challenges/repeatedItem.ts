// https://www.youtube.com/watch?v=o7hFiOReMtA
type RepeatedItemResult<T> = { type: "found"; item: T } | { type: "not-found" };

/**
 * Returns the first repeated item from an array if any
 */
export function repeatedItem<T>(array: T[]): RepeatedItemResult<T> {
  const set = new Set<T>();

  for (let item of array) {
    if (set.has(item)) return { type: "found", item };
    else set.add(item);
  }

  return { type: "not-found" };
}
