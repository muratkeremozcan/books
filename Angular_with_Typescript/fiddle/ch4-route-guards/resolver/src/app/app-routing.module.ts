import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataComponent } from './data/data.component';
import { DataResolver } from './data/data.resolver';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'mydata', component: DataComponent,
    // (2) configure the resolve route, and specify the class that will pre-load (loadedJsonData)
    resolve: {
      loadedJsonData: DataResolver
    },
    // runGuardsAndResolvers: 'always', // optinal: allows to run guards on resolvers on repeated initialization
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { onSameUrlNavigation: 'reload' } // optional: Reloads the component when the user navigates to the same route
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
