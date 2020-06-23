import { of } from 'rxjs';
import { takeLast, take } from 'rxjs/operators';

// takeLast(): emit the last n emitted values before completion
// signature: takeLast(count: number): Observable
// 💡 If you want only the last emission from multiple observables, on completion of multiple observables, try forkJoin!


const source = of('Ignore', 'Ignore', 'Hello', 'World!');

// take the last 2 emitted values
source.pipe(
  takeLast(2)
).subscribe(console.log);
// Hello, World!


// constrast with take(): take() takes the initial values
source.pipe(
  take(2)
).subscribe(console.log);
// Ignore, Ignore