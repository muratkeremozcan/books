import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthGuard } from './auth/auth.guard';
import { TemplateFormExampleComponent } from './template-form-example/template-form-example.component';
import { ReactiveFormComplexComponent } from './reactive-form-complex/reactive-form-complex.component';
const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canLoad: [AuthGuard],
  },
  {
    // this route will preload
    path: 'crisis-center',
    loadChildren: () => import('./crisis-center/crisis-center.module').then((m) => m.CrisisCenterModule),
    data: { preload: true } // for custom preloading strategy
  },
  {
    // this route will lazy load, only when requested by the user.
    path: 'reactive-form-example',
    loadChildren: () => import('./reactive-form-example/reactive-form-example.module').then((m) => m.ReactiveFormExampleModule)
  },
  // these routes below are all loaded after preloaded modules, but before lazy loaded modules (because those are on demand)
  {
    path: 'compose',
    component: ComposeMessageComponent,
    outlet: 'popup', // outlet property is used for secondary routes (like the popup)
  },
  {
    path: 'template-form-example',
    component: TemplateFormExampleComponent
  },
  {
    path: 'reactive-form-complex',
    component: ReactiveFormComplexComponent
  },
  //  default and wildcard routes are last because we want other components & modules to be matched before these
  { path: '', redirectTo: '/superheroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

// CanActivate :      to mediate navigation to a route.
// CanActivateChild : to mediate navigation to a child route.
// CanDeactivate :    to mediate navigation away from the current route.
// Resolve       :    to perform route data retrieval before route activation.
// CanLoad       :    to mediate navigation to a feature module loaded asynchronously.
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      // for debugging purposes only
      enableTracing: false,

      // When you visit http://localhost:4200, HeroesModule and AuthModule routes (hero/superhero, heroId/superheroId, login) load immediately
      // because HeroesModule & AuthModule are listed in the AppModule imports before AppRoutingModule

      // Once its AppRoutingModule's turn, the router applies the Preloading Strategy (CrisisCenterModule)
      // AdminModule does not preload because CanLoad blocks it.

      // preloadingStrategy: PreloadAllModules,
      // PreloadAllModules would configure the router preloader to start loading all the lazy loaded routes (routes with a loadChildren property).
      // If there is no Preloading, the lazy loaded modules would load on demand instead (such as ReactiveFormExampleModule).

      // The components in the declarations array of app.module are loaded right after preloaded modules. Lazy loaded modules are on demand. This help reduce the initial bundle size.


      // instead of preloading all lazy-loaded modules, this one only pre-loads the ones with route.data.preload flag
      preloadingStrategy: SelectivePreloadingStrategyService
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
``
