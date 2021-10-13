import { handleProgressTimer } from '../sagas';
import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

describe('sagas', () => {
  it('handleProgressTimer', () => {
    const iterator = handleProgressTimer({
      type: 'TIMER_STARTED',
      payload: { taskId: 12 },
    });

    const expectedAction = {
      type: 'TIMER_INCREMENT',
      payload: { taskId: 12 },
    };

    expect(iterator.next().value).toEqual(call(delay, 1000));
    expect(iterator.next().value).toEqual(put(expectedAction));
    expect(iterator.next().value).toEqual(call(delay, 1000));
    expect(iterator.next().value).toEqual(put(expectedAction));
  });

  it('handles the handleProgressTimer sad path', () => {
    const iterator = handleProgressTimer({
      type: 'TIMER_STOPPED',
    });

    expect(iterator.next().done).toBe(true);
  });
});
