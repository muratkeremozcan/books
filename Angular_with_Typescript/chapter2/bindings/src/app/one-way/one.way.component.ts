import { Component } from '@angular/core';

@Component({
  // parentheses represent event binding ( )
    // if the button is clicked, invoke the changeName() function
    // When the event specified in parentheses is triggered, the expression in double brackets is reevaluated {{ }} :interpolation
  selector: 'app-root',
  template: `
    <h1>{{ name }}</h1>
    <button (click)="changeName()">Change name</button>
  `
})
export class AppComponent {
  // one/uni-directional binding from the class to the view
  // to display a value of a class variable in a template, use {{ }}
  name: string = 'Mary Smith';

  // a button click updates the value of name to Bill Smart
  changeName() {
    this.name = 'Bill Smart';
  }
}
