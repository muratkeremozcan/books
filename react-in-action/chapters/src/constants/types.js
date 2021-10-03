// Ch [10.1] action types
// event -> ACTION -(store.dispatch)-(middleware)-> REDUCER -> STORE(state) -> update VIEW
// In Redux, actions are payloads of information that send data from your application to your store.

// Actions in Redux represent work being done (fetching user data, logging the user in, and so on),
// reducers determine how state should change,
// the store holds a centralized copy of state,
// and middleware allows you to inject custom behavior into the process

// Apart from an action, the store doesn’t have any other way to get data.
// Actions are used throughout a Redux application to initiate changes in data,
// although they themselves are not responsible for updating the state (store) of the app.
// Reducers are more involved with that part of the architecture

// An action is created when you want to update state (usually due to an event like a click).
// The action will have a type that a certain reducer will handle.
// The reducer that handles the given action type will make a copy of the current state,
// modify it with data from the action, and then return the new state.
// When the store is updated, view layers (React in our case) can listen to updates and respond accordingly.


export const providers = ['Github'];

// “bundle” similar action types together in objects, but they could just as easily be spread out and exported as individual constants.
//  The advantage to bundling is that you can group them together and use shorter names (GET, CREATE, and so on)
// without having to build those into the variable names themselves (UPDATE_USER_PROFILE, CREATE_NEW_POST, and so on).

// note: the book calls these actions, and everything under actions folder "action creators"
// imo, keep it simple and call them action types and actions, in that order.

export const app = {
    ERROR: 'letters-social/app/error',
    LOADED: 'letters-social/app/loaded',
    LOADING: 'letters-social/app/loading'
};

export const auth = {
    LOGIN_SUCCESS: 'letters-social/auth/login/success',
    LOGOUT_SUCCESS: 'letters-social/auth/logout/success'
};

export const posts = {
    CREATE: 'letters-social/post/create',
    GET: 'letters-social/post/get',
    LIKE: 'letters-social/post/like',
    NEXT: 'letters-social/post/paginate/next',
    UNLIKE: 'letters-social/post/unlike',
    UPDATE_LINKS: 'letters-social/post/paginate/update'
};

export const comments = {
    CREATE: 'letters-social/comments/create',
    GET: 'letters-social/comments/get',
    SHOW: 'letters-social/comments/show',
    TOGGLE: 'letters-social/comments/toggle'
};
