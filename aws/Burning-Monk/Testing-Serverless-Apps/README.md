## Ch01 how to test serverless architectures

### Unit vs Integration vs E2e

Unit: test your code at the object/module level

Integration: test your code against things you don't control (ex: external services)

E2e: test your whole system

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g767gk1dgmn9jjpwttev.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ymclm13w0eqylzurfrfc.png)

E2e still works for function-less approach.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tl0ocelqynxfhwx6lsx9.png)

### Hexagonal architecture

A pattern for creating loosely-coupled application components that can easily connect to their environment via **ports and adapters**.

The application stays the same, and the port + adapter changes per the external system.

Pro: Makes the application more testable, flexible and portable.

Con: the adaptors are abstractions, they take effort to create up front, and take effort to maintain when the core domain changes.

Great for complex domains, or projects with a lot of uncertainty and risk.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/89c8akilujv8hupu707w.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rf00qt857zn7xv40o9ig.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/219irxexxcpv0fn6l7ty.png)

Yan's day to day, simple version: Conversions inside the lambda without introducing ports & adapters. When interfacing with external systems, no ports & adapters either.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bc1qzhnwo6qjzamvxq5m.png)

### Get the best of local testing in the cloud

Mocks vs LocalStack vs real AWS resources.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tbifsvg78kqqo4cdstq6.png)

#### Mocks

If testing the business logic in isolation (unit test), use mocks . Example: cart has 4 items, add 2, should be 6.

Doesn't test integration points. Too many false positives, because they don't validate your assumptions.

```js
module.exports.handler = async (event) => {
  const cart = await DynamoDB.get(..).promise() // use mocks to control what's returned by DDB
  const newItem = JSON.parse(event.body)
  cart.add(newItem)

  await DynamoDB.put(..).promise() // use mocks to validate what's sent to DDB
  await EventBridge.putEvents(..).promise()

  return {statusCode: 204}
}
```

The above unit test would work, but would not work in integration, because DDB returns an object with both the Item and Consumed Capacity

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vdfacciwognm4o5q8w2q.png)

```js
module.exports.handler = async (event) => {
  const getResp = await DynamoDB.get(..).promise()
  const cart = getResp.Item // we have to extract the Item prop from the response
  const newItem = JSON.parse(event.body)
  cart.add(newItem)

  await DynamoDB.put(..).promise()
  await EventBridge.putEvents(..).promise()

  return {statusCode: 204}
}
```

#### LocalStack

Simulates many AWS services.

Features are always missing or lagging.

Cannot simulate IAM.

False negatives (simulation problems, behavior mismatch between simulator and the real service).

Brittle & hard to fix.

#### AWS resources `ch01-03-integration-testing`

Let the code talk to the real resources. Yan's preferred way.

Cons (these are covered by e2e):

- We cannot test if we have config issues, for example API gateway configuration (`events`)
- IAM permissions of the functions are not tested (`iamRoleStatements`).
- Must have temporary branches / ephemeral instances

```yaml
# serverless.yml

functions:
  addItem:
    handler: functions/add-item.handler
    environment:
      CARTS_TABLE: !Ref CartsTable
      EVENT_BUS_NAME: !Ref EventBus
    events:
      - http:
          path: /{userId}/items
          method: post
          request:
            schemas:
              application/json: ${file(schemas/add-item.json)}
    iamRoleStatements:
      - Effect: Allow
        Action:
          - dynamodb:GetItem
          - dynamodb:PutItem
        Resource: !GetAtt CartsTable.Arn
      - Effect: Allow
        Action: events:PutEvents
        Resource: !GetAtt EventBus.Arn
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/urron1n5i3r74msacykp.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0jdyjpjklc0nmpm63m7f.png)

### Troubleshooting e2e `ch01-04-e2e-troubleshoot`

**E2e is the perfect place for things to fail. If you can't debug failed e2e tests in a controlled environment, in production it will be more difficult.**

Observability: a measure of how well the internal state of an application can be inferred from its external outputs. Observability is as useful during development (ex: debugging failed e2e tests) as in production.

- Write structured (ie. JSON) logs

- Set up alerts for your applications.(Check out [Lambda Best Practices > Alerts](https://github.com/muratkeremozcan/books/blob/master/aws/Lambda-best-practices/Lambda%20best%20practices.md#observability))

### Temporary environments

A must have. Enables the entire test strategy.

- Isolate feature work
- Run integration & e2e
- No extra cost

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0pqqnw0i7wjail63nzux.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1dcajm623gl3kz8181tk.png)

## Ch02 Testing API Gateway

### Test strategy for API Gateway `ch02-test-api-gateway`

There are 2 integration targets for API gateway: a lambda or using direct service integrations to transport data. Use lambda to transform data, use service integrations to transport data.

Overall test strategy:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j95c4wu2j7py7769lcqb.png)

The return-on-investment of testing caching and resource policy is questionable.

For load testing, Serverless gives you a lot of scalability out of the box. But it's not free, and it's not infinitely scalable. You still have to worry about service limits (regional limit on API Gateway, # of requests/sec, regional limit on lambda concurrency). Architect with service limits in mind. Load test to make sure.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gapeuzdmebgj7r461i33.png)

#### Lambda

**Domain logic**: encapsulate and unit test (optional for simple functions)

**Integrations**: integration test locally against real AWS services (fast feedback from local testing, better confidence from testing in the cloud)

**IAM permissions**: e2e tests 

#### Auth

Cognito, AWS_IAM, API Key: all with e2e tests

Lambda authorizer: some e2e, but the feedback loop is slow. Unit (where appropriate) + integration, then e2e.

#### Request validation, Request transform, Direct service integration, Response transform

E2e.

For Request & Response transform, also consider [Optic](https://www.useoptic.com/docs).

#### Other API Gateway capabilities

**Throttling, Usage Plan**: load test

Caching, Resource policy: do not test API gateway itself...

### How to write integration tests

The pattern is as follows:

- Create a an event object.
- Feed it to the handler (the handler causes a DDB interaction, hence the "integration")
- Check that the result matches the expectation (by checking the response, and/or by reading from DDB, hence "integration")

**The key difference between integration vs e2e is that testing via handler vs testing via http.**

## Ch03 Testing AppSync

### Test strategy for API Gateway `ch03-test-appsync`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/brf872h5ta494av0ixmo.png)

Most of it is similar to the API Gateway strategy, with the exception of VTL templates (request & response templates) .

VTL templates can be tested via unit tests. The official documentation on testing the mapping resolvers: https://docs.aws.amazon.com/appsync/latest/devguide/test-debug-resolvers.html.

## Ch04 Testing Step functions

Components are easy to test in isolation with unit and integration.
Happy path through the state machine with e2e is easy too.
The challenge is hard to control test inputs down the branches; unhappy paths.

1. **Use component testing on the individual Lambda functions**. Encapsulate any business logic and unit test them. Test the handler functions locally with integration tests. Finally, these Lambda functions would be covered in your end-to-end tests as well, so we want to cover as many of the execution paths as possible using end-to-end tests.

2. **Use end-to-end tests to cover as many execution paths as possible**. But this is not always possible, for example, when you are dealing with Wait states and Task timeouts. And sometimes it's difficult to force the execution down the path that you need for your test case. So there will likely be gaps in your end-to-end tests.
3. **Use Step Functions Local and its mocks to fill the gaps in your end-to-end tests**. With its limitations, it's often not feasible to use Step Functions Local to test your state machine without first deploying all the resources to AWS. But it's still a very useful tool that can help you test those hard-to-reach execution paths with mocks.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ks3anavvj5mf1julhfsl.png)

### Choreography vs Orchestration (communication between microservices)

Controller process that orchestrates everything vs every component makes its own decisions based on a contract.

Choreography approach with events:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2zgihnk15c598rtuaaim.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iplvfii270qwp4cb7hby.png)

Orchestration approach with step functions:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ufv0gk6d8fdmkaq2ekb3.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4y05w3dk697ujxw20sm5.png)

**Rule of thumb: choreography between bounded-contexts, orchestration within a bounded-context.**

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kvo6ubaza9zzmzue8fzd.png)

We often see workflows within a bounded context being choreographed through messages in SQS/SNS/EventBridge. Example of when step functions is a better fit (don't do this, prefer step function instead):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ew49wa8pa8v24ujbq3es.png)

### Strategy for testing Step Functions

SFN Local: [step functions local](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local.html) . With SFN Local, there is no support for CloudFormation references, we usually cannot test before we deploy...

([Here](https://github.com/codetheweb/serverless-step-functions-local) is the serverless-step-functions-local plugin mentioned in the lesson.)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/trseow7yfx3gsi7ab7xt.png)

TL, DR; E2e is safe bet, for all happy paths.

Use SFNLocal if you have to, to simulate unhappy paths (but while using real AWS resources).

Use it in combination with e2e.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jvu5ij1ho8qlylgow0em.png)

For example the right most path in the complex step function has a 5 minute wait. That one is suitable for SFNLocal.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wxxnvfjndqbvs6jorgv3.png)

### Using mock services to improve e2e test coverage.

You may also have cases you are hitting external apis with side effects. Assume you have a step function, and you do not want to cause a side effect with e2e. You also do not want to use SFNLocal because the coverage is weak.

Check out [APIDOG](https://apidog.com/?utm_source=google_search&utm_medium=g&utm_campaign=18544428894&utm_content=141031187734&utm_term=apidog&gad=1&gclid=Cj0KCQjwgLOiBhC7ARIsAIeetVDIA1DgNNOXhpMVpV3vJVVn6ugP7jjW0u4zxzj3dWukDnrjHoA1ApQaAmLlEALw_wcB) and [ngrok](https://ngrok.com/). In `ch04-08-test-step-functions-mockExternalAPI-ngrok` we use ngrok to mock the api. The lambda is used with an argument to `overridePaypalUrl` which changes the baseUrl to a custom locally served webserver, and in the tests things are mocked this way.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b4xmwz16bl4q0er5pci7.png)

## Ch05 Testing Event Driven Architectures

In an event-driven architecture, various services communicate through events, which are messages that indicate a change in the system. AWS provides several options for capturing and distributing events (messaging services), each with its own advantages depending on your use case (and there is Kafka as an option too). When choosing a solution, consider factors such as the required throughput, latency, durability, message ordering, ease of management, and integration with other services. The specific choice will depend on the requirements of your event-driven architecture.

1. SQS (Simple Queue Service):
   - Advantages: Fully managed, simple to use, and scalable message queuing service. Offers at-least-once message delivery, visibility timeout, and dead-letter queues. Useful for decoupling components and enabling asynchronous communication between them.
   - Limitations: No built-in support for message filtering or fan-out.
2. SNS (Simple Notification Service):
   - Advantages: Fully managed, pub/sub messaging service that supports message filtering and fan-out to multiple subscribers. Integrates with other AWS services like Lambda, SQS, and more.
   - Limitations: Less control over message processing order, and might not be suitable for high-throughput scenarios.
3. **EventBridge** (formerly CloudWatch Events):
   - Advantages: Serverless event bus service that allows easy routing of events from AWS services and custom applications. Supports filtering, schema discovery, and event transformation. Great for building event-driven workflows and integrating with other AWS services.
   - Limitations: Higher latency compared to other options, and limited to the AWS ecosystem.
4. Kinesis Data Streams:
   - Advantages: Real-time, high-throughput, and low-latency streaming data service. Supports data processing, storage, and analytics. Provides durable storage, at-least-once processing, and ordering of records.
   - Limitations: Requires manual scaling and shard management, and has a higher learning curve.
5. DynamoDB Streams:
   - Advantages: Captures item-level modifications in DynamoDB tables and allows for event-driven processing. Offers low-latency, and scalable event-driven workflows.
   - Limitations: Tightly coupled with DynamoDB, meaning it is not applicable for non-DynamoDB use cases.
6. IoT Core:
   - Advantages: Managed service for IoT devices to securely communicate with the cloud. Allows filtering and routing of messages based on device attributes and message content. Supports MQTT, HTTP, and WebSockets.
   - Limitations: Primarily focused on IoT use cases and not suitable for general-purpose messaging.
7. Kafka:
   - Advantages: Open-source, distributed streaming platform with strong durability, fault-tolerance, and scalability. Provides strong message ordering and processing guarantees. Widely adopted with a large ecosystem and connector support.
   - Limitations: Requires manual management, has a steeper learning curve, and can have higher operational overhead compared to managed AWS services. Alternatively, you can use the fully-managed Confluent Cloud or Amazon MSK (Managed Streaming for Kafka) to reduce operational overhead.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/knn7nvrnymx3ia7uspna.png)

EventBridge is Yan's favorite. Kafka is what we use at work.
If your use case requires cross-platform compatibility, strong durability, high throughput, low latency, message ordering, or advanced stream processing, Kafka with Confluent Cloud might be a better choice than EventBridge. However, if your use case primarily involves AWS services, requires less operational overhead, and doesn't have strict requirements around the aforementioned factors, EventBridge could be a suitable choice.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p678p5hu5wvoo0np9xxj.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oadigm8eyfdejwuzpppi.png)

### Strategy for testing even-driven architectures

Test strategy really is the same as always.

Component tests: focuses on event publisher and consumers

E2e tests: checks everything flows through correctly

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4rw4i5qznm204jbrqmsc.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2ps49uz2fchi5k23okyx.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yl7cvv9f1eeyzj7gndi6.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5k1576hty5ljiqqlsc3x.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i9ht7u0fs8l1l0ndqbwq.png)

Integration test: invoke the lambda handler locally (just passing an event object to the handler) and have the lambda talk to the real AWS services, in this case EventBridge.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9f603c341pe1xwcpcbpw.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x3z4zlr8yxbm4t7sfr8d.png)

Strategy to test published events being sent out from individual components (Difficulty #3 - hard to get feedback on what's been sent) - imo this is overkill, just cover it with e2e.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ehpc2qtlv537zuwbgg0r.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5sadrkumj7fliddtux4i.png)

Isolated environment (ephemeral instance/temp branch) handle Difficulty #4 (how to isolate the SUT).

Difficulty #5 (hard to test failure paths and dead letter queue). Use e2e, remove the lambda IAM permission before the test, and restore it at the end. Very risky before if the test fails or ctrl+c, things are left in a broken state. Parallel execution is out of the question. Do not test, and instead rely on monitoring and alert on deliveries; `InvocationsFailedToBeSentToDlq` EventBridge metric. Yan also recommends [CloudFormation Hook 101](https://dev.to/aws-builders/cloudformation-hook-101-3jmj).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v6ixktcobnjouutq7gz7.png)

Difficulty #6 (how to test direct service integrations) - e2e.

Difficulty #7 (how to reset breaking changes before the cause problems) - no meta solution yet, we are looking at [Optic](https://www.useoptic.com/) and Pact.

### How to capture published events (Difficulty #3) `ch05-06-capturing-published-events`

_My opinion: with integration test, it is much work just to ensure that the lambdas publish the right events. The creation of the event catcher, creation of tests + maintenance of them... I would just cover all this via unit (05-05) + e2e (05-07)._

Include SNS and Kinesis (which also works for EventBridge) in e2e tests: https://theburningmonk.com/2019/09/how-to-include-sns-and-kinesis-in-your-e2e-tests

The Serverless Spy tool (CDK only): [https://serverlessspy.com](https://serverlessspy.com/)

The official documentation on sending real-time data using AppSync subscriptions: https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html

The official guide on "enhanced subscription filtering": https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-enhanced-filtering.html

To see the full list of functions supported by serverless-plugin-extrinsic-functions, visit its GitHub page here: https://github.com/theburningmonk/serverless-plugin-extrinsic-functions

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vga5otbqpvnk7toe9pv5.png)

### How to prevent breaking schema changes

Option 1: don't break the schema...

- Don't change the name of a field
- Don't change the type of a filed
- Don't change from required to optional vice versa

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/shxx6t2v9l55yh4qbjyh.png)

Option2: publish all versions of the event, until they retire.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eho0xwh262v4e3tok8xn.png)

Option 3: use tests to catch "actual" breaking changes. Check out [Optic](https://www.useoptic.com/docs), and Pact

## Ch06 Testing in production

Test changes using live user traffic, instead of a controlled environment. Because, real users behave differently to tests.

Canary deployment via feature flags is an approach.

[Testing in Production, the safe way](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8f71r2e4289trd42ro83.png)

### Smoke tests - small set of e2e (front & backend) that check the most critical user flows

Run after deployment, and on cron.

Avoid data pollution, proactively delete dummy data.

Avoid polluting analytics

Use Cypress. You can also check out ClouWatch Synthetic Canaries (meh).

Ad-hoc prod post deployment.

### Blue-Green deployment (meh)

Deploy the new version of your code (green).
When fully deployed, switch the traffic to the new version.
When happy, delete old version of your code (blue).

You get blue-green deployment out of the box with lambda. Once a new version is deployed, everything switches to new (green), and once executions on the old versions complete (blue) they get garbage collected.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/prbqmr8ieub3ppgh7880.png)

### Canary deployment (meh)

Minimize the blast radius of uncaught bugs in production.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7009fsugd8u82ioixgy2.png)

You can also do canary deployment with lambda, using weighted alias.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b5h2t6dl523b6kcgbm79.png)

If there are any alerts, CodeDeploy switches it back.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/28rn7sq2wozy43wpo1ry.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qid7aqf3kvav2wehucdv.png)

Limitations:

- Traffic is split by requests, not users.
- In an event driven architecture, we cannot guarantee all lambdas execute with the same version.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ajc51u8qfot3giwqkxz8.png)

This is why using feature flags is a better approach to canary deployment

### Feature Flags (meta)

Releases vs deployments; the deployment has already happened with a FF.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s403y599ue4zeg8diwim.png)

With FF, we can do all A/B testing, Canary testing, and we can roll back changes instantly without code changes.

We can also ensure the changes are per user (ex: paid vs free), demographics, % (only 10% of free uses in the west coast), and other controllable attributes. LaunchDarkly is popular in this space.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3buh38xffho1a9mj1itj.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/baai7zntf7audbeohuke.png)

### Load testing

Performance test that simulate heavy workload to measure a system's performance and identify bottlenecks or other issues.

Load pattern should be realistic. (Ex: no need to hammer the login endpoint if users login once every few weeks...)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f6la7rk1tc93sjjk1efd.png)

Serverless gives you a lot of scalability out of the box. But it's not free, and it's not infinitely scalable. You still have to worry about service limits (regional limit on API Gateway # of requests/sec, regional limit on lambda concurrency).

Architect with service limits in mind. Load test to make sure.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tellu3asexos2q1hztct.png)

### Chaos engineering (meh in AWS, multi region is meta)

_Chaos engineering is the discipline of experimenting on a distributed system in order to build confidence in the system's capability to withstand turbulent conditions in production._ [Principles of Chaos Engineering](https://principlesofchaos.org/), [Russ Miles: Chaos Engineering for the Business](https://www.russmiles.com/chaos-engineering-for-the-business-17b723f26361).

Use **controlled** experiments to inject failures into our system. This helps us learn about our system's behavior and uncover unknown failure modes, and how they manifest in production. Helps us build confidence about our system's ability to withstand turbulent conditions.

1. Define the steady state (if you're firefighting all the time, your system isn't steady. You don't vaccinate a sick person)
2. Hypothesize how the steady state will change

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2wr2x3azr96dfg2ebif2.png)

3. Inject realistic failure

4. Prove or disprove hypothesis. Example: we thought there would be no errors, but there were. This is great because we uncovered a failure mode before they could happen in production.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/asgjzvyyz8ywzwuj0r60.png)

The point is build confidence, not to break production. Only inject failures to a small percentage of requests, start in non-production environments, and only move to production when you've paid the dues;

    * Strong confidence that the system will withstand failures,

- Containment to limit the blast radius of surprises.
  - Tell everyone
  - Do it during work hours
  - Avoid important dates
  - Rollback plan ready (Feature flags!)

[Chaos Monkey](https://github.com/netflix/chaosmonkey), [Chaos Toolkit](https://chaostoolkit.org/), [Gremlin](https://www.gremlin.com/) all focus on infra; ec2 instances or containers. These are not useful for Serverless. There are no servers to kill. AWS already runs chaos experiments on the infra layer. Focus on identifying weaknesses in our code.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ruk1wsygvryta2lsre33.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/klkwygglz8inn34ka1bd.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qjcvsnvhq1weh1c8t7du.png)

The library [failure-lambda](https://github.com/gunnargrosch/failure-lambda) by Gunnar Grosch is the best bet for injecting lambda failures. (You have to make code changes, devex isn't great).

The question is, is it actually worth doing in a serverless environment. The payoff isn't as great as when you have a serverful application.

Often there is little we can do during an outage. So the solution is to invest in multi-region.

### Observability engineering

Observability is not Monitoring.

Monitoring: watching out for **known** failure modes; network I/O, CPU, memory usage, errors, latency... Dashboard stuff.

Observability: how well the internal state of an app can be **inferred** from its external outputs. Logs, traces, other side effects. The point is that if we can infer the internal state of an application, it can give a good idea of what is going on.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v9yfzk2ivxnwmn0egvzz.png)

Devex matters because what you invest in tooling saves on engineering time and software quality..

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0tk5ss5kabffzm7vnfe2.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fhba3eyg7sc77459qfvp.png)
