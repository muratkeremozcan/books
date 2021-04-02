const sum = require('./util/sum');

describe('matchers', () => {

  describe('equality & comparison', () => {

    test('toBe: uses Object.is to test exact equality', () => {
      expect(sum(1, 2)).toBe(3);
    });

    test('toEqual: recursively checks every field of an object or array', () => {
      const data = { one: 1 };
      data['two'] = 2;

      // the difference in toEqual is the recursive check and value vs reference
      
      expect(data).toEqual({ one: 1, two: 2 });
      expect(data).not.toBe({ one: 1, two: 2 });

      const can1 = {
        flavor: 'grapefruit',
        ounces: 12,
      };
      const can2 = {
        flavor: 'grapefruit',
        ounces: 12,
      };
      
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

  });

  describe('truthyness, falsiness, emptiness', () => {
    test('toBeNull, toBeNil, toBeFalsy, toBeEmpty, toBeNan, toBeTruthy, toBeDefined, expect.anything()', () => {
      expect(null)
        .toBeNull()
        .toBeNil() // null or undefined
        .toBeFalsy() // null, undefined, false, ''
        .not.toBeTruthy()
        .toBeDefined()
        .not.toBeUndefined()
        .not.toBeNaN();

      expect('').toBeEmpty();
      expect([]).toBeEmpty();
      expect({}).toBeEmpty();
      expect('hello').not.toBeEmpty();
    });

    test('expect.anything() : match anything not null or undefined', () => {
      const mock = jest.fn();
      [1].map(x => mock(x));

      expect(mock).toBeCalledWith(expect.anything());
    });
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

    test('toContain(item): set vs 1 item in subset / toBeOneOf(): opposite order', () => {
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

    test('toContainEqual(item) :  set vs 1 item in subset with equality check', () => {
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

      // the difference with toContain is the equality check
      expect(houseForSale).not.toContain(kitchen);
      expect(houseForSale).toContain('bath');

      expect(houseForSale).toIncludeAnyMembers([kitchen]);       
      // the difference with toIncludeAnyMembers() is that it takes only one item
      expect(houseForSale).toIncludeAnyMembers([kitchen], 'tesla charger'); 
    });

    test('toIncludeAnyMembers([members]) : set vs subset (/w equality check) + any invalid extras', () => {
      expect([1, 2, 3]).toIncludeAnyMembers([2, 1, 4]);
      expect([1, 2, 2]).toIncludeAnyMembers([2]);
      expect([1, 2, 2]).not.toIncludeAnyMembers([3]);
    });

    test('toIncludeSameMembers([members]) :  set & subset 1:1, can with different order', () => {
      expect([1, 2, 3]).toIncludeSameMembers([3, 1, 2]);
      expect([{ foo: 'bar' }, { baz: 'qux' }]).toIncludeSameMembers([{ baz: 'qux' }, { foo: 'bar' }]);
    });

    test('toIncludeAllMembers([members]) / expect.arrayContaining(expected) : set vs subset', () => {
      expect([1, 2, 3]).toIncludeAllMembers([2, 1, 3]);
      expect([1, 2, 2]).toIncludeAllMembers([2, 1]);

    
      const expected = ['Alice', 'Bob'];

      expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
      expect(['Alice', 'Bob', 'Eve']).toIncludeAllMembers(expected);
      expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));

      // has to contain all the elements in the expected array (doesn't' include 2 in the 2nd example)
      const expectedDie = [1, 2, 3, 4, 5, 6];
      expect([4, 1, 6, 7, 3, 5, 2, 5, 4, 6]).toEqual(expect.arrayContaining(expectedDie));
      expect([4, 1, 6, 7, 3, 5, 2, 5, 4, 6]).toIncludeAllMembers(expectedDie);
      // expect([4, 1, 6, 7, 3, 5, 7, 5, 4, 6]).not.toEqual(expect.arrayContaining(expectedDie));
      expect([4, 1, 6, 7, 3, 5, 7, 5, 4, 6]).toEqual(expect.not.arrayContaining(expectedDie)); // the not is interchangeable
    });
  });

  describe('Object utilities', () => {

    test('toBeObject', () => {
      expect({}).toBeObject();
      expect({ a: 'hello' }).toBeObject();
      expect(true).not.toBeObject();
    });

    test('expect.objectContaining(object) / toMatchObject() :  main object vs subset object', () => {
      const expected = { foo: 'bar', baz: 'baz' };
      expect({ bar: 'baz', foo: 'bar', baz: 'baz'}).toEqual(expect.objectContaining(expected));
      expect({ bar: 'baz', foo: 'bar', baz: 'baz' }).toMatchObject(expected);


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

    const o = { a: 'foo', b: 'bar', c: 'baz' };

    test('toContainKey(), toContainKeys([keys], toContainAllKeys([keys]), toContainAnyKeys([keys])', () => {
      expect(o).toContainKey('a');
      expect(o).toContainKey('b');
      expect(o).toContainKey('c');

      // object contains one or more keys 
      expect(o).toContainKeys(['a', 'b']);
      expect(o).toContainKeys(['b', 'c'])
      
      // object contains all the keys
      expect(o).toContainAllKeys(['a', 'b', 'c']);
      
      // object contains at least one key
      expect(o).toContainAnyKeys(['b', 'd']);
    });

    test('toContainValue(value), toContainValues([values]), toContainAllValues([values]), toContainAnyValues([values])', () => {
      expect(o).toContainValue('foo');
      expect(o).toContainValue('bar');

      // one or more values
      expect(o).toContainValues(['foo']);
      expect(o).toContainValues(['baz', 'bar']);

      // all values
      expect(o).toContainAllValues(['foo', 'bar', 'baz']);

      // at least one value
      expect(o).toContainAnyValues(['qux', 'foo']);
      expect(o).toContainAnyValues(['qux', 'bar']);
    });

    test('toContainEntry([key, value]), toContainEntries([[key, value]]), toContainAllEntries([[key, value]]), toContainAnyEntries([[key, value]])', () => {
      expect(o).toContainEntry(['a', 'foo']);
      expect(o).toContainEntry(['b', 'bar']);
      expect(o).toContainEntry(['c', 'baz']);

      // one or more 
      expect(o).toContainEntries([['a', 'foo']]);
      expect(o).toContainEntries([['c', 'baz'], ['a', 'foo']]);

      // all
      expect(o).toContainAllEntries([['a', 'foo'], ['b', 'bar'], ['c', 'baz']]);

      // at least one
      expect(o).toContainAnyEntries([['a', 'qux'], ['c', 'baz']]);
    });

    test('toBeFrozen()', () => {
      expect(Object.freeze({})).toBeFrozen();
      expect({}).not.toBeFrozen();
    });

    test('toBeSealed()', () => {
      expect(Object.seal({})).toBeSealed();
      expect({}).not.toBeSealed();
    });

    test('toBeExtensible', () => {
      expect({a: 1}).toBeExtensible();
      expect(1).not.toBeExtensible();
    });

  });

  describe('Boolean utilities', () => {

    test('toBeBoolean', () => {
      expect(false).toBeBoolean();
      expect(true).toBeBoolean();
      expect(1 === 1).toBeBoolean();
      expect(1).not.toBeBoolean();
    });

    test('toBeTrue() & toBeFalse ', () => {
      expect(true).toBeTrue();
      expect(false).not.toBeTrue();
      expect(false).toBeFalse();
    });

  });

  describe('String utilities', () => {

    test('toBeString()', () => {
      expect('').toBeString();
      expect('hello').toBeString();
      expect(new String('hello')).toBeString();
      expect(true).not.toBeString();
    });
    
    test('toBeHexadecimal(string)', () => {
      expect('#abc123').toBeHexadecimal();
      expect('#FFF').toBeHexadecimal();
      expect('#000000').toBeHexadecimal();
      expect('#123ffg').not.toBeHexadecimal();
    });

    test('toEqualCaseInsensitive(string)', () => {
      expect('hello world').toEqualCaseInsensitive('hello world');
      expect('hello WORLD').toEqualCaseInsensitive('HELLO world');
      expect('HELLO WORLD').toEqualCaseInsensitive('hello world');
      expect('hello world').toEqualCaseInsensitive('HELLO WORLD');
      expect('hello world').not.toEqualCaseInsensitive('hello');
    });

    test('toStartWith(prefix),  toEndWith(suffix)', () => {
      expect('hello world').toStartWith('hello');
      expect('hello world').toEndWith('world');
    });

    test('expect.stringContaining(string) / toInclude() : expected string is a subset of the received string', () => {
      const expected = 'Hello world';
      expect('Hello world, how are you?').toEqual(expect.stringContaining(expected));
      expect('Hello world, how are you?').toInclude(expected);
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

    test('toIncludeMultiple([substring]), toIncludeRepeated(substring, times)', () => {
      expect('hello hello world').toIncludeRepeated('hello', 2);
      expect('hello hello world').toIncludeMultiple(['hello']);
    });

  });

  describe('Number utilities', () => {

    test('toBeNumber', () => {
      expect(1).toBeNumber();
      expect(NaN).toBeNumber();
      expect(Infinity).toBeNumber();
      expect(true).not.toBeNumber();
    });

    test('toBeFinite ', () => {
      expect(1).toBeFinite();
      expect(Infinity).not.toBeFinite();
      expect(NaN).not.toBeFinite();
    });

    test('toBePositive() & toBeNegative()', () => {
      expect(1).toBePositive();
      expect(Infinity).not.toBePositive();
      expect(-1).not.toBePositive();
      expect(NaN).not.toBePositive();

      expect(-1).toBeNegative();
      expect(-Infinity).not.toBeNegative();
      expect(1).not.toBeNegative();
      expect(NaN).not.toBeNegative();
    });

    test('toBeEven() & toBeOdd() ', () => {
      expect(2).toBeEven();
      expect(1).toBeOdd();
      expect(NaN).not.toBeEven();
      expect(NaN).not.toBeOdd();
    });

    test('toBeWithin() : start (inclusive) & end (exclusive)', () => {
      expect(1).toBeWithin(1, 3);
      expect(2).toBeWithin(1, 3);
      expect(3).not.toBeWithin(1, 3);
    });
  });

  describe('Class utilities', () => {

    test('toBeInstanceOf(Class', () => {
      class A { }

      expect(new A()).toBeInstanceOf(A);
      expect(() => { }).toBeInstanceOf(Function);
      expect(new A()).not.toBeInstanceOf(Function);
    });

    test('expect.any(<constructor>) : to match anything created with the given constructor', () => {
      function randoCall(fn) {
        return fn(Math.floor(Math.random() * 6 + 1));
      }

      const mock = jest.fn();
      randoCall(mock);

      expect(mock).toBeCalledWith(expect.any(Number));
    });

  });

  describe('Function utilities', () => {

    test('toBeFunction', () => {
      function noop() {};
      expect(noop).toBeFunction();
      expect(() => {}).toBeFunction();
      expect(true).not.toBeFunction();
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

    test('toThrow() / toThrowWithMessage(): used for testing exceptions', () => {

      function compileAndroidCode() {
        throw new Error('you are using the wrong JDK');
      }
  
      expect(() => compileAndroidCode()).toThrow();
      expect(() => compileAndroidCode()).toThrow(Error);
      expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
      expect(() => compileAndroidCode()).toThrow(/JDK/);
      expect(() => {
        throw TypeError("hello world");
      }).toThrowWithMessage(TypeError, "hello world");
  
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
      expect(drinkOctopus).not.toThrowError(new Error('yuck'));
  
      // Test the exact error message
      expect(drinkOctopus).toThrowError(/^yuck, octopus flavor$/);
      expect(drinkOctopus).toThrowError('yuck, octopus flavor');
      expect(drinkOctopus).toThrowError(new Error('yuck, octopus flavor'));
    });

  });

  describe('Date utilities', () => {

    test('toBeDate() / toBeValidDate()', () => {
      expect(new Date()).toBeDate();
      expect('01/01/2018').not.toBeDate();
      expect(new Date('01/01/2018')).toBeDate();  

      expect(new Date()).toBeValidDate();
      expect('01/01/2018').not.toBeValidDate();
      expect(new Date('01/01/2018')).toBeValidDate();
      expect(new Date('01/90/2018')).not.toBeValidDate();
    });

    test('toBeAfter() & toBeBefore()', () => {
      expect(new Date('01/01/2019')).toBeAfter(new Date('01/01/2018'));
      expect(new Date('01/01/2018')).toBeBefore(new Date('01/01/2019'));
    });

  });

  describe('Promises', () => {
    const fetchData = Promise.resolve('peanut butter');
    const rejectData = Promise.reject('err');
    const fetchDataF = () => Promise.resolve('peanut butter');
    const fetchDataE = () => Promise.reject('err');

    test('.resolves.toBe(..)  rejects.toBe(..)  / toResolve()  toReject()', () => {
      expect(fetchData).resolves.toBe('peanut butter');
      expect(fetchData).toResolve('peanut butter');
      expect(fetchData).toResolve();
      expect(rejectData).rejects.toBe('err');
      expect(rejectData).toReject('err');
      expect(rejectData).toReject();

      // for callbacks, utilize the (done) pattern https://jestjs.io/docs/en/asynchronous
    });

    test('resolves & rejects : serve a purpose of unwrapping the promise so any other matcher can be chained', async () => {
      await expect(Promise.resolve('lemon')).resolves.toBe('lemon');
      await expect(Promise.resolve('lemon')).resolves.not.toBe('octopus');

      await expect(Promise.reject(new Error('octopus'))).rejects.toThrow('octopus');
    });

    test('can use async await', async () => {
      const data = await fetchDataF();
      expect(data).toBe('peanut butter');

      // or combined
      await expect(fetchDataF()).resolves.toBe('peanut butter');
      await expect(fetchDataF()).toResolve('peanut butter');
      await expect(fetchDataF()).toResolve();
      await expect(fetchDataE()).rejects.toBe('err')
      await expect(fetchDataE()).toReject('err')
      await expect(fetchDataE()).toReject()
    });

    test('can use then ', () => {
      fetchDataF().then(data => {
        expect(data).toBe('peanut butter');
      });
    });

  });

  describe('other matchers', () => {
    test('toHaveLength(val)', () => {
      expect([1, 2, 3]).toHaveLength(3);
      expect('abc').toHaveLength(3);
      expect('').not.toHaveLength(5);
    });
  
    test('expect.assertions(<number>) : a certain number of assertions are called  /  hasAssertions(): at least one assertion', () => {
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
  
    test('toSatisfy(customMatcher)', () => {
      const greaterThanOneButNotThree = n => n > 1 && n !== 3;
  
      expect(100).toSatisfy(greaterThanOneButNotThree);
      expect(0).not.toSatisfy(greaterThanOneButNotThree);
      expect(3).not.toSatisfy(greaterThanOneButNotThree);
    });

    test('toSatisfyAll() :  when you want to use a custom matcher by supplying a predicate function that returns a Boolean for all values in an array', () => {
      const isOdd = num => num % 2 === 1; 
  
      expect([1,3,5,7]).toSatisfyAll(isOdd);
      expect([1,3,4,5,7]).not.toSatisfyAll(isOdd);
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