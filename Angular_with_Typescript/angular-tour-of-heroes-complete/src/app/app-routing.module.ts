import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthGuard } from './auth/auth.guard';
const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'crisis-center',
    loadChildren: () => import('./crisis-center/crisis-center.module').then((m) => m.CrisisCenterModule),
    data: { preload: true } // for custom preloading strategy
  },
  {
    path: 'compose',
    component: ComposeMessageComponent,
    outlet: 'popup',
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
      // PreloadAllModules configures the Router preloader to immediately load all lazy loaded routes (routes with a loadChildren property).
      // When you visit http://localhost:4200, the /heroes route loads immediately upon launch
      // and the router starts loading the CrisisCenterModule right after the HeroesModule loads.
      // AdminModule does not preload because CanLoad blocks it.
      // If there was no Preloading, the lazy loaded modules would load on demand instead.
      // preloadingStrategy: PreloadAllModules,

      // instead of preloading all lazy-loaded modules, this one only pre-loads the ones with route.data.preload flag
      preloadingStrategy: SelectivePreloadingStrategyService
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
``
