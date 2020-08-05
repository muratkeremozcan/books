import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataComponent } from './data/data.component';
import { DataResolver } from './data/data.resolver';

// [2] resolve route guard: helps give a reactive feel to the user by loading data a component needs before starting navigation to a component;
// (here you can insert some loading component for the sake of responsive feeling, then navigate to the route once the component is ready)
// at a high level:  implement the guard resolve (2.1),
// (2.1.1) do additional configuration at the component
// set up the resolve guard in routes (2.2)
// and include them in providers (2.3)

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent },
  {
    path: 'mydata', 
    component: DataComponent,
    // (2.2) configure the resolve route, and specify the class that will pre-load (loadedJsonData). Relies on 2.1.1
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
  exports: [RouterModule],
  // (2.3) the guard classes need to be added to the providers of @NgModule (same as 1.3)
  providers: [DataResolver],
})
export class AppRoutingModule { }
