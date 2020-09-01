import { of, from } from 'rxjs';
import { distinct, distinctUntilChanged } from 'rxjs/operators';

// distinct(): emits items emitted that are distinct based on any previously emitted item
// signature: distinct(keySelector?, flushes?): Observable
// contrast to distinctUntilChanged(): distinct() outputs the unique items, distinctUntilChanged() is for unique when back to back

of(1, 2, 3, 4, 5, 1, 1, 2, 2, 2, 3, 4, 5)
  .pipe(distinct())
  // OUTPUT: 1,2,3,4,5
  .subscribe(console.log);

// contrast to distinctUntilChanged() :
of(1, 2, 3, 4, 5, 1, 1, 2, 2, 2, 3, 4, 5)
  .pipe(distinctUntilChanged())
  // OUTPUT: 1,2,3,4,5, 1,2,3,4,5
  .subscribe(console.log);


// distinct with object key selector

const obj1 = { id: 3, name: 'name 1' };
const obj2 = { id: 4, name: 'name 2' };
const obj3 = { id: 3, name: 'name 3' };
const vals = [obj1, obj2, obj3];

from(vals).pipe(
  distinct(e => e.id)
).subscribe(console.log); // skips the 2nd id: 3