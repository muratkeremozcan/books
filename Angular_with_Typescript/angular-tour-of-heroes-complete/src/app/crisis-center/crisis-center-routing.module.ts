import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrisisCenterHomeComponent } from './crisis-center-home/crisis-center-home.component';
import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { CrisisCenterComponent } from './crisis-center/crisis-center.component';
import { CrisisDetailComponent } from './crisis-detail/crisis-detail.component';

import { CanDeactivateGuard } from '../can-deactivate.guard';
import { CrisisDetailResolverService } from './crisis-detail-resolver.service';


// CanActivate :      to mediate navigation to a route.
// CanActivateChild : to mediate navigation to a child route.
// CanDeactivate :    to mediate navigation away from the current route.
// Resolve       :    to perform route data retrieval before route activation.
// CanLoad       :    to mediate navigation to a feature module loaded asynchronously.
const crisisCenterRoutes: Routes = [
  {
    path: '',
    component: CrisisCenterComponent,
    children: [
      {
        path: '',
        component: CrisisListComponent,
        children: [
          {
            path: ':id',
            component: CrisisDetailComponent,
            canDeactivate: [CanDeactivateGuard],
            // why use resolver?
            // CrisisDetailComponent retrieves the selected crisis.
            // If the crisis is not found, the router navigates back to the crisis list view.
            // The experience is  better if all of this were handled first, before the route is activated.
            // A resolver service can retrieve a component or navigate away if the component does not exist
            // BEFORE activating the route and creating the component
            resolve: {
              crisis: CrisisDetailResolverService
            }
          },
          {
            path: '',
            component: CrisisCenterHomeComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(crisisCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CrisisCenterRoutingModule { }
