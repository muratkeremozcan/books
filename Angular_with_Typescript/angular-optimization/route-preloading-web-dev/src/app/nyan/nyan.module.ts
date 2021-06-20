import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NyanComponent } from './nyan.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NyanComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: NyanComponent
      }
    ]),
    CommonModule
  ]
})
export class NyanModule { }
