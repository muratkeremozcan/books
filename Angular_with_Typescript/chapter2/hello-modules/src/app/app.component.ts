import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // listing 2.10 add <app-shipping></app-shipping> to app.component.html template
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hello-modules';
}
