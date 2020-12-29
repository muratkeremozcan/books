const Users = require('./users');

// pattern for mocking modules
const axios = require('axios');
jest.mock('axios');
// pattern for mocking modules
const foo = require('./foo');
jest.mock('./foo');

describe('mocking techniques', () => {
  describe('Using jest.fn() :   mockFn = jest.fn(() => ..)', () => {
    // suppose there is a sample function and we want to mock the callback
    function forEach(items, callback) {
      for (let index = 0; index < items.length; index++) {
        callback(items[index]);
      }
    }

    const mockCallback = jest.fn(x => 42 + x);
    forEach([5, 6], mockCallback);

    // all mock functions have this special .mock property, 
    // - data about how the function has been called  
    // - what the function returns

    test('mockFn.mock.calls.length : called n times ', () => {
      expect(mockCallback.mock.calls.length).toBe(2);
    });

    test('mockFn.mock.calls[nth call][nth arg] ', () => {
      expect(mockCallback.mock.calls[0][0]).toBe(5);
      expect(mockCallback.mock.calls[1][0]).toBe(6);
    });

    test('mockFn.mock.results[nth call].value. ', () => {
      expect(mockCallback.mock.results[0].value).toBe(47);
      expect(mockCallback.mock.results[1].value).toBe(48);
    });

    test('mock.instances.length  : instantiated n times', () => {
      expect(mockCallback.mock.instances.length).toBe(2);
      // sample use case of mock.instances: 
      // let's say the object returned by the first instantiation of this function had a `name` property whose value was set to 'test'
      // expect(someMockFunction.mock.instances[0].name).toEqual('test');
    });

    test('toHaveBeenCalled(), toHaveBeenCalledWith(arg), toHaveBeenLastCalledWith(lastArg), toHaveBeenCalledTimes(<number>)' , () => {
      expect(mockCallback).toHaveBeenCalled(); //      expect(mockFunc.mock.calls.length).toBeGreaterThan(0);
      expect(mockCallback).toHaveBeenCalledWith(5); // expect(mockFunc.mock.calls).toContainEqual([5]);
      expect(mockCallback).toHaveBeenCalledWith(6); // expect(mockFunc.mock.calls).toContainEqual([6]);
      expect(mockCallback).toHaveBeenLastCalledWith(6); // expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([6]);
      expect(mockCallback).toHaveBeenCalledTimes(2);
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
  });

  describe('mock return values', () => {
    const mockFn = jest.fn();
    // console.log(mockFn()); // undefined

    test('injecting values: mockReturnValue(..) ', () => {
      mockFn.mockReturnValue(42);
      expect(mockFn()).toBe(42);
    });

    test('injecting values with continuation passing style:  mockFn().mockReturnValueOnce(..).mockReturnValueOnce(..) ', () => {
      mockFn.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

      expect(mockFn()).toBe(10);
      expect(mockFn()).toBe('x');
      expect(mockFn()).toBe(true);
    });

  });
  describe('mocking modules with jest.mock()', () => {
    // Suppose we have a class that fetches users from our API: users.js  
    // The class uses axios to call the API then returns the data attribute which contains all the users
    // in order to test this method without actually hitting the API (and thus creating slow and fragile tests), 
    // we can use the jest.mock() function to automatically mock the axios module.

    test('.mockResolvedValue() ', () => {
      const users = [{ name: 'Bob' }];
      const resp = { data: users };

      axios.get.mockResolvedValue(resp);
      // or you could use the following depending on your use case:
      // axios.get.mockImplementation(() => Promise.resolve(resp))

      Users.all().then(data => expect(data).toEqual(users));
    });

    // mockImplementation() is useful when you need to define the default implementation of a mock function that is created from another module:
    test('mockImplementation()', () => {
      foo.mockImplementation(() => 42);

      expect(foo()).toBe(42);
    });

    // When you need to recreate a complex behavior of a mock function such that multiple function calls produce different results, 
    // use the mockImplementationOnce method:
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

    // mockReturnThis()   : check https://jestjs.io/docs/en/mock-functions
  });
});