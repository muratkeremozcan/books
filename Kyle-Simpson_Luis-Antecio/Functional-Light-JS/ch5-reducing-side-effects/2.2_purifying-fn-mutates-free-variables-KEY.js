// If the nature of the concerned side causes/effects is with lexical free variables, 
// and you do not have the option to modify the surrounding code, you can encapsulate them using scope.

var users = {}; // user object is changed when we fetch user data!

// gets user data, stores it in the object
function fetchUserData(userId) {
  ajax(`http://some.api/user/${userId}`,
    function onUserData(user) {
      users[userId] = user;
    });
}

// create a wrapper around the variable and the impure function. The wrapper has to receive all state it can operate on
function safer_fetchUserData(userId, users) {
  // To make sure we’re not creating a side effect on the outside when users is mutated, we make a local copy of users
  users = Object.assign({}, users);

  fetchUserData(userId);
  
  return users;
}

// The purity of a function is judged from the outside, regardless of what goes on inside.