import { Component } from '@angular/core';

@Component({
  selector: 'app-root', // other components can use the tag app-root to refer to this component
  templateUrl: './app.component.html', // the html and css are kept in these files
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hello-cli';
}


/*
Anguler CLI commands used:

ng new hello-cli


ng serve - will run the application on lite server

ng build - will bundle files and put it in dist folder so that we can use those for deployment on servers.

--jit : ng serve
angular used to use JIT by default, now it's aot by default.
 * disadvantage: time spent between loading bundles and rendering the UI
 * Angular compiler makes the vendor.bundle.js bigger

--aot : ng serve --aot
the entire application delivered to the browser is precompiled
  * browser renders the UI as soon as the app is loaded, no waiting for code compilation
  * no Angular compiler, smaller vendor.bundle.js

--prod : ng serve --prod  or  ng build --prod
in addition to aot, applies uglify and minify to reduce the bundle further
which reduces runtime warnings given by angular compiler as well increasing performance.

*/
