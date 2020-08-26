import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShippingModule } from './shipping/shipping.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShippingModule // (2.3) you have to include the sub modules you want to import manually
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
