import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {counterReducer} from './reducer';
import {StoreModule} from '@ngrx/store';
import { ChildComponent } from './child/child.component';

@NgModule({
    declarations: [
        AppComponent,
        ChildComponent
    ],
    imports: [
        BrowserModule,
        // [2] import StoreModule and define the name of the state (stateName), set its value as the reducerFunc
        StoreModule.forRoot({counterState: counterReducer})
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
