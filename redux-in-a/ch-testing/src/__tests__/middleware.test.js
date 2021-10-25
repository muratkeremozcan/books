import analytics from '../example_middleware';
import fakeApi from '../example_service';

// [9.2.0] testing middleware
// the goal of testing the middleware is to ensure that specific actions are being handled correctly

// [9.2.1] mock the dependant service
jest.mock('../example_service');
fakeApi.mockImplementation(
  () => new Promise((resolve, reject) => resolve('Success'))
);

// [9.2.2] use the helper function provided in the official Redux documentation, 
// https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#middleware.
const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  // build the signature of the middleware in this helper function
  const invokeAction = action => analytics(store)(next)(action);
  return { store, next, invokeAction };
};

it('should make an analytics API call', () => {
  // [9.2.3] destructure the helper function into next & action invocation
  const { next, invokeAction } = create();
  // [9.2.4] create a dummy action
  const action = {
    type: 'FOO',
    meta: {
      analytics: {
        event: 'foo',
        data: { extra: 'stuff' },
      },
    },
  };
  // [9.2.5] invoke the action
  invokeAction(action);
  // [9.2.6] assert that the action was passed on to next
  expect(next).toHaveBeenCalledWith(action);
  // [9.2.7] assert whether the dependent service was called or not
  expect(fakeApi).toHaveBeenCalled();
});

describe('analytics middleware', () => {
  it('should pass on irrelevant keys', () => {
    // [9.2.3] destructure the helper function into next & action invocation
    const { next, invokeAction } = create();
    // [9.2.4] create a dummy action
    const action = { type: 'IRRELEVANT' };
    // [9.2.5] invoke the action
    invokeAction(action);
    // [9.2.6] assert that the action was passed on to next
    expect(next).toHaveBeenCalledWith(action);
    // [9.2.7] assert whether the dependent service was called or not
    expect(fakeApi).not.toHaveBeenCalled();
  });
});
