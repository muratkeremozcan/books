import {Component} from '@angular/core';
import {StateService} from './state.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'product',
  template: `
    <div class="ebay">
      <h2>eBay component</h2>
      Search criteria: {{searchFor$ | async}}
    </div>`,
  styles: ['.ebay {background: cyan}']
})
export class EbayComponent {
  // (4.6) the recipient component creates an observable,
  // uses the mediator service to get the state/the event (using 4.3),
  // displays it in the template with asyc pipe
  searchFor$: Observable<string>;

  constructor(private state: StateService) {
      this.searchFor$ = state.getState();
  }
}
