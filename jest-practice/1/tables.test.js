// use an array of arrays
// use formatting
// %p - pretty-format.
// %s- String.
// %d- Number.
// %i - Integer.
// %f - Floating point value.
// %j - JSON.
// %o - Object.
// %# - Index of the test case.
// %% - single percent sign ('%'). This does not consume an argument.

describe('describe table', () => {
  describe.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])('%# .add(%i, %i)', (a, b, expected) => {

    test(`returns ${expected}`, () => {
      expect(a + b).toBe(expected);
    });

    test(`returned value not be greater than ${expected}`, () => {
      expect(a + b).not.toBeGreaterThan(expected);
    });

    test(`returned value not be less than ${expected}`, () => {
      expect(a + b).not.toBeLessThan(expected);
    });
  });
});


describe('test table', () => {
  test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])('.add(%i, %i)', (a, b, expected) => {
    expect(a + b).toBe(expected);
  });
});