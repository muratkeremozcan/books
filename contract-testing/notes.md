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

## Ch 10 CI setup

To make the flow work when separating the consumer and provider into different repositories, the integration between them primarily hinges on the use of Pact Broker and webhooks. Here's how the process works:

### Workflow Overview:
1. **Consumer Repository:**
   - The consumer runs its contract tests, generates a pact file, and publishes it to the Pact Broker.
   - After publishing, the Pact Broker triggers a webhook that notifies the provider repository that a new or updated pact has been published and requires verification.

2. **Provider Repository:**
   - The provider repository, upon receiving the webhook trigger, runs the provider verification tests against the newly published pact.
   - If the tests pass, the provider publishes the verification results back to the Pact Broker.
   - This process ensures that both the consumer and provider are in sync, and the contracts are verified automatically whenever there are changes.

### Key Features:
- **Webhooks:** Webhooks are essential in this setup to automatically trigger the provider verification tests when the consumer publishes a new pact.
- **Can-I-Deploy:** Before deploying any changes to production, the `can-i-deploy` tool checks the matrix in the Pact Broker to ensure that the consumer and provider versions are compatible and successfully verified. This step is crucial to prevent deploying incompatible versions.

### Summary:
- **Consumer Workflow:** Generates pacts and publishes them to the Pact Broker.
- **Pact Broker:** Acts as the intermediary, holding contracts and managing verification statuses. It triggers provider tests via webhooks.
- **Provider Workflow:** Runs verification tests based on triggers from the Pact Broker and reports results back.
- **Can-I-Deploy:** Ensures that only verified and compatible versions are deployed to production environments.

This setup facilitates continuous contract verification and automated deployments, ensuring that both the consumer and provider are aligned with each other throughout the development lifecycle.
