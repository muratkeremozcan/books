// __tests__/user-test.js
jest.mock('../request');

import * as user from '../user';

describe('manual mock example', () => {

  // note: the assertion for a promise must be returned.

  it('works with promises', () => {
    expect.assertions(1);
    return user.getUserName(4).then(data => expect(data).toEqual('Mark'));
    // return expect(user.getUserName(5)).resolves.toEqual('Paul'); // less verbose
  });

  it('works with async/await', async () => {
    expect.assertions(1);
    const data = await user.getUserName(4);
    expect(data).toEqual('Mark');
    // await expect(user.getUserName(5)).resolves.toEqual('Paul');
  });

  // Testing for async errors using Promise.catch.
  it('tests error with promises', () => {
    expect.assertions(1);
    return user.getUserName(2).catch(e =>
      expect(e).toEqual({
        error: 'User with 2 not found.',
      }),
    );
  });

  // Or using async/await.
  it('tests error with async/await', async () => {
    expect.assertions(1);
    try {
      await user.getUserName(1);
    } catch (e) {
      expect(e).toEqual({
        error: 'User with 1 not found.',
      });
    }
  });
});