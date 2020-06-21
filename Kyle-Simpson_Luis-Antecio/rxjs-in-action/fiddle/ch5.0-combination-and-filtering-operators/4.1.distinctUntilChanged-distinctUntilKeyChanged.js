import { from } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged } from 'rxjs/operators';

// distinctUntilChanged(): Only emit when the current value is different than the last.
// signature: distinctUntilChanged(compare: function): Observable
// 💡 distinctUntilChanged uses === comparison by default, object references must match!
// 💡 If you want to compare based on an object property, you can use distinctUntilKeyChanged() instead!


// distinctUntilKeyChanged: Only emit when the specified key value has changed
// ignature: distinctUntilKeyChanged(key, compare: fn): Observable


// distinctUntilChanged with objects

const sampleObject = { name : 'Test' };

// the objects have the same reference
const source1$ = from([sampleObject, sampleObject, sampleObject]);

// only emit distinct objects, based on last emitted value
source1$.pipe(
  distinctUntilChanged()
).subscribe(console.log);


// comparing objects with custom compare function

const source2$ = from([
  { name: 'Brian' },
  { name: 'Joe' },
  { name: 'Joe' },
  { name: 'Sue' }
]);

// will skip duplicate values
source2$.pipe(
  distinctUntilChanged((prev, curr) => prev.name === curr.name)
).subscribe(console.log);

// you can do the same with distinctUntilKeyChanged
source2$.pipe(
  distinctUntilKeyChanged('name')
).subscribe(console.log);