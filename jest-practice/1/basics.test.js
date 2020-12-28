const sum = require('./sum');

describe('all', () => {

  test('toBe: uses Object.is to test exact equality', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('toEqual: recursively checks every field of an object or array', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
  });

  test('truthyness', () => {
    expect(null)
      .toBeNull()
      .toBeDefined()
      .not.toBeUndefined()
      .not.toBeTruthy()
      .toBeFalsy();
  });

  test('comparisons', () => {
    const value = 2 + 2;

    expect(value)
      .toBeGreaterThan(3)
      .toBeGreaterThanOrEqual(3.5)
      .toBeLessThan(5)
      .toBeLessThanOrEqual(4.5)

    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
  });

  test('toBeCloseTo: adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    // expect(value).toBe(0.3);  //This won't work because of rounding error
    expect(value).toBeCloseTo(0.3); // This works.
  });

  test('toMatch: string comparisons with regex', () => {

    expect('team').not.toMatch(/I/); // no I in 'team'

    expect('Christoph').toMatch(/stop/);
  });

  test('toContain: used for array or iterable', () => {
    const shoppingList = [
      'diapers',
      'kleenex',
      'trash bags',
      'paper towels',
      'milk',
    ];

    expect(shoppingList).toContain('milk');
    expect(new Set(shoppingList)).toContain('milk');
  });

  test('toThrow: used for testing exceptions', () => {

    function compileAndroidCode() {
      throw new Error('you are using the wrong JDK');
    }

    expect(() => compileAndroidCode()).toThrow();
    expect(() => compileAndroidCode()).toThrow(Error);
    expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
    expect(() => compileAndroidCode()).toThrow(/JDK/);
  });

  describe('testing promises', () => {
    const fetchData = Promise.resolve('peanut butter');
    const rejectData = Promise.reject('err');
    const fetchDataF = () => Promise.resolve('peanut butter');
    const fetchDataE = () => Promise.reject('err');

    test('.resolves.<matcher> and testing promises', () => {
      expect(fetchData).resolves.toBe('peanut butter');
      expect(rejectData).rejects.toBe('err');
      // for callbacks, utilize the (done) pattern https://jestjs.io/docs/en/asynchronous
    });

    test('async await', async () => {
      const data = await fetchDataF();
      expect(data).toBe('peanut butter');

      // or combined
      await expect(fetchDataF()).resolves.toBe('peanut butter');
      await expect(fetchDataE()).rejects.toBe('err')
    });

    test('then ing promises', () => {
      fetchDataF().then(data => {
        expect(data).toBe('peanut butter');
      });
    });
  });
});