import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';

import { ReactiveFormExampleHomeComponent } from './reactive-form-example-home/reactive-form-example-home-component';


const reactiveFormRoutes: Routes = [
  {
    path: '',
    component: ReactiveFormExampleHomeComponent,
    children: [
      {
        path: '',
        component: NameEditorComponent
      },
      {
        path: '',
        component: ProfileEditorComponent
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(reactiveFormRoutes)
  ],
  exports: [RouterModule]
})
export class ReactiveFormExampleRoutingModule { }
