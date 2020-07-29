import {Component, ViewEncapsulation} from "@angular/core";

// [6.2]  at child, define the insertion point at the child <ng-content></ng-content>
@Component({
  selector: 'child',
 styles: ['.wrapper {background: lightgreen;}'],
  template: `
    <div class="wrapper">
     <h2>Child</h2>
      <ng-content select=".header" ></ng-content><p>
      <div>This content is defined in child</div><p>
      <ng-content select=".footer"></ng-content>
    </div>
  `
})
export class ChildComponent {}
