// tslint:disable-next-line: no-namespace
declare namespace jasmine {
  interface Matchers<T> {
    toHaveText(actual: any, expectationFailOutput?: any): jasmine.CustomMatcher;
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/