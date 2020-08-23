import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChatComponent} from './chat/chat.component';
import { NgModule } from '@angular/core';

// [4] multiple router outlets
// this is about having primary and secondary router <router-outlet>'s in 1 component (example: auxillary chat window )
// nothing to do in particular with route guards canActivate canDeactivate [1] or resolve [2] or lazy loading [3]


// high level:
// (4.1) setup the secondary router outlet at the template:  primary router outlet is the same  :  <router-outlet></router-outlet>
// secondary router outlets get a name attribute <router-outlet name="aux"></router-outlet>
// (4.2) setup the auxillary route at the template
// (4.3) setup the links to nav & remove the auxillary route at the template

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  // at base path, redirectTo home, and path must be /home; /home/gibberish would not work
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // (4.2) setup the auxillary route (note the matching with the setting at 4.1)
  // Whereas a child route is separated from the parent using the forward slash,
  //  an auxiliary route is represented as a URL segment in parentheses.
  // This URL tells you that home and chat are sibling routes. http://localhost:4200/home(aux:chat).
  {
    outlet:'aux',
    path: 'chat',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
