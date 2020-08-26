import { Component } from '@angular/core';
import {
  Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isNavigating = false;

  // (4) Subscribe to Router events so you can have logic for load bar display
  // Sets the flag to true if NavigationStart is triggered
  // Sets the flag to false if NavigationEnd is triggered
  constructor(private router: Router) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart){
          this.isNavigating = true;
          console.log('Navigation started');
        }

        if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
          this.isNavigating = false;
          console.log('Navigation ended');
        }
      }
    );
  }
}
