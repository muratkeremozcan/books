# Testing-angular-applications from the Manning book reproduced

WallabyJs is used for testing ch 1 - ch 3 (first example). These are **isolated tests** and work well with WallabyJs. They do not rely on Angular classes and methods.

`npm i` at root. This is only needed so that WallabyJs can execute Jasmine.

Vs-code: ctrl+P > WallabyJs: start to run the test.

____
Jasmine is used for second part of ch3, ch4 and onwards.

For Ch3 and onwards, nav to **/website** directory. I had better luck with `yarn install` versus `npm i`; node Sass got sassy with npm.

BST the application with `ng serve`.

Run tests with `ng test`.

For Chapter 6, use **chapter06** directory.

Chapter 8 is in **chapter08** directory. `npm i`, update webdriver with `npm run webdriver-update` and run tests with  `npm run e2e <confFile>`.