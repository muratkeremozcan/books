import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuxuryComponent } from './luxury/luxury.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
     // (1) same configuration as regular child modules:
    CommonModule, // required for feature module
    RouterModule.forChild([ // configure default route using forChild for feature modules
      { path: '', component: LuxuryComponent }
    ])
  ],
  declarations: [LuxuryComponent],  // specify default rendered component for this module
  // Contrast to w/o lazy loading there is no need to export the module
  // exports: [LuxuryModule]
})

export class LuxuryModule { }
