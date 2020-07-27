import {Component, OnDestroy} from '@angular/core';
import {StateService} from './state.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'amazon',
  template: `<div class="amz">
                <h2 >Amazon component</h2>
               Search criteria: {{searchFor}}
               </div>`,
  styles: ['.amz {background: pink}']
})
export class AmazonComponent implements OnDestroy{

  searchFor: string;
  subscription: Subscription;

  // if you do not want to use the amazing async pipe
  // in order to get the state, you subscribe and set a property with the value received from the state
  constructor(private state: StateService){
    this.subscription = state.getState()
      .subscribe(event => this.searchFor = event);
  }
  // and then you have to unsubscribe implementing & returning an OnDestroy
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
