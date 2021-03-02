import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NameEditorComponent } from './name-editor/name-editor.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { ReactiveFormExampleHomeComponent } from './reactive-form-example-home/reactive-form-example-home-component';
import { ReactiveFormExampleRoutingModule } from './reactive-form-example.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormExampleRoutingModule // the routing module has to be in the imports array of the main module
  ],
  declarations: [
    ReactiveFormExampleHomeComponent,
    NameEditorComponent,
    ProfileEditorComponent
  ]
})
export class ReactiveFormExampleModule { }
