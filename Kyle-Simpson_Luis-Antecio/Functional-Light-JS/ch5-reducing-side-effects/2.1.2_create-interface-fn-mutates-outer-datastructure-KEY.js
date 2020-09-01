// When the nature of the side effect to be dealt with is a mutation of a direct input value (object, array, etc.) via reference, 
// we can again create an interface function to interact with the input value

// both the userList array and the objects in it are mutated
function handleInactiveUsers(userList, dateCutoff) {
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].lastLogin == null) {
      // remove the user from the list
      userList.splice(i, 1);
      i--;
    } else if (userList[i].lastLogin < dateCutoff) {
      userList[i].inactive = true;
    }
  }
}

function safer_handleInactiveUsers(userList, dateCutoff) {
  // make a copy of both the list and its user objects
  let copiedUserList = userList.map(function mapper(user) {
    // copy a 'user' object
    return Object.assign({}, user);
  });

  // call the original function with the copy
  handleInactiveUsers(copiedUserList, dateCutoff);

  // expose the mutated list as a direct output
  return copiedUserList;
}