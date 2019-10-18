var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var assert = require('assert');

function getJSON(url) {
  return new Promise((resolve, reject) => { // creates an returns a new promise
    const request = new XMLHttpRequest(); // creates an XMLHTTPRequest object
    request.open("GET", url); // initializes the request 
    request.onload = function () { // on load, registers an event handler that will be called if the server has loaded
      try { // ERROR TYPE 2 server responding with unanticipated data ()   (change get passed in url to  '/data/ninjas.json')
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
// the PROMISE.ALL method takes an array of promises, and creates a new promise that succeeds if all promises succeed and fails if any promise fails
Promise.all([
    getJSON('http://localhost:8080/data/ninjas.json'),
    getJSON('http://localhost:8080/data/mapInfo.json'),
    getJSON('http://localhost:8080/data/plan.json')
  ])
  .then(results => { // NEW the result is an array of values, in the order of passed in promises
    const
      ninjas = results[0],
      mapInfo = results[1],
      plan = results[2];
    // const ninjas = results[0];
    // const mapInfo = results[1];
    // const plan = results[2];
    console.log(ninjas);
    console.log(mapInfo);
    console.log(plan);
  }).catch(error => {
    console.log(error);
  });