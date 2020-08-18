import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs';


// [4] using async pipe to avoid subscribing in the template
// note: this section is not related to [1] FormControl or [2] swithMap, debounceTime and catchError operators
// high level:
// Angular has AsyncPipe which autosubscribes to the observable, and renders it in the template
// this helps avoid subscribing in the template; just use observable$ | async  , and you yield the value

@Component({
  selector: 'app-root',
  template: `{{numbers$ | async}}`
})
export class AppComponent {

  // because of the async pipe in the template, there is no need to subscribe at the TS to observe the side effects
  numbers$ = interval(1000)
    .pipe(take(10));
}
