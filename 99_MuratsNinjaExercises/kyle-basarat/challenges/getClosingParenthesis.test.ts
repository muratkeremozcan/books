import { getClosingParenthesis } from "./getClosingParenthesis";

test("getClosingParenthesis", () => {
  expect(() => getClosingParenthesis("hello world", 0)).toThrowError(
    "No parenthesis at opening index"
  );

  expect(() => getClosingParenthesis("hello world", 15)).toThrowError(
    "Out of bounds opening index"
  );

  expect(getClosingParenthesis("(hello world", 0)).toBeNull();
  expect(getClosingParenthesis("hello (world", 6)).toBeNull();
  expect(getClosingParenthesis("hello (world)", 6)).toBe(12);
  expect(getClosingParenthesis("hello (wo)rld)", 6)).toBe(9);
  expect(getClosingParenthesis("hello (wo(r)ld)", 6)).toBe(14);
});
