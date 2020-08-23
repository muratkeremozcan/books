import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CustomPreloadingStrategy } from './custom.preloader';

// [3] lazyloading:  lazy Loading generally, is a concept where we delay loading of an object until it is needed.
// In Angular, all the components listed in the declarations array are loaded together
// with lazy loading, only the component being navgiated to (via route) is loaded instead.

// lazy loading can be used together with resolve route guard [2], although resolve is "eager" in nature
// they work together because, initially, lazy loading loads the relevant component
// then resolver (eagerly) loads the data a component needs before starting navigation to a component

// lazy loading seems to be happening at module level, while resolve is at component level

// at a high level:
// (3.1) configure lazy loading in routes (at app-routing.module.ts)
// (3.2) configure the module to be lazy loaded
// (3.3) create a custom preloader and configure it the providers


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'product',
    component: ProductDetailComponent
  },
  {
    path: 'luxury',
    // (3.1) configure lazy loading in routes. KEY: instead of the property 'component', use loadChildren custom function
    // When the router parses the routes configuration from both root and feature modules,
    // it’ll properly map the luxury path to the LuxuryComponent that’s declared in the LuxuryModule.
    loadChildren: () => import('./luxury/luxury.module').then(m => m.LuxuryModule),
    data: { preloadme: true }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: CustomPreloadingStrategy } // (3): optinal preloading strategy
    )
  ],
  exports: [RouterModule],
  // (3.3)  because the preloading strategy is an injectable service, it has to be listed under providers
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule { }
