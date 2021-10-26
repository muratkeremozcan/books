import analytics from '../example_middleware';

jest.mock('../example_service');
import fakeApi from '../example_service';
fakeApi.mockImplementation(
  () => new Promise((resolve, reject) => resolve('Success'))
);

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  const invoke = action => analytics(store)(next)(action);
  return { store, next, invoke };
};

describe('analytics middleware', () => {
  it('should pass on irrelevant keys', () => {
    const { next, invoke } = create();

    const action = { type: 'IRRELEVANT' };

    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(fakeApi).not.toHaveBeenCalled();
  });

  it('should make an analytics API call', () => {
    const { next, invoke } = create();

    const action = {
      type: 'FOO',
      meta: {
        analytics: {
          event: 'foo',
          data: { extra: 'stuff' },
        },
      },
    };

    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(fakeApi).toHaveBeenCalled();
  });
});
