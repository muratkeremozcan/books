import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'

import { StateService } from './state.service';

@Component({
  selector: "search",
  template: `
      <input type="text" placeholder="Enter product" [formControl]="searchInput">
    `
})
export class SearchComponent {

  searchInput: FormControl;

  // (4.4) have to inject the StateService into the component
  constructor(private state: StateService) {
    // use the Forms API to subscribe to the valueChanges observable, we will emit any value that comes out
    this.searchInput = new FormControl('');
    this.searchInput.valueChanges
      .pipe(debounceTime(500)) // slight delay so that the value shows up at recipient components not in real time
      // (4.5, using 4.2) the source component sets the state / emits the event
      .subscribe(searchValue => this.state.searchCriteria = searchValue);
  }
}
