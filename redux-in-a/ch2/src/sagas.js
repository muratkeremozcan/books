import { channel, delay } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import * as api from './api';

// [6.2] create the sagas
// you created and applied the sagaMiddleware (6.0)
// you are initiating sagas with sagaMiddleware.run(rootSaga) (6.1)
// sagas have to exist, and rootSaga coordinates all other sagas in the application
// [6.3] use redux-saga/effects to specify how to handle side effects
// [6.4] coordinate the sagas with the actions. Note that not all actions are used in sagas.



// the root saga has to yield each of the application's sagas, in sequence
// if you want to allow rootSaga to move on to the next yield without a resolution, use fork : 
// yield fork(watchFetchTasks)
// yield fork(watchSomethingElse)
export default function* rootSaga() {
  // [6.3] takeLatest command cancels the unfinished old request when a new one comes in (like switchMap from RxJs)
  yield takeLatest('FETCH_TASKS_STARTED', watchFetchTasks);
  // helper function that passes both actions types in an array to the helper function handleProgressTimer
  yield takeLatestById(['TIMER_STARTED', 'TIMER_STOPPED'], handleProgressTimer);
}

/**
 * takeLatestById is a generic helper function that is used to create re-discoverable processes. 
 * The function checks to see if a channel exists for a task, 
 * and if not, creates one and adds it to the mapping. 
 * After adding to the mapping, the new channel is immediately instantiated 
 * and the final line in the listing dispatches the action to the new channel. */
function* takeLatestById(actionType, saga) {
  // stores mapping of created channels
  const channelsMap = {};

  while (true) {
    // [6.3] take command waits for an action type, it is a blocking call
    const action = yield take(actionType);
    const { taskId } = action.payload;

    // if a task doesn't have a channel, create one
    if (!channelsMap[taskId]) {
      // channels are objects used to send and receive messages between processes
      // here it helps us create unique channel for each Parsnip task that starts a timer
      channelsMap[taskId] = channel();
      yield takeLatest(channelsMap[taskId], saga);
    }
    // [6.3] put command is like dispatch, takes the action through the middleware & reducers
    yield put(channelsMap[taskId], action);
  }
}
// type and payload are both destructured arguments
function* handleProgressTimer({ type, payload }) {
  if (type === 'TIMER_STARTED') {
    while (true) {
      // [6.3] delay method is blocking, have to use call(delay, xxx) to produce an effect out of it
      yield call(delay, 1000);
      // [6.3] put command is like dispatch, takes the action through the middleware & reducers
      yield put({
        type: 'TIMER_INCREMENT',
        payload: { taskId: payload.taskId },
      });
    }
  }
}

function* watchFetchTasks() {
  try {
    // [6.3] call command is used to invoke a function, it is a blocking call
    const { data } = yield call(api.fetchTasks);
    // [6.3] put command is like dispatch, takes the action through the middleware & reducers
    yield put({
      type: 'FETCH_TASKS_SUCCEEDED',
      payload: { tasks: data },
    });
  } catch (e) {
    yield put({
      type: 'FETCH_TASKS_FAILED',
      payload: { error: e.message },
    });
  }
}
