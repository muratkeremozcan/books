
describe('matchers', () => {

  test('expect.anything() : match anything not null or undefined', () => {
    const mock = jest.fn();
    [1].map(x => mock(x));

    expect(mock).toBeCalledWith(expect.anything());
  });

  test('expect.any(<constructor>) : to match anything created with the given constructor', () => {
    function randoCall(fn) {
      return fn (Math.floor(Math.random() * 6 + 1));
    }

    const mock = jest.fn();
    randoCall(mock);
    
    expect(mock).toBeCalledWith(expect.any(Number));
  });

  test('expect.arrayContaining(expected) : expected array is a subset of the received array', () => {
    const expected = ['Alice', 'Bob'];

    expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
    expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));

    // has to contain all the elements in the expected array (doesn't' include 2 in the 2nd example)
    const expectedDie = [1, 2, 3, 4, 5, 6];
    expect([4, 1, 6, 7, 3, 5, 2, 5, 4, 6]).toEqual(expect.arrayContaining(expectedDie));
    // expect([4, 1, 6, 7, 3, 5, 7, 5, 4, 6]).not.toEqual(expect.arrayContaining(expectedDie));
    expect([4, 1, 6, 7, 3, 5, 7, 5, 4, 6]).toEqual(expect.not.arrayContaining(expectedDie)); // the not is interchangeable
  });

  test('expect.objectContaining(object) : expected object is a subset of the received object', () => {
    const expected = {foo: 'bar'};
    expect({bar: 'baz', foo: 'bar'}).toEqual(expect.objectContaining(expected));
  });

  test('expect.stringContaining(string) : expected string is a subset of the received string', () => {
    const expected = 'Hello world';
    expect('Hello world, how are you?').toEqual(expect.stringContaining(expected));
  });

  test('expect.stringMatching(string | regex) : expected string/regex matches the received value', () => {
    const expected = [
      expect.stringMatching(/^Alic/),
      expect.stringMatching(/^[BR]ob/),
    ];
    // chaining example
    expect(['Alicia', 'Roberto', 'Evelina']).toEqual(expect.arrayContaining(expected));
    expect(['Roberto', 'Evelina']).not.toEqual(expect.arrayContaining(expected));
  });

  test('expect.assertions(<number>) : a certain number of assertions are called', () => {
    function callBack1(data) {
      expect(data).toBeTruthy();
    }
    function callBack2(data) {
      expect(data).toBeTruthy();
    }

    function doAsync(cb1, cb2) {
      cb1(true);
      cb2(true);
    }

    doAsync(callBack1, callBack2);

    expect.assertions(2);
    expect.hasAssertions(); // useful when testing asynchronous code, in order to make sure that assertions in a callback actually got called.
  });

  test('resolves : unwrap the value of a fulfilled promise so any other matcher can be chained', async () => {
    await expect(Promise.resolve('lemon')).resolves.toBe('lemon');
    await expect(Promise.resolve('lemon')).resolves.not.toBe('octopus');
  });

  test('rejects : unwrap the rejected promise so any other matcher can be chained', async () => {
    await expect(Promise.reject(new Error('octopus'))).rejects.toThrow('octopus');
  });

  test('toHaveReturned() = toReturn() , toHaveReturnedTimes(<number>) ', () => {
    const drink = jest.fn(() => true);
    drink();

    expect(drink).toHaveReturned();

    drink();
    expect(drink).toHaveReturnedTimes(2);
  });


});