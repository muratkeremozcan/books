import { createError } from "../actions/error";

// middleware of composed actions for Redux
export default store => next => action => {
  try {
    if (action.error) {
      console.error(action.error);
      console.error(action.info);
    }
    return next(action);
  } catch (err) {
    const { user } = store.getState();
    console.error(err);
    window.Raven.setUserContext(user);
    window.Raven.captureException(err);

    // dispatch error to store
    return store.dispatch(createError(err));
  }
};
