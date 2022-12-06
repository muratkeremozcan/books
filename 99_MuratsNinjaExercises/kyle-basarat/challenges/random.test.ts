import { randomInt } from "./random";

test("Should include all numbers", () => {
  const random = [];
  for (let i = 0; i < 100; i++) {
    random.push(randomInt(1, 5));
  }

  random;
  expect(random.includes(1)).toBeTruthy();
  expect(random.includes(2)).toBeTruthy();
  expect(random.includes(3)).toBeTruthy();
  expect(random.includes(4)).toBeTruthy();
  expect(random.includes(5)).toBeTruthy();
  expect(random.includes(0)).toBeFalsy();
  expect(random.includes(6)).toBeFalsy();
});

test("lodash random", () => {
  const random = [];
  for (let i = 0; i < 100; i++) {
    random.push(_.random(1, 5));
  }

  random;
  expect(random.includes(1)).toBeTruthy();
  expect(random.includes(2)).toBeTruthy();
  expect(random.includes(3)).toBeTruthy();
  expect(random.includes(4)).toBeTruthy();
  expect(random.includes(5)).toBeTruthy();
  expect(random.includes(0)).toBeFalsy();
  expect(random.includes(6)).toBeFalsy();
});
