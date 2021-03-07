import { Component } from '@angular/core';

export type EditorType = 'name' | 'profile';

@Component({
  selector: 'app-reactive-form-example-home',
  templateUrl: './reactive-form-example-home.component.html'
})
export class ReactiveFormExampleHomeComponent {
  editor: EditorType = 'name';

  get showNameEditor() {
    return this.editor === 'name';
  }

  get showProfileEditor() {
    return this.editor === 'profile';
  }

  toggleEditor(type: EditorType) {
    this.editor = type;
  }
}
