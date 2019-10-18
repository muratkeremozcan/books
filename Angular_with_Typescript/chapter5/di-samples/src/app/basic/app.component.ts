import { Component } from '@angular/core';

// including the product component in the template (the component's selector is di-product-page)
@Component({
  selector: 'app-root',
  template: `<h1> Basic Dependency Injection Sample</h1>
             <di-product-page></di-product-page>`
            })
export class AppComponent {}
