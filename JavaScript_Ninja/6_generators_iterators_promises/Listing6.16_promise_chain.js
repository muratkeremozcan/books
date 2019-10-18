var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var assert = require('assert');

function getJSON(url) {
  return new Promise((resolve, reject) => { // creates an returns a new promise
    const request = new XMLHttpRequest(); // creates an XMLHTTPRequest object
    request.open("GET", url); // initializes the request 
    request.onload = function () { // on load, registers an event handler that will be called if the server has loaded
      try { // ERROR TYPE 2 server responding with unanticipated data ()   (change get passed in url to  '/data/ninja.json')
        if (this.status === 200) { // server responded, but use the result only if the server responds with status 200 (everything OK)
          console.log('status: ', this.status);
          resolve(JSON.parse(this.responseText)); // ERROR TYPE 3 invalid json. if it succeeds, resolve the promise with the parsed object (mess with json or use only 'this.response')
        } else {
          console.log('status: ', this.status);
          reject.apply(this.status + " " + this.statusText);
        }
      } catch (e) { // if the server responds with a different status code (other than 200 success) or if there's an exception parsing JSON string, reject the promise
        reject(e.message);
      }
    };
    request.onerror = function () { //  ERROR TYPE 1, error establishing the communication between the server and client (server not running)
      reject(this.status + " " + this.statusText);
    };
    request.send(); // send the request
  });
}
// CATCH SYNTAX IS MUCH EASIER AND ENABLES LESS CODE
// specifies multiple sequential steps by chaining in then calls
getJSON('http://localhost:8080/data/ninjas.json')
  .then(ninjas => getJSON(ninjas[1].missionsUrl))
  .then(missions => getJSON(missions[0].detailsUrl))
  .then(plan => console.log(plan.target))
  .catch(error => console.log('should not be here ', error)); // catches promise rejections in any of the steps



// getJSON('http://localhost:8080/data/ninjas.json').then(ninjas => {
//   console.log(ninjas);
//   getJSON(ninjas[0].missionsUrl).then(missions => {
//     console.log(missions);
//     getJSON(missions[0].detailsUrl).then(plan => {
//       console.log(plan);
//       console.log(plan.target)
//     });
//   });
// }, error => {
//   console.log('should not be here ', error);
// });