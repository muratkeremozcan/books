import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AboutComponent
      }
    ]),
    CommonModule
  ]
})
export class AboutModule { }
