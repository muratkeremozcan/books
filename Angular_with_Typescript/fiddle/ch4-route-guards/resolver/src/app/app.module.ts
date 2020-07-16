import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DataComponent } from './data/data.component';
import { DataService } from './data/data.service';
import { DataResolver } from './data/data.resolver';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressBarModule // must be imported since it's a module
  ],
  providers: [DataResolver, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*
ng new ch4-resolve-route
ng g c home
ng g c data
ng g s dataService
ng g s dataResolver
*/
