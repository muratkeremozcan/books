/**
 *  RxJS in Action
 *  Listing 9.12
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

// This unit test attempts to simulate a user entering the letters rx quickly, producing two results. 
// The stream gets debounced with 500 ms, and finally the third and fourth letters are entered to make rxjs. 
// At this moment, the dummy AJAX observable returns only one result to simulate the result set being filtered down.

mocha.setup({ ui: 'bdd', checkLeaks: true });

const expect = chai.expect;
const assert = chai.assert;

const notEmpty = input => !!input && input.trim().length > 0;

function assertDeepEqual(actual, expected) {
	expect(actual).to.deep.equal(expected);
}

// Helper function to embed any number of time units “-”into a marble diagram
function frames(n = 1, unit = '-') {
	return (n === 1) ? unit :
		unit + frames(n - 1, unit);
}

describe('Search component', function () {
	// Dummy data for first search action
	const results_1 = [
		'rxmarbles.com',
		'https://www.manning.com/books/rxjs-in-action'];
	// dummy data
	const results_2 =
		['https://www.manning.com/books/rxjs-in-action'];

	// Stub search stream that will be projected onto the source observable as part of the search
	const searchFn = term => {
		let r = [];
		if (term.toLowerCase() === 'rx') {
			r = results_1;
		}
		else if (term.toLowerCase() === 'rxjs') {
			r = results_2;
		}
		return Rx.Observable.of(r);
	};

	it('Should test the search stream with debouncing', function () {
		// User input into search stream
		let searchTerms = {
			a: 'r',
			b: 'rx',
			c: 'rxjs',
		};

		let scheduler = new Rx.TestScheduler(assertDeepEqual);
		// Observable that describes the debounce effect. Helper function frames(50) is used to emulate a debounceTime of 500 ms.
		let source = scheduler.createHotObservable(
			'-(ab)-' + frames(50) + '-c|', searchTerms);
    // Invokes the search stream with all necessary pieces
		let r = search$(source, searchFn, '', scheduler);

		let expected = frames(50) + '-f------(s|';

		// Creates expectations for the first and second result sets
		scheduler.expectObservable(r).toBe(expected,
			{
				'f': results_1,
				's': results_2
			});

		scheduler.flush();
	});
});

const search$ = (source$, fetchResult$, url = '', scheduler = null) =>
	source$
		.debounceTime(500, scheduler)
		.filter(notEmpty)
		.do(term => console.log(`Searching with term ${term}`))
		.map(query => url + query)
		.switchMap(fetchResult$);

mocha.run();
