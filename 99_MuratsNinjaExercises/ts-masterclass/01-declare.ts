// ambient declaration
// tells TS that the variable is somewhere but not saying where
// use it if there is no declaration file for the module you are using
// usually the lib types exist and you use them
// I've seen this for declaring global namespace for Cypress in the cypress.d.ts file

/* // cypress.d.ts
export {}
declare global {
  namespace Cypress {
    interface Chainable {

			getByCy(qaSelector: string, args?: any): Chainable<JQuery<HTMLElement>>

		}
	}
}
*/

declare let variableDefinedSomewhereElse: number

// declare let $: JQuery

// you can declare anything that exists in JS
