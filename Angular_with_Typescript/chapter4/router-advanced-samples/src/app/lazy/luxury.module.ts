import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LuxuryComponent } from "./luxury.component";

@NgModule({
  imports: [CommonModule, // imports CommonModule as required for feature modules
    RouterModule.forChild([ // configures the default route using the forChild() method
      { path: '', component: LuxuryComponent } // by default, renders its only component LuxuryComponent
    ])],
  declarations: [LuxuryComponent]
})

export class LuxuryModule { }
