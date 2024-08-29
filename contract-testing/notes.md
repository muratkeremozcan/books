## Chapter 1: Introduction to Contract Testing

**Introduction to Contract Testing:**

- Contract testing ensures that two systems (e.g., a web application and an API, or 2 APIs) have a shared understanding of expectations, verified through a "contract" (usually a json file).
- It's particularly useful in microservices architectures.

**How Contract Testing Works:**
- A contract is essentially a JSON file capturing interactions between two systems.
- The consumer (e.g., a web application) defines the expected interactions and stores them in a contract.
- The provider (e.g., an API) verifies that it can meet these expectations by running tests against the contract.
- Both systems use this contract to ensure compatibility, even as they evolve independently.

  

  **High-Level Process:**

  - **Consumer Side:** The consumer creates and tests against a mock provider, generating a contract.
  - **Provider Side:** The provider verifies the contract against its actual implementation.
  - Both sides interact through this contract, ensuring compatibility before deploying changes.

**Why Contract Testing Matters:**
- Prevents breaking changes by catching issues early in the development cycle.
- Enables teams to deploy changes independently and with confidence.
- Reduces some of the need for comprehensive end-to-end tests.
- Facilitates faster feedback loops and easier debugging.

**When to Use Contract Testing:**
- Best suited for testing integration points between connected systems, especially in microservices.
- Not appropriate for testing business logic, UI components, performance, security, or when working with third-party/public APIs without control over their pipelines.

## Chapter 2: How Contract Testing Fits into Wider Testing Concepts

Contract testing is a valuable addition to a testing strategy but requires a collaborative effort and technical understanding. It doesn’t replace other forms of testing but enhances them by catching issues early in the development cycle. Implementing contract testing should be approached incrementally, with careful planning and continuous improvement

**Key Points:**

1. **Test Automation Pyramid:**
   - Contract testing fits between unit and integration tests, providing high confidence without requiring integrated environments.
2. **Benefits of Contract Testing:**
   - Cost savings: Detects bugs early, reducing time and resources spent on debugging.
   - Quality improvement: Catches misunderstandings between systems before they impact end-users.
   - Team collaboration: Enhances communication between teams, ensuring shared understanding of requirements.
3. **Challenges of Contract Testing:**
   - Takes time: Initial setup is complex and time-consuming.
   - Requires mindset shift: Encourages collaboration and a test-driven approach.
   - Needs buy-in: Success depends on collaboration across teams.
   - Technically demanding: Involves advanced concepts not usually required in other tests.
   - Difficult with external teams: More challenging when dealing with third-party or external services.
4. **Practical Guide to Implementation:**
   - Research tools: Choose tools that fit your specific context.
   - Identify consumers and providers: Start small, focusing on one provider at a time.
   - Define the contract: Establish clear expectations between consumer and provider.
   - Write tests: Implement basic consumer and provider contract tests.
   - Integrate into CI/CD: Add tests to pipelines and continuously improve the process.

## Chapter 3: A Technical Overview of Contract Testing

This chapter provides a deep dive into the core concepts, tools, and approaches associated with contract testing. It introduces key terms like consumers, providers, contracts, and contract brokers, and explains the lifecycle of contract testing, particularly focusing on the consumer-driven contract testing (CDCT) approach.

**Key Points:**

1. **Core Concepts:**

   - **Consumer:** The service user that makes requests to another service, driving the contract in CDCT.
   - **Provider:** The service that responds to the consumer's requests, verifying the contract against its implementation.
   - **Contract:** A JSON object detailing the interactions between the consumer and provider, including request details and expected responses.
   - **Contract Broker:** A central location for storing and managing contracts, facilitating communication between consumers and providers.

2. **Consumer Driven Contract Testing Lifecycle (CDCT):**

   The lifecycle involves:

   - generating a contract from the consumer's test code
   - publishing it to a broker
   - having the provider pull, verify, and update the contract’s status
   - The consumer then checks the verification status before deploying changes.

3. **Contract Testing Approaches:**
   - **Consumer-Driven Contract Testing (CDCT):** Focuses on the consumer creating the contract, ideal for greenfield projects and organizations committed to contract testing.
   - **Provider-Driven Contract Testing (PDCT):** Uses existing OpenAPI specifications and integrates consumer mocks into the testing process, better suited for legacy systems and teams new to contract testing.

4. **Communication Types Supported:**
   - **GraphQL:** Supported through a specific wrapper in Pact, allowing flexible data requests.
   - **Event-Driven Systems:** Supported by abstracting the message body from the messaging technology, enabling contract testing in systems using asynchronous messaging.

## Chapter 4: Implementing Consumer-Driven Contract Testing for Web Applications

Guidelines for Writing Consumer Contract Tests:

- **Focus:** Consumer contract tests should focus solely on ensuring that the consumer’s expectations match the provider’s responses, without delving into the provider’s internal functionality.
- **Loose Matchers:** Use loose matchers to avoid high coupling, allowing flexibility in the data returned by the provider and reducing the risk of flaky tests.
- **Isolated Tests:** Contract tests should be isolated, meaning they don’t depend on the outcomes of previous tests, to avoid brittleness.
- **Using can-i-deploy:** The can-i-deploy tool in Pact helps verify whether changes are safe to deploy, ensuring that the provider has successfully verified the contract before deployment.
- **Mocks vs. Stubs:** Mocks should be used instead of stubs to accurately validate the interactions between the consumer and provider, ensuring that the test fails if expectations aren’t met.

**Stub:** Provides a simple, fixed response based on a predefined script. It doesn’t validate how it's used.

**Mock:** More advanced than a stub; it imitates a real object’s behavior and validates interactions, such as method calls and arguments, making it more suitable for scenarios like contract testing.

```typescript
// Define the ApiClient interface
interface ApiClient {
  fetchUser(userId: number): { id: number; name: string } | null;
}

// The UserService depends on the ApiClient to fetch user data
class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  getUser(userId: number): { id: number; name: string } | null {
    return this.apiClient.fetchUser(userId);
  }
}

////// STUB
const apiClientStub: ApiClient = {
  fetchUser: (userId: number) => {
    return { id: userId, name: 'John Doe' }; // Predetermined response
  },
};

// same in both 
const userService = new UserService(apiClientStub);
const user = userService.getUser(1);
console.log(user); // { id: 1, name: 'John Doe' }

/////// MOCK
const apiClientMock: ApiClient = {
  fetchUser: jest.fn((userId: number) => {
    if (userId === 1) {
      return { id: 1, name: 'John Doe' };
    }
    return null;
  }),
};

// same in both 
const userService = new UserService(apiClientMock);
const user = userService.getUser(1);
console.log(user); // { id: 1, name: 'John Doe' }
// KEY: verify that fetchUser was called with the correct argument
expect(apiClientMock.fetchUser).toHaveBeenCalledWith(1);
```

### Writing the consumer contract test

- Setup the mock provider for the consumer
- Register the consumer's expectations against the (mock) provider
- Call the consumer against the mock provider
- Verify the consumer test and generate the contract

## Ch 6 Provider contract tests

- Importance of Provider Tests**:
  - Provider tests are crucial for verifying that the provider adheres to the consumer-generated contract.
  - While consumer teams do most of the work, provider tests are necessary to complete the contract testing lifecycle.
- **Guidelines for Provider Contract Tests**:
  - **Focus**: Provider tests should verify the relevant aspects of the contract, not test all business logic.
  - **Provider States**:  We can simulate certain states of the api (like an empty or non-empty db) in order to cover different scenarios
  - **Can-I-Deploy Tool**: Use this tool to verify that the provider changes can be safely deployed to production.
- **Provider State Handlers**:
  - Provider states help maintain the correct data setup before verification.
  - State handlers must match the provider states defined in consumer tests.
- **Running Provider Tests**:
  - Provider tests are executed to verify interactions and ensure the contract is fulfilled.
  - Results are published to a Pact broker for verification.

  - Proper versioning is recommended when making contract changes to avoid unreliable results.

## Ch9 Storing, hosting, and securing the contracts

Why do we need a pact broker:

1. Sharing contracts: it is what binds the repositories together, without needing a common deployment.
2. Coordination: it can coordinate contracts and releases between branches, environments and teams.
3. CI: the pact broker provides a CLI which offers easy access to provider verification status and webhooks to trigger dependent CI pipelines.

Pact broker flow:

1. The Consumer pushes the consumer contracts to the Pact broker.
2. The provider pulls the contracts from the Pact broker.
3. The provider publishes the verification status of the contract to the Pact broker.
4. The consumer pulls the verification status from the Pact broker to check if they can deploy their app.

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

## Chapter 10: Setting up Contract Testing in a CI/CD Pipeline

**Key Points:**

1. **Environment Variables:**
   - Use environment variables like `GITHUB_SHA` (Git commit ID) and `GITHUB_BRANCH` (branch name) to manage and trace contract versions automatically. These variables help identify which version of the code generated a specific contract and ensure that the correct contracts are verified in the CI/CD pipeline. In the optimal setup both the consumer and provider now contain the  `GITHUB_SHA`  as unique versions.

     ` --consumer-app-version=$GITHUB_SHA --branch=$GITHUB_BRANCH` 

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

     

2. **Advanced CI/CD Features:**
   - **Versioning and Branches:** Automate versioning using Git commit IDs and branches. Ensure that provider tests verify the correct contract versions, especially when working on feature branches.
   - **Environments:** Record the environment in which a version is deployed (e.g., dev, staging, production). This ensures that Pact knows where each version is active, aiding in the decision to deploy new changes.

3. **Can-I-Deploy Tool:**

   - The `can-i-deploy` tool queries the Pact Broker to ensure that the consumer and provider versions are compatible before deployment. This tool provides an extra layer of safety, preventing the deployment of incompatible versions.on.

4. **Webhooks:**

   - If the consumer and provider are in separate GitHub projects and separate workflows, when the consumer makes changes to the contract, the relevant provider verification job will not be triggered automatically, which can cause the consumer workflow to fail on the can-i-deploy job. This happens because Pact can’t “pre-verify” the contract since the contract has changed.
   -  We’d like the provider verification job to be triggered automatically when the consumer has changed something in the contract. We don’t need to rerun the entire provider pipeline; we want to run just the provider verification job and publish the results to our Pact Broker

## Ch 11 Implementing provider-driven (bi-directional) contract testing

Consumer-Driven Contract Testing is highly effective when the consumer has a close relationship with the provider, typically within the same organization. However, when dealing with third-party providers, especially those who might not be aware of or prioritize the specific needs of any single consumer, this approach becomes unfeasible.

**Unknown Consumers**: In some cases, a third-party provider may not even know who all of their consumers are. They provide a public API, and various clients may interact with it. In such scenarios, it’s impractical for the provider to tailor their API to specific consumer-driven contracts.

**Provider-Driven Contract Testing** makes more sense in these situations. The provider defines the contract (API specification), and it’s up to the consumers to align with this specification. This shifts the responsibility to the consumer to ensure that they are compatible with the provider’s API, rather than the other way around.

The flow:

1. The provider uploads their OpenAPI specification to PactFlow.
2. The consumer uploads their contract, generated by their consumer-driven contract tests (CDCT).
3. PactFlow cross-validates the contracts to ensure compatibility between the provider's capabilities and the consumer's expectations.
4. Both the provider and the consumer use the `can-i-deploy` tool to verify whether it's safe to deploy their changes.

The key difference in this approach is that instead of the provider running the contract tests / verifying the contract on their end, they upload their OpenAPI specification to PactFlow. PactFlow then takes care of the verification by comparing the consumer's expectations with the provider's actual capabilities. When working with a 3rd party, the teams can upload a copy of their OpenAPI to PactFlow, and verify their contract testing.

**Caveat**: **Risk of False Confidence**: Since the testing is based on the OpenAPI spec of the provider rather than the actually running the consumer tests (the contract) on the provider side, there's a risk that the contract might not fully capture the nuances of the provider's implementation. This could lead to scenarios where a contract is deemed compatible even though the actual service could fail in production. This risk emphasizes the importance of maintaining up-to-date and accurate contracts.

(This gap could be addressed with [generating OpenAPI docs from types](https://dev.to/muratkeremozcan/automating-api-documentation-a-journey-from-typescript-to-openapi-and-schema-governence-with-optic-ge4))

### Cypress adapter in a nutshell

**UI Tests**: You have your regular Cypress UI tests where you test the behavior of your application.

**Stubbing the Network**: You use `cy.intercept` to stub network requests. This allows you to mock responses from APIs, ensuring that your UI tests are consistent and isolated from backend fluctuations.

**Generating a Pact Contract**: When you use the `cy.setupPact` command in conjunction with `cy.intercept`, during the test execution, the Cypress Pact adapter generates a Pact contract. This contract captures the expectations set by the stubbed network requests.

**CDCT-Like Use**: The generated contract can be used in a similar fashion to a Consumer-Driven Contract Testing (CDCT) setup. You can publish this contract to a Pact Broker and have your provider verify it, ensuring that the provider meets the consumer's expectations.
`"bi:consumer:cy:publish": "pact-broker publish ./cypress/pacts --consumer-app-version=$GITHUB_SHA --branch=$GITHUB_BRANCH --broker-base-url=$PACT_BROKER_BASE_URL --broker-token=$PACT_BROKER_TOKEN",`

## Ch 12 CDCT vs e2e vs integration

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

- **Build & Configuration**: Validates that all cloud resources, including CDK/Serverless infra as code, environment variables, secrets, and services (API Gateway, Lambda, S3), are correctly operational.
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

- **External Service Interaction Coverage**: Addresses a major caveat of local testing by ensuring compatibility with external services.
- **Fast Feedback**: Similar to local testing, CDCT avoids deployment and provides rapid feedback.
- **Caveats**: Does not cover build & configuration, deployments, IAM, or full end-to-end interactions.

## What kind of e2e testing would you replace with contract testing?

- **Replicate what contract tests cover or are overly simple**: If an e2e test simply checks basic API functionality—like whether an API responds with the correct status code or data structure—and this is already thoroughly covered by a contract test, the e2e test may be redundant. This is especially true if the e2e test doesn't involve multi-step interactions, such as getting a response and then performing additional actions based on that response. In such cases, contract tests might provide the necessary coverage, making the e2e test unnecessary.
- **Have low value for effort**: Tests that are complex to maintain but provide little value, such as those that test non-critical paths or scenarios unlikely to change, could be candidates for removal.
- **Streamline Redundant Coverage for build, config, deployment, IAM etc.**: If your contract tests are comprehensive and your existing e2e tests already cover key build & configuration, deployment, infrastructure, and IAM, you consider trimming or removing overlapping e2e tests.
- **Optimize Deployment Strategy**: You can consider skipping temporary stacks or ephemeral environments for PRs and instead focus on deployment testing in the dev environment. This strategy can save costs associated with deployments from scratch. However, be mindful that this may delay the discovery of issues related to build & configuration, deployment, or IAM until later stages. It's a tradeoff between cost efficiency and early detection.
- **Minimize the need for synchronized service versions covered bye 2e**: In traditional testing setups, you might rely on running e2e tests across multiple services in later environments like dev or staging to ensure that changes to Service A don't break Services B, C; deploy A (run e2e for A), but also run e2e for BC. With contract tests, this need is significantly reduced, as they ensure compatibility between services at the contract level. 
