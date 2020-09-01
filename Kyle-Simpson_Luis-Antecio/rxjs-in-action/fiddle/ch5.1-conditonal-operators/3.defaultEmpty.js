import { defaultIfEmpty } from 'rxjs/operators';
import { of, empty } from 'rxjs';

// Emit given value if nothing is emitted before completion.
// signature: defaultIfEmpty(defaultValue: any): Observable


// emit 'Observable.of() Empty!' when empty, else any values from source
const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));
exampleOne.subscribe(console.log);


const exampleTwo = empty().pipe(defaultIfEmpty('Observable.empty() Empty!'))
exampleTwo.subscribe(console.log);