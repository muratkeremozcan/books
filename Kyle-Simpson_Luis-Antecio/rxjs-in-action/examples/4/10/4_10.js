/**
 *  RxJS in Action
 *  Listing 4.10 + 4.11
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
let testData = [
	  'github.com/Reactive-Extensions/RxJS',
	  'github.com/ReactiveX/RxJS',
	  'xgrommx.github.io/rx-book',
   'reactivex.io',
	  'egghead.io/technologies/rx',
	  'rxmarbles.com',
	  'https://www.manning.com/books/rxjs-in-action'
	];

const searchBox = document.querySelector('#search'); //-> <input>
const results = document.querySelector('#results');  //-> <ul>

const copyToArray = arrayLike => Array.prototype.slice.call(arrayLike);

function debounce(fn, time) {
  let timeoutId; // stores timeoutId so it can be shared
  return function() { // returns a function that wraps the original callback
    const args = [fn, time]
        .concat(copyToArray(arguments)); // captures the arguments into an array
    clearTimeout(timeoutId);  // resets the timer
    timeoutId = window.setTimeout.apply(window, args); // proxies the arguments to the setTimeout method
  }
}

function sendRequest(query) { // helper method to send HTTP
   console.log('querying...');
   let searchResults = [];
   if(query && query.length > 0) {
      for(result of testData) { // loop through test data and find matches
         if(result.startsWith(query)) {
             searchResults.push(result);
         }
      }
   }
   if(searchResults.length === 0) { // if no matches are found, clear the results
       clearResults(results);
   }
   else {  // otherwise append the items found
      for(let result of searchResults) {
         appendResult(result, results);
      }
   }
}

let debouncedRequest = debounce(sendRequest, 1000); // wraps the helper HTTP request method with debounce

searchBox.addEventListener('keyup', function (event) {
  debouncedRequest(event.target.value); // Invokes the debounced version of the function after handling user input
});



function clearResults(container) {
  while(container.childElementCount > 0) {
     container.removeChild(container.firstChild);
  }
}

function appendResult(result, container) {
    let li = document.createElement('li');
    let text = document.createTextNode(result);
    li.appendChild(text);
    container.appendChild(li);
}
