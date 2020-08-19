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
  // (4.5) use the mediator service at the recipient component get the event
  // gets the event displays it in the template with asyc pipe
  searchFor$: Observable<string>;

  constructor(private state: StateService) {
      this.searchFor$ = state.getState();
  }
}
