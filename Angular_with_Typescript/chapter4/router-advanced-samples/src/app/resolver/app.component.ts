import {Component} from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from "@angular/router";

@Component({
  selector: 'app-root',
  template: `
    <a [routerLink]="['/']">Home</a>&nbsp;
    <a [routerLink]="['mydata']">Data</a>
    <router-outlet></router-outlet>
    <div *ngIf="isNavigating">
      Loading...
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </div>
  `
})
export class AppComponent {

  isNavigating = false; // initially set the flag to false

  constructor (private router: Router){ // injects the router object
    this.router.events.subscribe( // subscribes to router events
      (event) => {
        // sets the flag to true if NavigationStart is triggered
        if (event instanceof NavigationStart){
          this.isNavigating=true;
          console.log("Navigation started");
        }

        // sets the flag to false if NavigationEnd is triggered
        if (event instanceof NavigationEnd) {
          // || event instanceof NavigationError || event instanceof NavigationCancel){
          this.isNavigating=false;
          console.log("Navigation ended");
        }
      }
    );
  }
}
