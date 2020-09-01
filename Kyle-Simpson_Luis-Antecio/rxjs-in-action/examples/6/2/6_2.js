// As an example of using(), suppose you want to manage the login session of the user through an observable. 
// When the user logs in, you can create a session token that can be stored in the cookies that keep track of the authenticated user session.
// But when the user logs out or closes the window, the session needs to be deleted. 
// The closing of the browser signals an event that you can listen for, so you can use observables for this.


// the disposible resource / factory function is the session in this case
 class SessionDisposable {
  constructor(sessionToken) {
    this.token = sessionToken;
    this.disposed = false;
    let expiration = moment().add(1, 'days').toDate(); // create a cookie with 1 day expiration
    document.cookie = `session_token=${sessionToken}; expires=${expiration.toUTCString()}`; // add the cookie
    console.log('Session created: ' + this.token);
  }

  getToken() {
    return this.token;
  }

  unsubscribe() { // a disposible resource must implement unsubscribe(), in this case clearing the cookie
    if (!this.disposed) {
      this.disposed = true; // these 2 are the same
      this.token = null;
      document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // in additon to we adjust the cookie
      console.log('Ended session! This object has been disposed.');
    }
  }
}

function generateSessionToken() { // randomize numbers as the token
     return 'xyxyxyxy'.replace(/[xy]/g, c => {
         return Math.floor(Math.random() * 10);
     });
}

const $countDownSession = Rx.Observable.using(
   () => new SessionDisposable(generateSessionToken()), // the disposable(unsubscribeable) resouce / factory function
   () => Rx.Observable.interval(1000) // the observable factory function
     .startWith(10) // injects stream before others are received. (outside of this example this would be the expiration (24 hours))
     .scan(val => val - 1) // scan is like reduce, where the accumulator is output every iteration (counts down from 10)
     .take(10) // will unsubscribe by itself in 10 seconds
);

$countDownSession.subscribe(console.log);
