import { empty } from 'rxjs';

// Observable that immediately completes.
// signature: empty(scheduler: Scheduler): Observable

empty().subscribe(
  // val => console.log(val),
  // null,
  // () => console.log('complete')
  { // side note: you could also have this in an object with next and complete properties defined
    next: val => console.log(val),
    complete: () => console.log('complete')
  }
);

// complex example at https://stackblitz.com/edit/typescript-uujo8t?file=index.ts&devtoolsheight=50