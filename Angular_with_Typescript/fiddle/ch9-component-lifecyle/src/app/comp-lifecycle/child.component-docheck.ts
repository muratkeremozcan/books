import {
  DoCheck, Input, Component, KeyValueDiffers, KeyValueChangeRecord,
  KeyValueDiffer
} from "@angular/core";

// example of using ngDoCheck() to do debugging (or maybe logging in a real world app)
// warning: use ngDoCheck() only if you can’t find another way of intercepting data changes, because it may affect the performance of your app.


@Component({
  selector: 'child',
  styles: ['.child{background: lightgreen}'],
  template: `
    <div class="child">
      <h2>Child</h2>
      <div>Greeting: {{greeting}}</div>
      <div>User name: {{user.name}}</div>
    </div>
  `
})
export class ChildComponent implements DoCheck {
  @Input() greeting: string;
  @Input() user: { name: string };

  // 1 Declares a variable for storing differences
  differ: KeyValueDiffer<string, string>;

  // 2 Injects the service for monitoring changes
  constructor(private _differs: KeyValueDiffers) { }

  // 3 Initializes the differ variable for storing differences in the user object
  ngOnInit() {
    this.differ = this._differs.find(this.user).create();
  }

  // 4 Implements the callback ngDoCheck()
  ngDoCheck() {
    if (this.user && this.differ) {
      // 5 Checks whether the properties of the user object changed
      const changes = this.differ.diff(this.user);

      if (changes) {
        // 6 Gets the record of changes for each user property
        changes.forEachChangedItem(
          (record: KeyValueChangeRecord<string, string>) =>
            console.log(
              `Got changes in property ${record.key}
               before: ${record.previousValue} after: ${record.currentValue}`
            )
        );
      }
    }
  }
}


// 7 Prints the changes on the console
