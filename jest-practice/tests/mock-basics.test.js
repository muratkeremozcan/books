const Users = require('./util/users');

// pattern for mocking modules
const axios = require('axios');
jest.mock('axios');
// pattern for mocking modules
const foo = require('./util/foo');
jest.mock('./util/foo');

describe('mocking techniques', () => {

  describe('mocking Functions:  mockFn = jest.fn(() => ..) ', () => {

    // suppose there is a sample function and we want to mock the callback
    function forEach(items, callback) {
      for (let index = 0; index < items.length; index++) {
        callback(items[index]);
      }
    }

    // start by creating a mock of the function using jest.fn( function implementation() {..} )
    // jest.fn(function implementation() {..}) is the same as  jest.fn().mockImplementation(function implementation() {..})
    const mockCallback = jest.fn(x => 42 + x);
    forEach([5, 6], mockCallback);

    describe('mockFn.mock : .calls, .results, .instances :   ', () => {

      describe('mockFn.mock.calls :  an array of arguments the function was called with', () => {

        test('mockFn.mock.calls.length : called n times ', () => {
          expect(mockCallback.mock.calls.length).toBe(2);
        });

        test('mockFn.mock.calls[nth call][nth arg] ', () => {
          expect(mockCallback.mock.calls[0][0]).toBe(5);
          expect(mockCallback.mock.calls[1][0]).toBe(6);
        });

        describe('mockFn.mock.calls abstractions', () => {

          test('toHaveBeenCalled(), toHaveBeenCalledWith(arg), toHaveBeenLastCalledWith(lastArg), toHaveBeenCalledTimes(<number>)', () => {
            expect(mockCallback).toHaveBeenCalled(); //      expect(mockFunc.mock.calls.length).toBeGreaterThan(0);
            expect(mockCallback).toHaveBeenCalledWith(5); // expect(mockFunc.mock.calls).toContainEqual([5]);
            expect(mockCallback).toHaveBeenCalledWith(6); // expect(mockFunc.mock.calls).toContainEqual([6]);
            expect(mockCallback).toHaveBeenLastCalledWith(6); // expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([6]);
            expect(mockCallback).toHaveBeenCalledTimes(2);
            expect(mockCallback).toBeCalledTimes(2); // same as toHaveBeenCalledTimes()
            // The first arg of the last call to the mock function was `6` (note that there is no sugar helper for this specific of an assertion)
            expect(mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0]).toBe(6);
          });

          test('toBeCalled() = toHaveBeenCalled(), toHaveBeenNthCalledWith(nthCall, arg) ', () => {
            function drinkAll(callback, flavour) {
              if (flavour !== 'octopus') {
                callback(flavour);
              }
            }

            const drink = jest.fn();

            drinkAll(drink, 'lemon');
            expect(drink).toBeCalled();

            drinkAll(drink, 'apple');
            expect(drink).toHaveBeenNthCalledWith(1, 'lemon');
            expect(drink).toHaveBeenNthCalledWith(2, 'apple');

            const drinkAgain = jest.fn();

            drinkAll(drinkAgain, 'octopus');
            expect(drinkAgain).not.toBeCalled();
          });

          test('toHaveBeenCalledBefore() & toHaveBeenCalledAfter()', () => {
            const mock1 = jest.fn();
            const mock2 = jest.fn();

            mock1();
            mock2();

            expect(mock1).toHaveBeenCalledBefore(mock2);
            expect(mock2).toHaveBeenCalledAfter(mock1);
          });

        });

      });

      describe('mockFn.mock.results : an array of the results of calls to the function ', () => {

        test('mockFn.mock.results[nth call] .value .type  ', () => {
          expect(mockCallback.mock.results[0].value).toBe(47);
          expect(mockCallback.mock.results[1].value).toBe(48);

          // type can be return, throw or incomplete (would be incomplete if the function did not return anything)
          expect(mockCallback.mock.results[0].type).toBe('return');
        });

      })

      describe('mockFn.mock.instances : an array of object instances instantiated from the mockFn', () => {

        test('mock.instances.length  : instantiated n times', () => {
          expect(mockCallback.mock.instances.length).toBe(2);
          // sample use case of mock.instances: 
          // let's say the object returned by the first instantiation of this function had a `name` property whose value was set to 'test'
          // expect(someMockFunction.mock.instances[0].name).toEqual('test');
        });

      });

      // other mock utilities:
      // mockFn.mockClear()  :  clears mockFn.mock.calls & mockFn.mock.instances arrays
      // mockFn.mockReset()  :  mockClear() + remove mock return values
      // mockFn.mockRestore() : mockReset() + restore non-mocked implementation
      // https://jestjs.io/docs/en/mock-function-api#mockfnmockreset
    });

    describe('mockFn: manipulating the function\'s return values', () => {
      const mockFn = jest.fn();
      // console.log(mockFn()); // undefined

      test('mockReturnValue(..) s ', () => {
        mockFn.mockReturnValue(42);
        expect(mockFn()).toBe(42);
      });

      test('mockFn().mockReturnValueOnce(..)  ', () => {
        mockFn.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

        expect(mockFn()).toBe(10);
        expect(mockFn()).toBe('x');
        expect(mockFn()).toBe(true);
      });

    });

  });

  describe('mocking modules / classes:  use jest.mock(), then use mockImplementation() / mockResolvedValue() & their derivatives', () => {
    // Suppose we have a class that fetches users from our API: users.js  
    // The class uses axios to call the API then returns the data attribute which contains all the users
    // in order to test this method without actually hitting the API (and thus creating slow and fragile tests), 
    // we can use the jest.mock() function to automatically mock the axios module.

    // start by using jest.mock

    // const axios = require('axios');
    // jest.mock('axios');
    // const foo = require('./util/foo');
    // jest.mock('./util/foo');

    test('mockFn.mockResolvedValue() ', () => {
      const users = [{ name: 'Bob' }];
      const resp = { data: users };

      axios.get.mockResolvedValue(resp);
      // axios.get.mockImplementation(() => Promise.resolve(resp));  // same thing

      Users.all().then(data => expect(data).toEqual(users));
    });

    test('mockFn.mockImplementation()', () => {
      foo.mockImplementation(() => 42);

      expect(foo()).toBe(42);
    });

    test('mockImplementationOnce() ', () => {
      const myMockFn = jest
        .fn()  // if there is a default function, it will use that instead of undefined   .fn( () => 'default result' ))
        .mockImplementationOnce(() => 'first call')
        .mockImplementationOnce(() => 'second call')
        .mockName('customMockFnName')

      expect(myMockFn()).toBe('first call');
      expect(myMockFn()).toBe('second call');
      expect(myMockFn()).toBeUndefined(); // default when it runs out
      expect(myMockFn.getMockName()).toBe('customMockFnName')
    });

    test('mockFn.mockResolvedValueOnce(), mockFn.mockRejectedValue()', async () => {
      const mockFn = jest
        .fn()
        .mockResolvedValueOnce('first call')
        .mockRejectedValueOnce(new Error('Async error'));

      await expect(mockFn()).toResolve('first call'); // first call
      await expect(mockFn()).toReject('Async error'); // throws "Async error"
    });

    // mockReturnThis()   : check https://jestjs.io/docs/en/mock-functions
  });
  
});