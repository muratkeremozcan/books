import { ChildComponent } from './child.component';
import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';

// in [3] we saw that a parent can get @Output from a child and pass to @Input of another
// [5] what if the parent just needs to use the API of a child (not sure where we ever use this, but just in case...)


// (5.1) using the template to invoke the child's api
// The key is using Local template variables,
// at parent:   childPropName=".." #anyPropName   at child:  @Input() childPropName
// then invoke functions of the child through the property :  anyPropName.childFunction()
@Component({
  selector: 'app-root',
  template: `
    <h1>Parent</h1>
    <child name="John" #child1></child>
    <child name="Mary" #child2></child>
    <button (click) ="child2.greet()">Invoke greet() on child 2</button>
    <button (click)="greetAllChildren()">Invoke greet() on both children</button>
  `
})
export class AppComponent implements AfterViewInit {
  // (5.2) using TS to invoke the child's api
  // key: decorate #anyPropName with @ViewChild to reference a child property
  @ViewChild('child1', { static: true })
  firstChild: ChildComponent;  // reference to one child

  @ViewChildren(ChildComponent)
  allChildren: QueryList<ChildComponent>; // reference to all instances of ChildComponent

  ngAfterViewInit() {
    this.firstChild.greet();
  }

  greetAllChildren() {
    this.allChildren.forEach(child => child.greet());
  }
}
