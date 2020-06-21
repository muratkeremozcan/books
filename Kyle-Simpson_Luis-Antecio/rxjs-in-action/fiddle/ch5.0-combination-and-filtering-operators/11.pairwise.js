import { pairwise, take } from 'rxjs/operators';
import { interval } from 'rxjs';

// Emit the previous and current values as an array.

// signature: pairwise(): Observable<Array>

interval(1000).pipe(
  pairwise(),
  take(5)
).subscribe(console.log)