# TOH Sample App Unit Testing

This base project combines ideas from various separate Tour of Heros examples into an app that demonstrates different techniques, and allows for a good generic base to outline good unit testing practices.

## Unit Testing 

The example will be expanded to cover the following topics over time:

## Items to Cover with Examples
- Non-HTTP Service Testing
- HTTP / API Service Testing
- Component Testing
  - Shallow
  - Deep
  - Mocking Component Child Components
  - Handling Observables and Async Pipes in Component Testing
- Mocking Services
- Mocking HTTP
- Unit Integration Tests and the Adapter Pattern
- Pipes
- Router Testing
  - Guards
  - Resolvers
  - Routed Components

## Testing Libraries
- This example will stick to basic Jasmine / Karma stock angular setup initially.
- Spectator and NG-Mocks will be added in to some tests to demonstrate the reduction of boilerplate necessary for unit testing
- Eventually will show a converstion from Jasmine/Karma -> Jest, and explore benefits and drawbacks of doing this.




# Presentation Agenda

- What is Unit Testing
- Challenges in Testing Angular Applications
- Code Coverage and Angular
- Unit Test Frameworks:
  - Jasmine/Karma
  - Jest
- Writting Maintainable / Testable Code
- Unit Testing Angular Best Practices
  - General Unit Testing Best Practice
  - Test Organization and Naming
  - TDD
  - Test quality and maintainability
  - Angular Component Deep, Shallow and Class Testing
  - Refactoring
- Testing Utilities
  - Spectator: Reduce Boilerplate and ease component, routing and service testing
  - ng-mock: Auto Mocking external Components and Services
- Test Scenario Demos (With and Without Spectator)
  - Testing Services - API and Non API
  - Using Mocks and Spies and when to not mock
  - Observable / Behavior Subjects / AsyncPipe
  - Using FakeAsync
