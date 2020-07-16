import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChatComponent} from './chat/chat.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  // at base path, redirectTo home, and path must be /home; /home/gibberish would not work
  {path: '',  redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  // Whereas a child route is separated from the parent using the forward slash,
  // (2) an auxiliary route is represented as a URL segment in parentheses.
  // This URL tells you that home and chat are sibling routes. http://localhost:4200/home(aux:chat).
  {path: 'chat', component: ChatComponent, outlet:'aux'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
