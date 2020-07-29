import {Component} from "@angular/core";

// uses two-way binding to synchronize properties with entered text
// then uses property binding to the child
@Component({
  selector: 'app-root',
  styles: ['.parent {background: deeppink}'],
  template: `
    <div class="parent">
      <h2>Parent</h2>
      <div>Greeting: <input type="text" [(ngModel)]="myGreeting">
      </div>
      <div>User name: <input type="text" [(ngModel)]="myUser.name">
      </div>
      <child [greeting]="myGreeting" [user]="myUser"></child>
    </div>
  `
})
export class AppComponent {
  myGreeting = 'Hello';
  myUser: {name: string} = {name: 'John'};
}




/*
import {Component} from "@angular/core";
@Component({
  selector: 'app-root',
  styles: ['.parent {background: deeppink}'],
  template: `
     <div class="parent">
       <h2>Parent</h2>
      <div>Greeting: <input type="text" [value]="myGreeting"
                         (change)="myGreeting = $event.target.value">
      </div>
      <div>User name: <input type="text" [value]="myUser.name"
                         (change)="myUser.name = $event.target.value">
      </div>
      <child [greeting]="myGreeting" [user]="myUser"></child>
    </div>
  `
})
export class AppComponent {
  myGreeting = 'Hello';
  myUser: {name: string} = {name: 'John'};
}
*/

/*
CHANGE DETECTION
The change detector keeps track of all async calls made in components, services, and so forth
When Angular compiles component templates, each component gets its own change detector. When CD is initiated by the Zone,
it makes a single pass, starting from the root down to the leaf components, checking to see whether the UI of each component needs to be updated

The CD mechanism applies changes in the component’s properties to its UI. CD never changes the value of the component’s property.

For UI updates, Angular offers two CD strategies: Default and OnPush.
If all components use the Default strategy, the Zone checks the entire component tree, regardless of where the change happened.

If a particular component declares the OnPush strategy, the Zone checks this component and its children only if the bindings to the component’s input properties have changed,
 or if the component uses AsyncPipe, and the corresponding observable started emitting values.
Changes triggered by siblings or cousins will not trigger changes in the OnPush component or its children. It is performance efficient this way.


LIFECYCLE METHODS

-- Component initialization --

constructor

* ngOnInit() — Invoked after the first invocation of ngOnChanges(). Used for initial data fetch.
Although you might initialize some component variables in the constructor, the properties of the component aren’t ready yet.
By the time ngOnInit() is invoked, the component properties will have been initialized, which is why this method is mainly used for the initial data fetch.

ngAfterContentInit() — Invoked when the child component’s state is initialized and the projection completes.
Called only if you used <ng-content> in your component’s template

ngAfterViewInit() — Invoked after a component’s view has been fully initialized


-- Component initialization + Change detection --

* ngOnChanges() — Called when a parent component modifies (or initializes) the values bound to the input properties of a child.
If the component has no input properties, ngOnChanges() isn’t invoked.

ngDoCheck() — Called on each pass of the change detector. If you want to implement a custom change detection algorithm or add some debug code, write it in ngDoCheck().
But keep in mind that placing any code in the ngDoCheck() method can affect the performance of your app because this method is invoked on each and every pass of the change detection cycle.

ngAfterContentChecked() — During the change detection cycle, this method is invoked on the component that has <ng-content>
after it gets the updated content from the parent, if the bindings used in the projected content change.

ngAfterViewChecked() — Invoked when the change detection mechanism checks whether there are any changes in the component template’s bindings.
This callback may be called more than once as the result of modifications in this or other components.

-- Component destruction --

ngOnDestroy() — Invoked when the component is being destroyed. Use this callback to clean unneeded resources, for example, to unsubscribe from explicitly created subscriptions or remove timers.


Each lifecycle callback is declared in the interface with a name that matches the name of the callback without the prefix ng.
For example, if you’re planning to implement functionality in the ngOnChanges() callback, add implements OnChanges to your class declaration.

*/
