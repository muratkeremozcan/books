function User() {
  // username, pw and doLogin() are private inner details of the User module
  var username, password;
  function doLogin(user, pw) {
    username = user;
    password = pw;
    console.log(username, password);
  }
  // the publicAPI exposes a login function which calls doLogin
  var publicAPI = {
    login: doLogin
  };
  return publicAPI;
}

// create a `User` module instance
var fred = User(); 
// At this point, the outer User() function has finished executing 
// Normally, you’d think the inner variables like username and password have gone away. But here they have not, because there’s a closure in the login() function keeping them alive.
// login function can still access username and pw
fred.login("fred", "12Battery34!"); 
// fred.doLogin("fred", "12Battery34!"); // would not work

var murat = User(); // new instance 
murat.login('murat', 'Password-1');
// murat.doLogin(); // would not work