import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs';


// [4] note: this section is not related to [1,2,3]
// Angular has AsyncPipe which autosubscribe to the observable, and renders it in the template
// helps avoid creating subscriptions in the teamplate
// in the teamplate: observable$ | async  , and you yield the value

@Component({
  selector: 'app-root',
  template: `{{numbers$ | async}}`
})
export class AppComponent {

  // because of the async pipe in the teamplate, there is no need to subscribe at the TS to observe the side effects
  numbers$ = interval(1000)
    .pipe(take(10));
}
