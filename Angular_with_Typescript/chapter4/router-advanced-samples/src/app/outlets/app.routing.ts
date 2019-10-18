import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home.component";
import {ChatComponent} from "./chat.component";


const routes: Routes = [
  // redirects empty path to home route
  {path: '',  redirectTo: 'home', pathMatch: 'full'},
  // if the url contains home, render the HomeComponent in the primary outlet
  {path: 'home', component: HomeComponent},
  // if the url includes chat, renders the ChatComponent in the outlet name aux
  {path: 'chat', component: ChatComponent, outlet:"aux"}
];

export const routing = RouterModule.forRoot(routes);
