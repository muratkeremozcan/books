console.log('I am running');

// Observables let you subscribe to a stream of data 
// that you can process by composing and chaining operations together elegantly.

Rx.Observable.fromEvent(document.querySelector('#student-ssn'), 'keyup')
  .pluck('srcElement', 'value')
  .map(ssn => ssn.replace(/^\s*|\s*$|\-/g, '')) // you want to mutate data? use map (doesn't mutate)
  .filter(ssn => ssn !== null && ssn.length === 9) // you want conditional logic? use filter
  .subscribe(validSsn => {
    console.log(`Valid ssn ${validSsn}`);
  });