import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposeMessageComponent } from './compose-message/compose-message.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  // {
  //   path: 'crisis-center',
  //   loadChildren: () => import('./crisis-center/crisis-center.module').then(m => m.CrisisCenterModule),
  //   data: { preload: true }
  // },
  {
    path: 'compose',
    component: ComposeMessageComponent,
    outlet: 'popup'
  },
  //  default and wildcard routes are last because we want other components & modules to be matched before these
  { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

// CanActivate :      to mediate navigation to a route.
// CanActivateChild : to mediate navigation to a child route.
// CanDeactivate :    to mediate navigation away from the current route.
// Resolve       :    to perform route data retrieval before route activation.
// CanLoad       :    to mediate navigation to a feature module loaded asynchronously.

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
