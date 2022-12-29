# Recommended learning path

When starting, I did not get the privilege of deciding which resource would be the best to learn first. Usually I would start a book and realize I do not know the foundational information needed to understand it. For example, you should really know Functional Programming before trying to understand RxJs.

For a new learner, I would recommend a better approach.
**You have not worked with Cypress and want to get oriented:**

Go through these resources for quick onboarding:

- [Cypress basics workshop](https://github.com/bahmutov/cypress-workshop-basics "https://github.com/bahmutov/cypress-workshop-basics") (UI testing)
- [Crud API testing a deployed service](https://dev.to/muratkeremozcan/crud-api-testing-a-deployed-service-with-cypress-using-cy-api-spok-cypress-data-session-cypress-each-4mlg "https://dev.to/muratkeremozcan/crud-api-testing-a-deployed-service-with-cypress-using-cy-api-spok-cypress-data-session-cypress-each-4mlg") (API testing)

**You are a JS ninja, and want to learn testing:**  
Section 4 has you covered.

**You want to give yourself a CS degree in JS and a masters in testing:**  
Sections 1 - 5. You can also learn Cypress first, then learn some testing, and back-fill the knowledge as needed. It all depends how much magic you are willing to let happen when working with code.

## 1. Really learn JS, and some TS

Our tech stack is JS/TS and we use these languages to test our stack as well.  
If you are not comfortable in JS, here are some recommended resources

- [You Don't Know JS Series](https://github.com/getify/You-Dont-Know-JS "https://github.com/getify/You-Dont-Know-JS") (Kyle Simpson)
- [Secrets of the JavaScript Ninja](https://www.manning.com/books/secrets-of-the-javascript-ninja-second-edition "https://www.manning.com/books/secrets-of-the-javascript-ninja-second-edition") (John Resig and Bear Bibeault)
- [Typescript Deep Dive](https://basarat.gitbook.io/typescript/ "https://basarat.gitbook.io/typescript/") (Basarat Ali Syed)

## 2. Learn Functional Programming in JS

Learning FP is optional, but it will only help you understand, appreciate, use and test JS better.  
Pick any book, optionally more depending how deep you want to go.

- [Functional Light JS](https://www.manning.com/books/functional-light-javascript "https://www.manning.com/books/functional-light-javascript")
- [FP in JS](https://www.amazon.com/Functional-Programming-JavaScript-functional-techniques-ebook-dp-B09781W9HY/dp/B09781W9HY/ref=mt_other?_encoding=UTF8&me=&qid= "https://www.amazon.com/Functional-Programming-JavaScript-functional-techniques-ebook-dp-B09781W9HY/dp/B09781W9HY/ref=mt_other?_encoding=UTF8&me=&qid=")
- [Prof. Frisbie's Mostly Adequate Guide to FP](https://mostly-adequate.gitbook.io/mostly-adequate-guide/ "https://mostly-adequate.gitbook.io/mostly-adequate-guide/")
- [FP patterns with Ramda](https://www.educative.io/courses/functional-programming-patterns-with-ramdajs/YQV9QG6gqz9)
- [JS Allonge](https://leanpub.com/javascriptallongesix/read "https://leanpub.com/javascriptallongesix/read")
- [Composing Software](https://leanpub.com/composingsoftware)
- [Functional JavaScript](https://www.amazon.com/gp/product/1449360726)

## 3. After that, you can tackle the front-end or the back-end path. The order depends on your immediate needs.

You can utilize [Info & Resources in Engineering Onboarding](https://helloextend.atlassian.net/wiki/spaces/ENG/pages/1115816012/Info+Resources "https://helloextend.atlassian.net/wiki/spaces/ENG/pages/1115816012/Info+Resources") or follow [Murat’s recommended reading](https://github.com/muratkeremozcan/books "https://github.com/muratkeremozcan/books").

## 4. Learn testing

- [[[Test Methodologies]]](https://helloextend.atlassian.net/wiki/spaces/ENG/pages/1264189502 "/wiki/spaces/ENG/pages/1264189502")
- Understand and start applying best practices we strive for:

  - [UI testing best practices](https://github.com/NoriSte/ui-testing-best-practices "https://github.com/NoriSte/ui-testing-best-practices")
  - [NodeJS testing best practices](https://github.com/goldbergyoni/javascript-testing-best-practices "https://github.com/goldbergyoni/javascript-testing-best-practices")

- Learn test frameworks:

  - Cypress

    - [Crud API testing a deployed service](https://dev.to/muratkeremozcan/crud-api-testing-a-deployed-service-with-cypress-using-cy-api-spok-cypress-data-session-cypress-each-4mlg "https://dev.to/muratkeremozcan/crud-api-testing-a-deployed-service-with-cypress-using-cy-api-spok-cypress-data-session-cypress-each-4mlg")
    - [Cypress basics workshop](https://github.com/bahmutov/cypress-workshop-basics "https://github.com/bahmutov/cypress-workshop-basics")
    - [Cypress Skills Ladder](https://cypress.tips/skills "https://cypress.tips/skills")
    - [Cypress docs](https://docs.cypress.io/guides/references/assertions#Class "https://docs.cypress.io/guides/references/assertions#Class")
    - Official [Cypress example recipes](https://github.com/cypress-io/cypress-example-recipes "https://github.com/cypress-io/cypress-example-recipes")
    - [Cypress real world app](https://github.com/cypress-io/cypress-realworld-app "https://github.com/cypress-io/cypress-realworld-app")
    - Gleb's [Cypress recipes](https://github.com/bahmutov/cypress-examples "https://github.com/bahmutov/cypress-examples")
    - Gleb's [Cypress tips](https://cypress.tips/search "https://cypress.tips/search")
    - Murat's [Cypress examples](https://github.com/muratkeremozcan/cypressExamples "https://github.com/muratkeremozcan/cypressExamples")
    - Understand and start applying [Functional Test Patterns with Cypress](https://dev.to/muratkeremozcan/functional-test-patterns-with-cypress-27ed "https://dev.to/muratkeremozcan/functional-test-patterns-with-cypress-27ed") (no more page objects)
    - [Advanced Cypress workshop](https://github.com/cypress-io/testing-workshop-cypress "https://github.com/cypress-io/testing-workshop-cypress")

  - Kent Dodd's [Epic React](https://epicreact.dev/learn) & [TestingJs](https://testingjavascript.com/) ([my repo](https://github.com/muratkeremozcan/epic-react-testingJs))
  - [A quick Journey Through API testing](https://www.amazon.com/journey-Testing-Application-practices-features-ebook/dp/B07MH81L1X "https://www.amazon.com/journey-Testing-Application-practices-features-ebook/dp/B07MH81L1X") ([repo](https://github.com/muratkeremozcan/cypressExamples/tree/master/cypress-api-testing "https://github.com/muratkeremozcan/cypressExamples/tree/master/cypress-api-testing")) - if you are unfamiliar with api testing
  - [K6](https://k6.io/docs/ "https://k6.io/docs/") ([quick tutorial](https://github.com/muratkeremozcan/k6-loadImpact "https://github.com/muratkeremozcan/k6-loadImpact"))
  - [Pact.io](https://docs.pact.io/implementation_guides/javascript "https://docs.pact.io/implementation_guides/javascript") ([sample code](https://github.com/muratkeremozcan/pactio "https://github.com/muratkeremozcan/pactio"))

## 5. Once you have full stack awareness, start learning DevOps

- Bash & Linux
- Docker
- AWS
- Learn your preferred CI provider's api by heart, ex: [Github Actions](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions "https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions").

## Other learning

[Murat’s Blog](https://dev.to/muratkeremozcan "https://dev.to/muratkeremozcan") & [YouTube](https://www.youtube.com/user/Mrrmuradi/videos "https://www.youtube.com/user/Mrrmuradi/videos").
