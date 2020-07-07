import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'one-way';
  name: string = 'Boris Lipsman! Hello from the chapter.Angular9';

  changeName() {
    this.name = 'Bill Smart';
  }
}
