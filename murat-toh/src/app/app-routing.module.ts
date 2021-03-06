import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategyService } from './_core/selective-preloading-strategy.service';

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
    path: 'crisis-center',
    loadChildren: () => import('./crisis-center/crisis-center.module').then((m) => m.CrisisCenterModule),
    data: { preload: true } // for custom preloading strategy
  },
  {
   path: 'reactive-form-example',
    loadChildren: () => import('./reactive-form-example/reactive-form-example.module').then((m) => m.ReactiveFormExampleModule)
  },
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
  { path: '', redirectTo: '/superheroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      preloadingStrategy: SelectivePreloadingStrategyService
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
