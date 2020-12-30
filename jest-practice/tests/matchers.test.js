const sum = require('./util/sum');

describe('matchers', () => {

  
  describe('Equality & comparison', () => {

    test('toBe: uses Object.is to test exact equality', () => {
      expect(sum(1, 2)).toBe(3);
    });
  
    test('toEqual: recursively checks every field of an object or array', () => {
      const data = { one: 1 };
      data['two'] = 2;
      expect(data).toEqual({ one: 1, two: 2 });
  
      const can1 = {
        flavor: 'grapefruit',
        ounces: 12,
      };
      const can2 = {
        flavor: 'grapefruit',
        ounces: 12,
      };
  
      // the different in toEqual is the recursive check
      expect(can1).toEqual(can2);
      expect(can1).not.toBe(can2);
    });
    test('greater lesser etc. comparisons', () => {
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

    test('toBeCloseTo(): adding floating point numbers', () => {
      const value = 0.1 + 0.2;
      // expect(value).toBe(0.3);  //This won't work because of rounding error
      expect(value).toBeCloseTo(0.3); // This works.
    });

    test('toMatch(): string comparisons with regex', () => {

      expect('team').not.toMatch(/I/); // no I in 'team'

      expect('Christoph').toMatch(/stop/);
    });
  });

  test('truthyness, falsiness, emptiness', () => {
    expect(null)
      .toBeNull()
      .toBeNil() // null or undefined
      .toBeFalsy()
      .not.toBeTruthy()
      .toBeDefined()
      .not.toBeUndefined()
      .not.toBeNaN();

    expect('').toBeEmpty();
    expect([]).toBeEmpty();
    expect({}).toBeEmpty();
    expect('hello').not.toBeEmpty();
  });

  test('toBeInstanceOf(Class', () => {
    class A { }

    expect(new A()).toBeInstanceOf(A);
    expect(() => { }).toBeInstanceOf(Function);
    expect(new A()).not.toBeInstanceOf(Function);
  });

  describe('Array utilities', () => {
    
    test('toBeArray() , toBeArrayOfSize()', () => {
      expect([]).toBeArray();
      expect([1]).toBeArray();
      expect(true).not.toBeArray();

      expect([]).toBeArrayOfSize(0);
      expect([1]).toBeArrayOfSize(1);
      expect(true).not.toBeArrayOfSize(1);
    });
    test('toContain(): used for array or iterable / toBeOneOf(): opposite order of toContain', () => {
      const shoppingList = [
        'diapers',
        'kleenex',
        'trash bags',
        'paper towels',
        'milk',
      ];

      expect(shoppingList).toContain('milk');
      expect(new Set(shoppingList)).toContain('milk');

      expect('milk').toBeOneOf(shoppingList);
    });

    test('toIncludeAnyMembers([members]) : when checking if an Array contains any of the members of a given set', () => {
      expect([1, 2, 3]).toIncludeAnyMembers([2, 1, 3]);
      expect([1, 2, 2]).toIncludeAnyMembers([2]);
      expect([1, 2, 2]).not.toIncludeAnyMembers([3]);
    });

    test('toIncludeAllMembers([members]) : when checking if an Array contains all of the same members of a given set', () => {
      expect([1, 2, 3]).toIncludeAllMembers([2, 1, 3]);
      expect([1, 2, 2]).toIncludeAllMembers([2, 1]);
    });

    test('toIncludeSameMembers([members]) :  when checking if two arrays contain equal values, in any order', () => {
      expect([1, 2, 3]).toIncludeSameMembers([3, 1, 2]);
      expect([{ foo: 'bar' }, { baz: 'qux' }]).toIncludeSameMembers([{ baz: 'qux' }, { foo: 'bar' }]);
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

    test('toContainEqual(item) : for arrays; check that a specific item is contained in an array', () => {
      const houseForSale = [
        'bath',
        'bedrooms',
        {
          amenities: ['oven', 'stove', 'washer'],
          area: 20,
          wallColor: 'white',
          'nice.oven': true,
        },
        'ceiling'
      ];

      const kitchen = {
        amenities: ['oven', 'stove', 'washer'],
        area: 20,
        wallColor: 'white',
        'nice.oven': true,
      };

      expect(houseForSale).toContainEqual(kitchen);
    });
  });

  test('toThrow: used for testing exceptions', () => {

    function compileAndroidCode() {
      throw new Error('you are using the wrong JDK');
    }

    expect(() => compileAndroidCode()).toThrow();
    expect(() => compileAndroidCode()).toThrow(Error);
    expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
    expect(() => compileAndroidCode()).toThrow(/JDK/);


    function drinkFlavor(flavor) {
      if (flavor == 'octopus') {
        throw new Error('yuck, octopus flavor');
      }
      // Do some other stuff
    }
    function drinkOctopus() {
      drinkFlavor('octopus');
    }

    // Test that the error message says "yuck" somewhere: these are equivalent
    expect(drinkOctopus).toThrowError(/yuck/);
    expect(drinkOctopus).toThrowError('yuck');

    // Test the exact error message
    expect(drinkOctopus).toThrowError(/^yuck, octopus flavor$/);
    expect(drinkOctopus).toThrowError(new Error('yuck, octopus flavor'));
  });

  test('expect.anything() : match anything not null or undefined', () => {
    const mock = jest.fn();
    [1].map(x => mock(x));

    expect(mock).toBeCalledWith(expect.anything());
  });

  test('expect.any(<constructor>) : to match anything created with the given constructor', () => {
    function randoCall(fn) {
      return fn(Math.floor(Math.random() * 6 + 1));
    }

    const mock = jest.fn();
    randoCall(mock);

    expect(mock).toBeCalledWith(expect.any(Number));
  });

  test('expect.objectContaining(object) : expected object is a subset of the received object', () => {
    const expected = { foo: 'bar' };
    expect({ bar: 'baz', foo: 'bar' }).toEqual(expect.objectContaining(expected));
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

  test('toHaveReturned() = toReturn() , toHaveReturnedTimes(<number>) ', () => {
    const drink = jest.fn(() => true);
    drink();

    expect(drink).toHaveReturned();

    drink();
    expect(drink).toHaveReturnedTimes(2);
  });

  test('toHaveReturnedWith(val) , toHaveLastReturnedWith(val) , toHaveNthReturnedWith(nthCall, value)', () => {
    const beverage1 = { name: 'La Croix Lemon' };
    const beverage2 = { name: 'La Croix Orange' };

    const drink = jest.fn(beverage => beverage.name);

    drink(beverage1);
    drink(beverage2);

    expect(drink).toHaveReturnedWith('La Croix Lemon');
    expect(drink).toHaveLastReturnedWith('La Croix Orange');
    expect(drink).toHaveNthReturnedWith(1, 'La Croix Lemon');
    expect(drink).toHaveNthReturnedWith(2, 'La Croix Orange');
  });

  test('toHaveLength(val)', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('abc').toHaveLength(3);
    expect('').not.toHaveLength(5);
  });

  test('toHaveProperty(key, value?) ', () => {
    const houseForSale = {
      bath: true,
      bedrooms: 4,
      kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        area: 20,
        wallColor: 'white',
        'nice.oven': true,
      },
      'ceiling.height': 'tall',
    };

    expect(houseForSale).toHaveProperty('bath');
    expect(houseForSale).toHaveProperty('bedrooms', 4);

    expect(houseForSale).not.toHaveProperty('pool');

    expect(houseForSale).toHaveProperty(['kitchen', 'area'], 20);
    expect(houseForSale).toHaveProperty(
      ['kitchen', 'amenities'],
      ['oven', 'stove', 'washer'],
    );
    expect(houseForSale).toHaveProperty(['kitchen', 'amenities', 0], 'oven');
    expect(houseForSale).toHaveProperty(['kitchen', 'nice.oven']);
    expect(houseForSale).not.toHaveProperty(['kitchen', 'open']);

    // Referencing keys with dot in the key itself
    expect(houseForSale).toHaveProperty(['ceiling.height'], 'tall');
  });

  test('toMatchObject(object) : for objects; check that a subset object is contained within a main object', () => {
    const houseForSale = {
      bath: true,
      bedrooms: 4,
      kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        area: 20,
        wallColor: 'white',
      },
    };

    const desiredHouse = {
      bath: true,
      kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        wallColor: expect.stringMatching(/white|yellow/),
      },
    };

    expect(houseForSale).toMatchObject(desiredHouse);

    // can also be applied to arrays
    expect([{ foo: 'bar' }, { baz: 1 }]).toMatchObject([{ foo: 'bar' }, { baz: 1 }]);
    expect([{ foo: 'bar' }, { baz: 1, extra: 'quux' }]).toMatchObject([
      { foo: 'bar' },
      { baz: 1 },
    ]);
  });

  test('toStrictEqual', () => {
    // differences with toEqual() :
    // Keys with undefined properties are checked. e.g. {a: undefined, b: 2} does not match {b: 2} when using .toStrictEqual.
    // Array sparseness is checked. e.g. [, 1] does not match [undefined, 1] when using .toStrictEqual.
    // Object types are checked to be equal. e.g. A class instance with fields a and b will not equal a literal object with fields a and b.

    class LaCroix {
      constructor(flavor) {
        this.flavor = flavor;
      }
    }

    expect(new LaCroix('lemon')).toEqual({ flavor: 'lemon' });
    expect(new LaCroix('lemon')).not.toStrictEqual({ flavor: 'lemon' });

  });

  describe('Promises', () => {
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


    test('resolves : unwrap the value of a fulfilled promise so any other matcher can be chained', async () => {
      await expect(Promise.resolve('lemon')).resolves.toBe('lemon');
      await expect(Promise.resolve('lemon')).resolves.not.toBe('octopus');
    });

    test('rejects : unwrap the rejected promise so any other matcher can be chained', async () => {
      await expect(Promise.reject(new Error('octopus'))).rejects.toThrow('octopus');
    });
  });

  describe('data driven tables', () => {
    describe('describe table', () => {
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
  });

});