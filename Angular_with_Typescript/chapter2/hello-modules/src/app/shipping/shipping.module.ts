// generated with
// ng new hello-modules
// ng g m shipping

// listing 2.4 2.5 2.7
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingComponent } from './shipping.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShippingComponent],
  exports: [ShippingComponent] // exporting a component from the module
})
export class ShippingModule { }
