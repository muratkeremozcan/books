/**
 *  RxJS in Action
 *  Listing 4.12
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

/** helper function to check if a string is not empty */
const notEmpty = input => !!input && input.trim().length > 0;

const sendRequest = function(arr, query) { // helper method to send HTTP
  return arr.filter(item => {
    return query.length > 0 && item.startsWith(query);
  });
};

// very similar to google address
Rx.Observable.fromEvent(searchBox, 'keyup')
  .debounceTime(1000) // ignore the spam of key-ups for the past 1 second, get the query at the end of 1 sec
  .pluck('target', 'value')
  .filter(notEmpty)
  .do(query => console.log(`Querying for ${query}...`))
  .map(query => sendRequest(testData, query))
  .forEach(result => {
    clearResults(results);
    appendResults(result, results);
  });

function clearResults(container) {
  while(container.childElementCount > 0) {
     container.removeChild(container.firstChild);
  }
}

function appendResults(results, container) {
  for (let result of results ) {
    let li = document.createElement('li');
    let text = document.createTextNode(result);
    li.appendChild(text);
    container.appendChild(li);
  }
}
