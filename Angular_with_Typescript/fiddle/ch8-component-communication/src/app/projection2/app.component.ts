import {Component} from '@angular/core';

// [6] In some cases, a parent component needs to render arbitrary markup within a child at runtime,
// you can do that in Angular using projection.
// You can project a fragment of the parent component’s template onto its child’s template by using the ngContent directive.
// (not sure how useful this is)



// [6.1] at parent, define the portion to be projected using the child's selector

@Component({
  selector: 'app-root',
  styles: ['.wrapper {background: deeppink;}'],
  template: `
    <div class="wrapper">
     <h2>Parent</h2>
      <div>This div is defined in the Parent's template</div>
      <child>
        <div class="header" ><i>Child got this header from parent {{todaysDate}}</i></div>
        <div class="footer"><i>Child got this footer from parent</i></div>
      </child>
    </div>
  `
})
export class AppComponent {
  todaysDate = new Date().toLocaleDateString();
}
