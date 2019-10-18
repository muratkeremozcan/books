// listing 2.9 : add shipping module to the root module

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ShippingModule } from './shipping/shipping.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ShippingModule // adds shipping module to the root module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
