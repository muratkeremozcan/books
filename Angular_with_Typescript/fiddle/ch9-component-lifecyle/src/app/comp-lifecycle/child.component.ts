import {OnChanges, Input, SimpleChange, Component, ChangeDetectionStrategy} from "@angular/core";

@Component({
  selector: 'child',
  styles: ['.child{background:lightgreen}'],
  template: `
    <div class="child">
      <h2>Child</h2>
      <div>Greeting: {{greeting}}</div>
      <div>User name: {{user.name}}</div>
    </div>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush  // uncomment and child component's user name won't be updated
  // (made no difference for me)
})

// Each lifecycle callback is declared in the interface with a name that matches the name of the callback without the prefix ng.
// For example, if you’re planning to implement functionality in the ngOnChanges() callback, add implements OnChanges to your class declaration.
export class ChildComponent implements OnChanges {
  // The child component receives the values from the parent component via its input variables.
  @Input() greeting: string;
  @Input() user: {name: string};

  //  ngOnChanges() — Called when a parent component modifies (or initializes) the values bound to the input properties of a child.
  // ngOnChanges() provides a SimpleChange object containing the old and new values of the modified input property and the flag indicating whether this is the first binding change.
  // JSON.stringify() is needed to pretty print the received values

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    console.log(JSON.stringify(changes, null, 2));
  }
}
// note: Angular doesn’t update bindings to input properties if only the object properties change,
// that is why ngOnChanges() is not invoked for user object
