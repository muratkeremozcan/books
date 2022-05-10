import { min, minNaive, minNative } from "./min";

test("#min", () => {
  expect(min([2, 3, 4, 5, 1, 7])).toBe(1);
  expect(min([2, 3, 4, 5, 1, 7])).toBe(1);
});

test("#minNaive", () => {
  expect(minNaive([2, 3, 4, 5, 1, 7])).toBe(1);
  expect(minNaive([])).toBe(undefined);
});

test("#minNative", () => {
  expect(minNative([2, 3, 4, 5, 1, 7])).toBe(1);
  expect(minNative([])).toBe(undefined);
});
