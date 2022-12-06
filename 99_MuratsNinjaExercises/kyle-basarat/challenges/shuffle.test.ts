import { shuffle } from "./shuffle";
import { _ } from "lodash";

test("Should change a few indexes", () => {
  const orig = new Array(4).fill("").map((x, i) => i);

  const shuffled = shuffle(orig);
  expect(orig.some((k, i) => k !== shuffled[i])).toBeTruthy();
});

test("lodash shuffle", () => {
  const orig = new Array(10).fill("").map((x, i) => i);

  const shuffled = _.shuffle(orig);
  expect(orig.some((k, i) => k !== shuffled[i])).toBeTruthy();
});
