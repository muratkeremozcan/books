## Introduction to Contract Testing

Contract testing ensures that two systems (e.g., a web application and an API, or 2 APIs) have a shared understanding of expectations, verified through a "contract", usually a json file that captures the interactions between the systems. It's particularly useful in microservices architectures.

**How Contract Testing Works:**

* The consumer defines the expected interactions and stores them in a contract. During this process the consumer creates and tests against a mock provider, generating a contract. They publish the contract to the PactBroker.

* The provider (e.g., an API) verifies that it can meet these expectations by running tests against the contract.

* Both sides interact through this contract, ensuring compatibility before deploying changes. The contract is what binds the systems together, without needing to be on the same machine or deployment.

**Why Contract Testing Matters:**

- You can test it up front, even when you're doing local development of the client or the service; fast feedback.
- You can deploy changes independently and with confidence.
- Reduces some of the need for comprehensive end-to-end tests.

**How to start**

- Identify consumers and providers: Start small, focusing on one provider at a time.
- Define the contract: Establish clear expectations between consumer and provider.
- Write tests: Implement basic consumer and provider contract tests.
- Integrate into CI/CD: Add tests to pipelines and continuously improve the process.

**Vocabulary:**

- **Consumer:** The service user that makes requests to another service, driving the contract in CDCT.
- **Provider:** The service that responds to the consumer's requests, verifying the contract against its implementation.
- **Contract:** A JSON object detailing the interactions between the consumer and provider, including request details and expected responses.
- **Contract Broker:** A central location for storing and managing contracts, facilitating communication between consumers and providers.

**Consumer Driven Contract Testing Lifecycle (CDCT):**

- generating a contract from the consumer's test code
- publishing it to a broker
- having the provider pull, verify, and update the contract’s status
- Both sides then check the verification status before deploying changes (can-i-deploy).

**Contract Testing Approaches:**

- **Consumer-Driven Contract Testing (CDCT):** Focuses on the consumer creating the contract, ideal for greenfield projects and organizations committed to contract testing.
- **Provider-Driven Contract Testing (PDCT):** Uses existing OpenAPI specifications of the provider and executes the consumer tests against that, instead of the traditional provider side test execution (of the contract) against the locally served provider service.

**Communication Types Supported:**

- **GraphQL:** Supported through a specific wrapper in Pact, allowing flexible data requests.
- **Event-Driven Systems:** Supported by abstracting the message body from the messaging technology, enabling contract testing in systems using asynchronous messaging.

## Consumer side

The consumer can be any client that makes API calls. Can be an API service, can be a web app (using Axios for example); it does not make a difference.

- **Focus:** Consumer contract tests should focus solely on ensuring that the consumer’s expectations match the provider’s responses, without delving into the provider’s internal functionality.
- **Loose Matchers:** Use loose matchers to avoid high coupling, allowing flexible assertions.
- **Isolated Tests:** stateless, order independent.
- **Using can-i-deploy:** The can-i-deploy tool in Pact helps verify whether changes are safe to deploy, ensuring that the provider has successfully verified the contract before deployment.

Here is how it works:

1. Write the consumer test.

2. Execute the and generate a contract / pact / json file.

   The contract specifies how the provider should respond upon receiving requests from the consumer.

3. Once the contract is created, from then on the Pact `mockProvider` takes over as if we are locally serving the provider API and executing the tests against that.
   That means, there is no need to serve the client api or the provider api at the moment, the consumer tests and `mockProvider` cover that interaction.

4. The consumer test can only fail at the `executeTest` portion, if / when the assertions do not match the specifications. Any changes to the `provider` section makes updates to the contract.

Here's how a test generally looks:

```js
// ...provider setup prior...

it('...', () => {
  provider
    // specifications about how the provider
    // should behave upon receving requests
    // this part is what really configures the contract

  await provider.executeTest(async(mockProvider) => {

    // assertions against the mockProvider/contract
  })
})
```

Run the consumer tests:

```bash
npm run test:consumer
```

The pact gets recorded, the consumer tests (`executeTest`) are verified against the contract.

Now, for the provider to know about it all, we need to publish the contract

Publish the contract to your Pact Broker:

```bash
npm run publish:pact
```

The consumer side uses a mock provider. The specifics of the mock provider are defined in the it blocks.

> What is the difference? TL, DR; a mock is a smarter stub.
>
> **Stub:** Provides a simple, fixed response based on a predefined script. It doesn’t validate how it's used.
>
> **Mock:** More advanced than a stub; it imitates a real object’s behavior and validates interactions, such as method calls and arguments, making it more suitable for scenarios like contract testing.
>
> ```typescript
> // Define the ApiClient interface
> interface ApiClient {
>   fetchUser(userId: number): { id: number; name: string } | null;
> }
> 
> // The UserService depends on the ApiClient to fetch user data
> class UserService {
>   private apiClient: ApiClient;
> 
>   constructor(apiClient: ApiClient) {
>     this.apiClient = apiClient;
>   }
> 
>   getUser(userId: number): { id: number; name: string } | null {
>     return this.apiClient.fetchUser(userId);
>   }
> }
> 
> ////// STUB
> const apiClientStub: ApiClient = {
>   fetchUser: (userId: number) => {
>     return { id: userId, name: 'John Doe' }; // Predetermined response
>   },
> };
> 
> // same in both 
> const userService = new UserService(apiClientStub);
> const user = userService.getUser(1);
> console.log(user); // { id: 1, name: 'John Doe' }
> 
> /////// MOCK
> const apiClientMock: ApiClient = {
>   fetchUser: jest.fn((userId: number) => {
>     if (userId === 1) {
>       return { id: 1, name: 'John Doe' };
>     }
>     return null;
>   }),
> };
> 
> // same in both 
> const userService = new UserService(apiClientMock);
> const user = userService.getUser(1);
> console.log(user); // { id: 1, name: 'John Doe' }
> // KEY: verify that fetchUser was called with the correct argument
> expect(apiClientMock.fetchUser).toHaveBeenCalledWith(1);
> ```
>

## Provider side

The main goal is to verify that the provider API can fulfill the contract expectations defined by the consumer(s). This ensures that any changes made to the provider won't break existing consumer integrations.

Here is how it works

1. The consumer already generated the contract and published it.
2. The provider has one test per consumer to ensure all is satisfactory. Most of the file is about setting up the options.
3. We ensure that the provider api is running locally.
4. The consumer tests execute against the provider api, as if they are a regular API client running locally.

Here is how the test generally looks:

```js
const options = {..} // most the work is here (ex: provider states)
const verifier = new Verifier(options)

it('should validate the expectations..', () => {
  return verifier.verifyProvider().then((output) => {
    console.log('Pact Verification Complete!')
    console.log('Result:', output)
  })
})
```

The provider API has to be running locally for the provider tests to be executed. Then we can execute the provider test.

```bash
npm run start:provider

# another tab

npm run test:provider
```

**Provider States**:  We can simulate certain states of the api (like an empty or non-empty db) in order to cover different scenarios

- Provider states help maintain the correct data setup before verification.
- State handlers must match the provider states defined in consumer tests.

**Can-I-Deploy Tool**: Before deploying to an environment, we verify if the consumer and provider versions are compatible using the `can-i-deploy` tool. This step ensures that any changes made to the consumer or provider do not break existing integrations across environments.

Verify the provider:

```bash
npm run can:i:deploy:provider
```

Verify the consumer:

```bash
npm run can:i:deploy:consumer
```

## The Pact Broker

Why do we need a pact broker?

1. Sharing contracts: it is what binds the repositories together, without needing a common deployment.
2. Coordination: it can coordinate contracts and releases between branches, environments and teams.
3. CI: the pact broker provides a CLI which offers easy access to provider verification status and webhooks to trigger dependent CI pipelines.

Pact broker flow:

1. The Consumer pushes the consumer contracts to the Pact broker.
2. The provider pulls the contracts from the Pact broker.
3. The provider publishes the verification status of the contract to the Pact broker.
4. The consumer & the provider pull the verification status from the Pact broker to check if they can deploy their service/app.

### Example new release scenario:

Imagine you have a **Movies API** that serves different clients, such as a web application and a mobile app. These clients are at different stages of development and are deployed in different environments (e.g., Staging and Production).

#### Environments:

- **Staging Environment:** Running version **v1.2.0** of the Movies API.
- **Production Environment:** Running version **v1.1.0** of the Movies API.

#### Pact Broker's Role:

- A new version of the API, **v2.0.1**, has been developed to fix some bugs.
- Before this version can be deployed, the Pact Broker checks it against the existing consumer contracts (which specify how clients interact with the API) to ensure it won't break any current implementations.
- The Pact Broker verifies the contract against **v1.2.0** in the Staging environment and **v1.1.0** in the Production environment.
- The checkmarks indicate that both environments successfully verified the new contract, meaning **v2.0.1** can be safely integrated into either environment.

### **SaaS (PactFlow) vs. Self-Hosted Pact Broker**

**SaaS (PactFlow) Solution:**
- **Cost:** SaaS cost, but no setup or maintenance effort.
- **Maintenance:** none.
- **Features:** Offers advanced features like **Can I Deploy**, **API token-based security**, and support for **Provider driven contracts** (e.g., OpenAPI).
- **Ease of Use:** Easy to set up, with a user-friendly interface and seamless third-party integrations.
- **Support:** Dedicated support from the PactFlow team.

**Self-Hosted Pact Broker:**
- **Cost:** Lower running costs, but requires infrastructure setup and residual maintenance.
- **Maintenance:** Requires ongoing management of security patches and updates.
- **Features:** Provides core functionality with basic **username/password security**.
- **Setup Complexity:** More complex setup, especially when using Docker or Kubernetes.
- **Support:** Relies on community support, which may be less consistent.

## PactBroker CI/CD & key features

**Environment Variables:** Why `GITHUB_SHA` and `GITHUB_BRANCH`?

- **`GITHUB_SHA`**: This variable represents the unique commit ID (SHA) in Git. By using the commit ID as the version identifier when publishing the contract or running tests, you can precisely trace which version of your code generated a specific contract. This traceability is crucial in understanding which code changes correspond to which contract versions, allowing teams to pinpoint when and where an issue was introduced.

- **`GITHUB_BRANCH`**: Including the branch name ensures that contracts and deployments are correctly associated with their respective branches, supporting scenarios where different branches represent different environments or features under development. It helps prevent conflicts or mismatches in contracts when multiple teams or features are being developed simultaneously.

  TL,DR; best practice, do it this way.

On the provider side Pact verifies all the relevant versions that are compatible:

```js
// provider spec file

const options = {
  // ...
  providerVersion: process.env.GITHUB_SHA,
  providerVersionBranch: process.env.GITHUB_BRANCH, // represents which contracts the provider should verify against
  consumerVersionSelectors = [
      { mainBranch: true },  // tests against consumer's main branch
      { matchingBranch: true }, // tests against consumer's currently deployed and currently released versions
      { deployedOrReleased: true } // Used for coordinated development between consumer and provider teams using matching feature branch names
    ]
}
```

###  The matrix:

The Pact Matrix is a feature within Pactflow (or other Pact brokers) that visualizes the relationships between consumer and provider versions and their verification status across different environments. The matrix shows:

- Which versions of consumers are compatible with which versions of providers.
- The verification results of these interactions across various environments (e.g., dev, stage, prod).

By using `GITHUB_SHA` and `GITHUB_BRANCH` in your CI/CD workflows, you ensure that the matrix accurately reflects the state of your contracts and their verifications. This makes it easier to determine if a particular consumer or provider version is safe to deploy in a specific environment, ultimately enabling seamless integration and deployment processes.

Example matrix:

| **Consumer Version (SHA)** | **Provider Version (SHA)** | **Branch**  | **Environment** | **Verification Status** | **Comments**                                                 |
| -------------------------- | -------------------------- | ----------- | --------------- | ----------------------- | ------------------------------------------------------------ |
| `abc123`                   | `xyz789`                   | `main`      | `production`    | Passed                  | The consumer and provider are both verified and deployed in production. |
| `def456`                   | `xyz789`                   | `main`      | `staging`       | Passed                  | The same provider version is compatible with a newer consumer version in staging. |
| `ghi789`                   | `xyz789`                   | `feature-x` | `development`   | Failed                  | The consumer from a feature branch failed verification with the provider in the development environment. |
| `jkl012`                   | `uvw345`                   | `main`      | `production`    | Pending                 | A new provider version is pending verification against the consumer in production. |

### **can-i-deploy**

The `can-i-deploy` tool queries the Pact Broker to ensure that the consumer and provider versions are compatible before deployment. This tool provides an extra layer of safety, preventing the deployment of incompatible versions.on.

### **Webhooks:**

Recall the consumer and provider flow.

The key is that, when there are multiple repos, the provider has to run `test:provider` `(#3)` after the consumer runs `publish:pact` `(#2)` but before the consumer can run `can:i:deploy:consumer` `(#4)` . The trigger to run `test:provider` `(#3)` has to happen automatically, webhooks handle this.

```bash
# Consumer
npm run test:consumer # (1)
npm run publish:pact  # (2)
npm run can:i:deploy:consumer # (4)
# only on main
npm run record:consumer:deployment # (5)

# Provider
npm run test:provider # (3) triggered by webhooks
npm run can:i:deploy:provider # (4)
# only on main
npm run record:consumer:deployment # (5)
```

## Provider-driven (bi-directional) contract testing

Consumer-Driven Contract Testing is highly effective when the consumer has a close relationship with the provider, typically within the same organization. However, when dealing with third-party providers, especially those who might not be aware of or prioritize the specific needs of any single consumer, this approach becomes unfeasible. It might also happen that the provider is not testable locally, which makes running the tests from the consumer impossible on the provider side.

**Provider-Driven Contract Testing** makes more sense in these situations. The provider defines the contract (OpenAPI specification), and it’s up to the consumers to align with this specification. This shifts the responsibility to the consumer to ensure that they are compatible with the provider’s API, rather than the other way around.

The flow:

1. The provider uploads their OpenAPI specification to PactFlow.
2. The consumer uploads their contract, generated by their consumer-driven contract tests (CDCT).
3. PactFlow cross-validates the contracts to ensure compatibility between the provider's capabilities and the consumer's expectations.
4. Both the provider and the consumer use the `can-i-deploy` tool to verify whether it's safe to deploy their changes.

The key difference in this approach is that instead of the provider running the contract tests / verifying the contract on their end, they upload their OpenAPI specification to PactFlow. PactFlow then takes care of the verification by comparing the consumer's expectations with the provider's actual capabilities. When working with a 3rd party, the teams can upload a copy of their OpenAPI to PactFlow, and verify their contract testing.

**Caveat**: **Risk of False Confidence**: Since the testing is based on the OpenAPI spec of the provider rather than the actually running the consumer tests (the contract) on the provider side, there's a risk that the contract might not fully capture the nuances of the provider's implementation. This could lead to scenarios where a contract is deemed compatible even though the actual service could fail in production. This risk emphasizes the importance of maintaining up-to-date and accurate contracts.

(This gap could be addressed with [generating OpenAPI docs from types](https://dev.to/muratkeremozcan/automating-api-documentation-a-journey-from-typescript-to-openapi-and-schema-governence-with-optic-ge4), or Zod-to-openapi (`@asteasolutions/zod-to-openapi`) or generating OpenAPI spec from e2e (an Optic feature)). We can also test the schema via a Cypress plugin `cypress-ajv-schema-validator` chaining on to already existing api calls.

With bi-directional contract testing, the consumer and the provider workflows are detached; the provider independently publishes their OpenAPI spec (to main) and the consumer tests against it.

Here is how it goes:

1) **Generate the OpeAPI spec at the provider**

   Automate this step using tools like `zod-to-openapi`,  `swagger-jsdoc`,  [generating OpenAPI documentation directly from TypeScript types, or generating the OpenAPI spec from e2e tests (using Optic)](https://dev.to/muratkeremozcan/automating-api-documentation-a-journey-from-typescript-to-openapi-and-schema-governence-with-optic-ge4). Manual spec writing is the last resort..

2) **Ensure that the spec matches the real API**

   `cypress-ajv-schema-validator`: if you already have cy e2e and you want to easily chain on to the existing calls.

   Optic: lint the schema and/or run the e2e suite against the OpenAPI spec through the Optic proxy.

   Dredd: executes its own tests (magic!) against your openapi spec (eeds your local server, has hooks for things like auth.)

3) **Publish the OpenAPI spec to the pact broker**.

   ```bash
   pactflow publish-provider-contract 
     src/api-docs/openapi.json # path to OpenAPI spec
     # if you also have classic CDCT in the same provider, 
     # make sure to label the Bi-directional provider name differently
     --provider MoviesAPI-bi-directional 
     --provider-app-version=$GITHUB_SHA # best practice
     --branch=$GITHUB_BRANCH # best practice
     --content-type application/json # yml ok too if you prefer
     --verification-exit-code=0 # needs it
      # can be anything, we just generate a file on e2e success to make Pact happy
     --verification-results ./cypress/verification-result.txt
     --verification-results-content-type text/plain # can be anything
     --verifier cypress # can be anything
   ```

   Note that verification arguments are optional, and without them you get a warning at Pact broker that the OpenAPI spec is untested.

4) **Execute the consumer contract tests**

As you can notice, there is nothing about running the consumer tests on the provider side ( `test:provider`), can-i-deploy checks (`can:i:deploy:provider`), or recording the pact deployment (`record:provider:deployment`).

### Cypress adapter in a nutshell

**UI Tests**: You have your regular Cypress UI tests where you test the behavior of your application.

**Stubbing the Network**: You use `cy.intercept` to stub network requests. This allows you to mock responses from APIs, ensuring that your UI tests are consistent and isolated from backend fluctuations.

**Generating a Pact Contract**: When you use the `cy.setupPact` command in conjunction with `cy.intercept`, during the test execution, the Cypress Pact adapter generates a Pact contract. This contract captures the expectations set by the stubbed network requests.

**CDCT-Like Use**: The generated contract can be used in a similar fashion to a Consumer-Driven Contract Testing (CDCT) setup. You can publish this contract to a Pact Broker and have your provider verify it, ensuring that the provider meets the consumer's expectations.
`"bi:consumer:cy:publish": "pact-broker publish ./cypress/pacts --consumer-app-version=$GITHUB_SHA --branch=$GITHUB_BRANCH --broker-base-url=$PACT_BROKER_BASE_URL --broker-token=$PACT_BROKER_TOKEN",`

## CDCT vs e2e vs integration vs schema testing

### Testing Lambda Handlers (Unit or Integration Tests)

- **Fast Feedback Loop**:
  - **Quick Iterations**: Enables rapid feedback through tests directly on the Lambda handler.
  - **Easier Debugging**: Isolates the Lambda function, simplifying the debugging process.
- **Partial Coverage**:
  - **Integration Points**: Can test Lambda interactions with services like DynamoDB Local, KMS, Kafka, etc., within a Docker environment. (This is the distinction between unit and integration.)
  - **Error Simulation**: Allows for controlled simulations of various edge cases and failure conditions.
- **Drawbacks**:
  - **Less Realistic**: Does not test the entire request-response lifecycle, potentially missing configuration or integration issues outside the Lambda function.
  - **Requires Mocks for Some Scenarios**: Dependency isolation may necessitate mocks, which could lead to false positives.
  - **Other**: Lacks testing for build & configuration, deployments, IAM, or interactions with external services.

### Testing Deployments via HTTP (Temporary Stack, Dev, Stage)

- **Build & Configuration**: Validates that all cloud resources, including CDK/Serverless Framework / infra as code, environment variables, secrets, and services (API Gateway, Lambda, S3), are correctly operational.
- **IAM Permissions**: Ensures that the IAM roles and permissions are correctly configured.
- **Comprehensive Coverage**: Tests the entire system, including authentication mechanisms and integrations with other services.
- **Drawbacks**:
  - Requires deployment, which adds complexity.
  - Results in a slower feedback loop due to the deployment process.

### Testing Local Endpoints via HTTP (Local)

- **Consistency**: Same tests can be run locally as in deployment environments, offering low-cost testing.
- **Ease of Implementation**: Simple to test API interactions before development using tools like REST clients or Postman.
- **Network Mocking**: Easy to configure network mocks with tools like Mockoon, without code changes.
- **No Deployment Drawbacks**: Avoids deployment, providing fast feedback.
- **Caveats**: Lacks testing for build & configuration, deployments, IAM, or interactions with external services.

### CDCT (Contract-Driven Contract Testing)

- **External Service Interaction Coverage**: Addresses a major drawback of local testing by ensuring compatibility with external services.
- **Fast Feedback**: Similar to local testing, CDCT avoids deployment and provides rapid feedback.
- **Caveats**: Does not cover build & configuration, deployments, IAM, or full end-to-end interactions.

### What kind of e2e testing would you replace with contract testing?

- **Replicate what contract tests cover or are overly simple**: If an e2e test simply checks basic API functionality—like whether an API responds with the correct status code or data structure—and this is already thoroughly covered by a contract test, the e2e test may be redundant. This is especially true if the e2e test doesn't involve multi-step interactions, such as getting a response and then performing additional actions based on that response. In such cases, contract tests might provide the necessary coverage, making the e2e test unnecessary.
- **Have low value for effort**: Tests that are complex to maintain but provide little value, such as those that test non-critical paths or scenarios unlikely to change, could be candidates for removal.
- **Streamline Redundant Coverage for build, config, deployment, IAM etc.**: If your contract tests are comprehensive and your existing e2e tests already cover key build & configuration, deployment, infrastructure, and IAM, you consider trimming or removing overlapping e2e tests.
- **Optimize Deployment Strategy**: You can consider skipping temporary stacks or ephemeral environments on PRs and instead focus on deployment testing in the dev environment. This strategy can save costs associated with deployments from scratch. However, be mindful that this may delay the discovery of issues related to build & configuration, deployment, or IAM until later stages. It's a tradeoff between cost efficiency and early detection.
- **Minimize the need for synchronized service versions covered bye 2e**: In traditional testing setups, you might rely on running e2e tests across multiple services in later environments like dev or staging to ensure that changes to Service A don't break Services B, C; deploy A (run e2e for A), but also run e2e for B & C although they didn't deploy. With contract tests, this need is significantly reduced, as they ensure compatibility between services at the contract level. 

### How does CDCT fit with schema testing (Optic)?

There is a potential gap in Provider-Driven Contract Testing where the OpenAPI spec provided by the API might not accurately reflect the current implementation of the code. This gap can be mitigated by [generating OpenAPI documentation directly from TypeScript types, or generating the OpenAPI spec from e2e tests (using Optic)](https://dev.to/muratkeremozcan/automating-api-documentation-a-journey-from-typescript-to-openapi-and-schema-governence-with-optic-ge4), ensuring that the specification remains in sync with the actual codebase.

Optic offers a low-cost, quick solution for schema validation by focusing solely on the OpenAPI specification, catching discrepancies early in the development process. On the other hand, Provider-Driven Contract Testing with Pact validates the interactions between consumers and the provider's OpenAPI spec, ensuring that the API's behavior aligns with consumer expectations.

By combining Optic for upfront schema validation and Pact for deeper contract verification, you can achieve a more comprehensive approach to API testing.

## Message Queue testing

The distinction between what you're doing in your sample consumer and provider repositories (which involve standard HTTP interactions) and what Pact refers to with **Message Queues** revolves around different forms of communication.

### Standard Pact (HTTP Requests)
Until now:
- **Consumer**: A service that makes HTTP requests to the provider and verifies that the provider returns the expected responses (contracts for APIs).
- **Provider**: The service that receives HTTP requests and responds with the appropriate data.
  

This works well for HTTP APIs where the consumer and provider interact directly via HTTP request-response cycles.

### Message Queues in Pact
Message-based testing, like the one described in the [Pact documentation on message queues](https://docs.pact.io/implementation_guides/javascript/docs/messages), is meant for systems that communicate asynchronously using **message queues** instead of direct HTTP requests. Examples of message-based systems include RabbitMQ, Kafka, or AWS SQS.

Here’s the difference:

1. **Consumer-Driven Contract Testing (Standard Pact)**:
   - Focuses on direct HTTP requests (e.g., REST API).
   - The consumer sends a request and expects the provider to respond directly.
   - The contract defines these interactions (e.g., "When I make a GET request to `/movies`, I expect a response with a list of movies").

2. **Message Queue Testing (Pact with Messaging)**:
   - Instead of HTTP requests, services exchange messages via a message queue (asynchronous).
   - **Consumer** in this context is the service **consuming messages from a queue** (not making requests to the provider).
   - **Provider** is the service **publishing messages to the queue**.
   - The contract defines what messages the provider is expected to send or receive, but there is no direct request-response. It’s about verifying the structure and content of the messages flowing through the queue.
   - Example: Instead of sending a request to get data, the consumer might subscribe to a message topic or queue, and the provider sends messages through that queue.

### Purpose of Message Queue Testing
You care about message queues when:
- **Asynchronous Communication**: The consumer and provider don’t talk directly through HTTP requests but communicate through a third party (e.g., RabbitMQ or Kafka).
- **Event-Driven Architecture**: Systems using event-driven patterns often use queues. The provider might broadcast events like “Order Placed” or “Movie Created,” and the consumer listens for those events.
- **Ensuring Decoupled Communication**: Just as with direct HTTP contract testing, message queue testing ensures that the consumer and provider agree on the format and content of messages exchanged, even though they’re not communicating synchronously.

### Why You Might Not Have Considered It Yet
If your current application uses synchronous HTTP APIs, you don’t need message queue testing because you are testing direct request-response interactions. Message queues come into play when the architecture relies on asynchronous messaging systems (e.g., microservices communicating through a message bus).

### Example Scenario:
Imagine a system where:
- **Provider** (e.g., a payment service) doesn’t respond to HTTP requests directly but publishes a message to a queue saying, “Payment Processed.”
- **Consumer** (e.g., an order system) listens to this queue for a message saying, “Payment Processed,” and takes action when it receives that message.

In this case, you'd want to test that:
1. The **provider** correctly publishes the "Payment Processed" message in the right format.
2. The **consumer** knows how to handle that message and react accordingly.

This is where Pact’s message testing comes in handy.

### Key Takeaway:
- **Standard Pact** is for request-response contracts (HTTP APIs).
- **Pact Message Queues** are for asynchronous messaging systems where the contract verifies messages sent or received through a queue (e.g., event-driven systems).

If your system only uses direct HTTP interactions, message queue testing might not be relevant to you. However, it becomes critical in systems that rely on event-based communication or decoupled microservices using message brokers.

## Breaking changes

You have really have 2 good options, and an additional workaround.

**Coordinating Matching PRs:** When a breaking change is needed, both teams (provider and consumer) collaborate in tandem. They create matching feature branches or PRs, ensuring that the consumer can adopt the new changes as the provider introduces them. This prevents downtime or breaking of functionality and ensures that both services are always compatible.

**Backward Compatibility:** If synchronizing changes isn't feasible, the provider introduces a backward-compatible update that supports both the old and the new versions of the contract. This allows the consumer to gradually adopt the new behavior while the old functionality is deprecated over time. Once the consumer has fully migrated to the new behavior, the old behavior can safely be removed.

### Real-World Scenario:

- **Coordinated matching PRs (preferred)**: If both consumer and provider teams communicate and align changes in their respective services, this should be your go-to approach. It's clean, avoids breaking things, and is more controlled.
- **Backward compatibility (fallback)**: If immediate synchronization isn't possible, backward compatibility ensures the system continues to function as expected until the consumer adopts the new features.
- **Pending pacts (safety net)**: This is more of a failsafe that might protect you in a more chaotic development environment or when there's an unexpected lack of coordination. It's there to prevent unnecessary test failures if a consumer inadvertently introduces a breaking change without proper alignment. It essentially provides a "grace period" to allow providers time to adapt without blocking deployment, particularly useful in larger, less-coordinated teams or projects with complex dependencies.





---

### Breaking Changes

You have really two good options, and additional workarounds, depending on the coordination and maturity of your teams.

**Coordinating Matching PRs:** When a breaking change is needed, both teams (provider and consumer) collaborate in tandem. They create matching feature branches or PRs, ensuring that the consumer can adopt the new changes as the provider introduces them. This prevents downtime or breaking of functionality and ensures that both services are always compatible.

**Backward Compatibility:** If synchronizing changes isn't feasible, the provider introduces a backward-compatible update that supports both the old and the new versions of the contract. This allows the consumer to gradually adopt the new behavior while the old functionality is deprecated over time. Once the consumer has fully migrated to the new behavior, the old behavior can safely be removed.

#### Real-World Scenarios

- **Coordinated matching PRs (preferred)**: If both consumer and provider teams communicate and align changes in their respective services, this should be your go-to approach. It's clean, avoids breaking things, and is more controlled.
  
- **Backward compatibility (fallback)**: If immediate synchronization isn't possible, backward compatibility ensures the system continues to function as expected until the consumer adopts the new features.

#### Workarounds (to blasphemy)

- **Pending pacts (safety net)** `enablePending`:  It's there to prevent unnecessary test failures if a consumer inadvertently introduces a breaking change without proper alignment. It essentially provides a "grace period" to allow providers time to adapt without blocking deployment, particularly useful in larger, less-coordinated teams or projects with complex dependencies.

- **WIP pacts (experimental features)** `includeWipPactsSince` : WIP pacts come into play when consumers are working on experimental or long-running feature branches that haven't yet been finalized. WIP pacts give providers a heads-up that the consumer is working on something new, but **won't block the provider's build if they don't support it yet**. Think of it as a way to handle feature branches that are in progress but haven’t been fully integrated. This is useful when teams are working on new features in parallel but aren't ready to fully verify everything against the provider yet. The provider can continue working without failing for pacts that aren't fully baked. It gets removed before the merge to main.

##### Pending vs. WIP Pacts 

- **Pending Pacts** are for **unexpected or uncoordinated breaking changes**. They provide a temporary buffer where the provider tests won’t fail immediately if a consumer introduces breaking changes, allowing the provider time to catch up.

- **WIP Pacts** are for **work-in-progress or experimental features** in long-running feature branches. The provider acknowledges that the consumer is working on something but doesn’t yet block the provider from progressing with their build if those changes aren’t supported yet.

Both are "workarounds" but solve slightly different problems in chaotic or asynchronous environments. In well-coordinated environments, you should not need either of these.
