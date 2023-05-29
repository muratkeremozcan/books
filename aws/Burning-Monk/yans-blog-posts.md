# Testing

### [My testing strategy for serverless applications](https://theburningmonk.com/2022/05/my-testing-strategy-for-serverless-applications/)

Must have temporary branches / ephemeral instances for integration and e2e testing. `sls deploy -s my-feature`.

**Integration test**: Run tests locally against deployed AWS resources (integration testing). Do no bother with simulating AWS locally, it takes too much effort to set up and I find the result is too brittle (breaks easily) and hard to maintain.

**Unit test:** I generally think unit tests don’t have a great return on investment and I only write these if I have genuinely complex business logic

**End-to-end tests**: once I have good confidence that my code works, I would write end-to-end tests to check the whole system works (without the frontend) by testing the system from its external-facing interface, which can be a REST API, an EventBridge bus, or a Kinesis data stream.

**CI/CD pipeline**: create a temporary environment and run the integration and end-to-end tests against it. Then I would delete the environment after the tests. No need to clean up the data for these, but you would clean up on dev, stage etc.

**Testing in prod**: Spot e2e tests. Feature flags. Observability.

### [A practical guide to testing AWS Step Functions](https://theburningmonk.com/2022/12/a-practical-guide-to-testing-aws-step-functions/)

**Testing with Step Functions Local**: [Step Functions Local](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local.html) is a local simulator for Step Functions and can execute our state machines locally. I generally avoid local simulators (such as [localstack](https://localstack.cloud/)) because they are usually more trouble than they are worth. However, I make an exception for Step Functions Local because its mocking capability is almost a necessity if you want to achieve a good test coverage for error cases or hard to reach paths with e2e. The rest of it is e2e. (The blog says simulating wait is not possible with SFL, but the course Ch04 Testing Step Functions in Testing Serverless Application course says otherwise.)

**End-to-End testing**: To run end-to-end tests, we would deploy the project to AWS and create the state machine and all the resources that it references. Then we would execute the state machine with different inputs to cover different paths. It’s often difficult or impossible to cover all the execution paths using end-to-end tests. For example, a branch logic might depend on the result of an API call to a third-party API such as Stripe or Paypal. Or perhaps an error path relies on DynamoDB throwing an error. These are just a couple of examples of scenarios that we can’t easily cover using end-to-end tests.

For some of these scenarios, we can use mock APIs and return dummy results for our branch logic. For example, you can use [Apidog](https://www.apidog.com/) to host a mock Stripe API to test the payment flow from your state machine. You can also host a local mock API and expose it publicly using [ngrok](https://ngrok.com/).

**Component testing on individual Lambda functions**: this section is basically unit + integration from the above section.

# Tips for writing Lambda functions

### [Running and debugging AWS Lambda functions locally with the Serverless framework and VS Code](https://theburningmonk.com/2017/08/running-and-debugging-aws-lambda-functions-locally-with-the-serverless-framework-and-vs-code/)

`serverless invoke local --function functionName`

[invoke local](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/)  runs your code locally by emulating the AWS Lambda environment. (Check out [internal link](https://github.com/muratkeremozcan/books/tree/master/aws/Burning-Monk/Serverless-architectures-aws-2#serverless-framework))

### [Why you should use temporary CloudFormatoin stacks when you do serverless](https://theburningmonk.com/2019/09/why-you-should-use-temporary-stacks-when-you-do-serverless/)

Personally, I have never felt the need to have one account per developer. After all, there is some overhead for having an AWS account. Instead, I usually settle for one AWS account per team per environment. 

But what do you do when you need to deploy and test some unfinished changes? I can deploy the feature branch to a dedicated environment, e.g. `dev-my-feature`. Using the [Serverless framework](https://serverless.com/framework/), that is as easy as running the command `sls deploy -s dev-my-feature`. This would deploy all the Lambda functions, API Gateway and any other related resources (DynamoDB, etc.) in its own CloudFormation stack. I would be able to test my work-in-progress feature in a live AWS environment. When the developer is done with the feature, the temporary stack can be easily removed by running `sls remove -s dev-my-feature`.

**running localstack vs talking to AWS**

Instead of spending lots of time to get tools such as [localstack](https://github.com/localstack/localstack) working, I find it much more productive to deploy a temporary CloudFormation stack in AWS and run against the real thing.

The main downsides are: you need an internet connection, deploying to AWS is slower than running code locally, which slows down the feedback loop. To compensate for the loss of feedback loop, I also use tests as well as `sls invoke local` to run my functions locally while talking to the real AWS services.

Another common use of temporary CloudFormation stacks is for running end-to-end tests. One of the common problems with these tests is that you need to insert test data into a live, shared AWS environment. As a rule of thumb; insert the data a test case needs before the test, delete the data after the test finishes. Sometimes data may get left behind by incomplete tests. As a countermeasure teams use cron jobs to clean up data. An emerging best practice removing the temporary environment at the end of the tests, this way there is no need to clean test data, except on dev & stage deployments.



### [How to handle serverful resources when using ephemeral environments](https://theburningmonk.com/2023/02/how-to-handle-serverful-resources-when-using-ephemeral-environments/)

When your serverless architecture relies on **serverful** resources such as RDS or OpenSearch, it can be a challenge to use ephemeral environments. You wouldn’t want to have lots of RDS instances sitting around and paying for uptime for all of them. As such, I don’t include these serverful resources as part of the ephemeral environments and would share them instead. For example, I would have one RDS cluster in the dev account. All ephemeral environments in the dev account would use the same cluster but have their own tables/databases. This lets me keep the ephemeral environments self-contained without multiplying my RDS cost.

### [This is why you should keep stateful and stateless resources together](https://theburningmonk.com/2023/01/this-is-why-you-should-keep-stateful-and-stateless-resources-together/)

Loose coupling and high cohesion are two of the most essential software engineering principles. Unrelated things should stay apart, while related elements should be kept together.

I’m very much in the monolith stack camp. I prefer to keep stateful (databases, queues, etc.) and stateless (Lambda functions, API Gateway, etc.) resources together. Assuming the CloudFormation stack encapsulates an entire service, which includes both stateful and stateless resources, then it makes sense to define all the resources in a single CloudFormation stack. This makes managing and deploying the service easier; resource reference is easier, can update both stateless and stateful components in a single deployment, CI/CD is simpler, ephemeral environments are easier.

### [Hit the 6MB Lambda payload limit? Here’s what you can do.](https://theburningmonk.com/2020/04/hit-the-6mb-lambda-payload-limit-heres-what-you-can-do/)

> ```
> Execution failed: 6294149 byte payload is too large for the RequestResponse invocation type (limit 6291456 bytes)
> ```

You’ve hit the 6MB invocation payload limit for synchronous Lambda invocations. You can’t POST more than 6MB of data to Lambda through API Gateway.

Option1: use API Gateway service proxy. You can remove Lambda from the equation and go straight from API Gateway to S3 using API Gateway service proxies. The problem with this approach is that you’re limited by the API Gateway payload limit of 10MB.

Option2: use pre-signed S3 URL instead. Since the client will upload the files to S3 directly, you will not be bound by payload size limits imposed by API Gateway or Lambda.

Option 3: Lambda@Edge to forward to S3

Option 4: use pre-signed POST instead

### [Write recursive AWS Lambda functions the right way](https://theburningmonk.com/2017/08/write-recursive-aws-lambda-functions-the-right-way/)

AWS Lambda [limits](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) the maximum execution time of a single invocation to **5 minutes**. You should write Lambda functions that perform long-running tasks as **recursive functions** – eg. [processing a large S3 file](https://hackernoon.com/yubls-road-to-serverless-part-4-building-a-scalable-push-notification-system-62b38924ed61). Suppose you have an expensive task that can be broken into small tasks that can be processed in batches. At the end of each batch, use `context.getRemainingTimeInMillis()` to check if there’s still enough time to keep processing. Otherwise, `recurse` and pass along the current position so the next invocation can continue from where it left off.

Have a look at this [example](https://github.com/theburningmonk/lambda-recursive-s3-demo/blob/master/batch-processor.js) Lambda function that recursively processes a S3 file, using the approach outlined in this post.

```js
const _       = require('lodash');
const AWS     = require('aws-sdk');
const Promise = require('bluebird');
const lambda  = new AWS.Lambda();
const s3      = new AWS.S3();

// Data loaded from S3 and chached in case of recursion.
let cached;

let loadData = async (bucket, key) => {
  try {
    console.log('Loading data from S3', { bucket, key });

    let req = { 
      Bucket: bucket, 
      Key: key, 
      IfNoneMatch: _.get(cached, 'etag') 
    };
    let resp = await s3.getObject(req).promise();

    console.log('Caching data', { bucket, key, etag: resp.ETag });
    let data = JSON.parse(resp.Body);
    cached = { bucket, key, data, etag: resp.ETag };
    return data;
  } catch (err) {
    if (err.code === "NotModified") {
      console.log('Loading cached data', { bucket, key, etag: cached.etag });
      return cached.data;
    } else {
      throw err;
    }
  }
};

let recurse = async (payload) => {
  let req = {
    FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(payload)
  };

  console.log('Recursing...', req);
  let resp = await lambda.invoke(req).promise();
  console.log('Invocation complete', resp);

  return resp;
};

module.exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  let bucket   = _.get(event, 'Records[0].s3.bucket.name');
  let key      = _.get(event, 'Records[0].s3.object.key');
  let position = event.position || 0;
  let data     = await loadData(bucket, key);

  let totalTaskCount = data.tasks.length;
  let batchSize      = process.env.BATCH_SIZE || 5;

  try {
    do {
      console.log('Processing next batch...');
      let batch = data.tasks.slice(position, position + batchSize);
      position = position + batch.length;
      
      for (let task of batch) {
        await Promise.delay(1000); // each task takes a second to process
      }
    } while (position < totalTaskCount && 
            context.getRemainingTimeInMillis() > 10000);

    if (position < totalTaskCount) {
      let newEvent = Object.assign(event, { position });
      await recurse(newEvent);
      return `to be continued...[${position}]`;
    } else {
      return "all done";
    }
  } catch (err) {
    throw err;
  }
};
```





- [Use ](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)`context.getRemainingTimeInMillis()`[ to adjust client-side request timeout based on actual invocation time left](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)
- [Should you have few monolithic functions or many single-purposed functions?](https://theburningmonk.com/2018/01/aws-lambda-should-you-have-few-monolithic-functions-or-many-single-purposed-functions/)
- [How best to manage shared code and shared infrastructure](https://theburningmonk.com/2018/02/aws-lambda-how-best-to-manage-shared-code-and-shared-infrastructure/)
- [The best ways to save money on Lambda](https://theburningmonk.com/2022/07/the-best-ways-to-save-money-on-lambda/)
- [Common Node8 mistakes in Lambda](https://serverless.com/blog/common-node8-mistakes-in-lambda)
- [Monorepo vs one repo per service](https://lumigo.io/blog/mono-repo-vs-one-per-service/)
- [How to share code in a monorepo](https://theburningmonk.com/2019/06/aws-lambda-how-to-share-code-between-functions-in-a-monorepo/)
- [Lambda deployment frameworks compared](https://lumigo.io/blog/comparison-of-lambda-deployment-frameworks/)
- [When to use Lambda Layers](https://lumigo.io/blog/lambda-layers-when-to-use-it/)
- [Lambda layers: not a package manager, but a deployment optimization](https://theburningmonk.com/2021/05/lambda-layer-not-a-package-manager-but-a-deployment-optimization/)
- [How to log timed out Lambda invocations](https://theburningmonk.com/2019/05/how-to-log-timed-out-lambda-invocations/)
- [How to detect and stop accidental infinite recursions](https://theburningmonk.com/2019/06/aws-lambda-how-to-detect-and-stop-accidental-infinite-recursions/)
- [Canary deployment for AWS Lambda](https://lumigo.io/blog/canary-deployment-for-aws-lambda/)
- [Canary deployment with LaunchDarkly and AWS Lambda](https://lumigo.io/blog/canary-deployment-with-launchdarkly-and-aws-lambda/)
- [How to include SNS and Kinesis in your e2e tests](https://theburningmonk.com/2019/09/how-to-include-sns-and-kinesis-in-your-e2e-tests/)
- [Should you pack the AWS SDK in your deployment artefact?](https://theburningmonk.com/2019/09/should-you-pack-the-aws-sdk-in-your-deployment-artefact/)
- [Are Lambda-to-Lambda calls really that bad?](https://theburningmonk.com/2020/07/are-lambda-to-lambda-calls-really-so-bad/)
- [SQS and Lambda: the missing guide on failure modes](https://lumigo.io/blog/sqs-and-lambda-the-missing-guide-on-failure-modes/)

# Big picture questions

- [You are wrong about serverless and vendor lock-in](https://lumigo.io/blog/you-are-wrong-about-serverless-vendor-lock-in/)
- [You are thinking about serverless costs all wrong](https://theburningmonk.com/2019/01/you-are-thinking-about-serverless-costs-all-wrong/)
- [Serverless vs Containers](https://logz.io/blog/serverless-vs-containers/)
- [Why your business needs Serverless](https://www.jeffersonfrank.com/aws-blog/what-are-the-benefits-aws-serverless/)
- [“Even simple serverless applications have complex architecture diagrams”, so what?](https://theburningmonk.com/2020/11/even-simple-serverless-applications-have-complex-architecture-diagrams-so-what/)

# Serverless Observability

- [You need to use structured logging with AWS Lambda](https://theburningmonk.com/2018/01/you-need-to-use-structured-logging-with-aws-lambda/)
- [You should sample debug logs in production](https://theburningmonk.com/2018/04/you-need-to-sample-debug-logs-in-production/)
- [Centralised logging for AWS Lambda](https://theburningmonk.com/2017/08/centralised-logging-for-aws-lambda/)
- [Centralised logging for AWS Lambda, REVISED (2018)](https://theburningmonk.com/2018/07/centralised-logging-for-aws-lambda-revised-2018/)
- [Tips and tricks for logging and monitoring AWS Lambda functions](https://theburningmonk.com/2017/09/tips-and-tricks-for-logging-and-monitoring-aws-lambda-functions/)
- [Capture and forward correlation IDs through different event sources](https://theburningmonk.com/2017/09/capture-and-forward-correlation-ids-through-different-lambda-event-sources/)
- [You should use the SSM Parameter Store over Lambda env variables](https://theburningmonk.com/2017/09/you-should-use-ssm-parameter-store-over-lambda-env-variables/)
- [Mind the 75GB limit AWS Lambda deployment packages](https://theburningmonk.com/2016/08/aws-lambda-janitor-lambda-function-to-clean-up-old-deployment-packages/#)
- [The good and bad of X-Ray and Lambda](https://read.acloud.guru/im-here-to-tell-you-the-truth-the-good-the-bad-and-the-ugly-of-aws-x-ray-and-lambda-f212b5f332e9)
- [Serverless observability: Lumigo or AWS X-Ray](https://lumigo.io/blog/serverless-observability-lumigo-or-aws-x-ray/)
- [Serverless observability brings new challenges to current practices](https://theburningmonk.com/2018/02/serverless-observability-brings-new-challenges-to-current-practices/)
- [Serverless observability, what can we use out of the box?](https://theburningmonk.com/2018/04/serverless-observability-what-can-you-use-out-of-the-box/)
- [How to auto-create CloudWatch alarms for API Gateway, using Lambda](https://theburningmonk.com/2018/05/auto-create-cloudwatch-alarms-for-apis-with-lambda/)
- [How to monitor Lambda with CloudWatch Metrics](https://lumigo.io/blog/how-to-monitor-lambda-with-cloudwatch-metrics/)
- [Getting the most out of CloudWatch Logs](https://lumigo.io/blog/getting-the-most-out-of-cloudwatch-logs/)
- [Introducing an easier way to record custom metrics from Lambda](https://theburningmonk.com/2019/07/introducing-a-better-way-to-record-custom-metrics/)
- [How to debug Lambda performance issues](https://medium.com/lumigo/how-to-debug-aws-lambda-performance-issues-57053db1caf9)
- [Debugging AWS Lambda timeouts](https://lumigo.io/blog/debugging-aws-lambda-timeouts/)
- [What alerts should you have for Serverless applications?](https://lumigo.io/blog/what-alerts-should-you-have-for-serverless-applications/)
- [How to debug slow Lambda response time](https://lumigo.io/blog/debugging-slow-lambda-response-times)
- [Serverless Observability: it’s easier than you think](https://lumigo.io/blog/serverless-observability-its-easier-than-you-think/)
- [Shine some light on your SNS to SQS to Lambda stack](https://lumigo.io/blog/sns-sqs-to-lambda-shine-some-light/)
- [Lambda Logs API: a new way to process Lambda logs in real-time](https://lumigo.io/blog/lambda-logs-api-a-new-way-to-process-lambda-logs-in-real-time/)
- [AWS Lambda Telemetry API: a new way to process Lambda telemetry data in real-time](https://lumigo.io/blog/lambda-telemetry-api-a-new-way-to-process-lambda-telemetry-data-in-real-time/)

# Patterns

- [Applying the pub-sub and push-pull messaging patterns with AWS Lambda](https://hackernoon.com/applying-the-pub-sub-and-push-pull-messaging-patterns-with-aws-lambda-73d5ee346faa)
- [How to use the Decoupled Invocation pattern with AWS Lambda](https://theburningmonk.medium.com/applying-the-decoupled-invocation-pattern-with-aws-lambda-2f5f7e78d18)
- [Create IP-protected endpoints with API Gateway and Lambda](https://theburningmonk.com/2018/07/how-to-create-ip-protected-endpoints-with-api-gateway-and-lambda/)
- [DynamoDB TTL as an ad-hoc scheduling mechanism](https://theburningmonk.com/2019/03/dynamodb-ttl-as-an-ad-hoc-scheduling-mechanism/)
- [Using CloudWatch and Lambda to implement ad-hoc scheduling](https://theburningmonk.com/2019/05/using-cloudwatch-and-lambda-to-implement-ad-hoc-scheduling/)
- [Scheduling ad-hoc tasks with Step Functions](https://theburningmonk.com/2019/06/step-functions-as-an-ad-hoc-scheduling-mechanism/)
- [A simple event-sourcing example with snapshots using Lambda and DynamoDB](https://theburningmonk.com/2019/08/a-simple-event-sourcing-example-with-snapshots-using-lambda-and-dynamodb/)
- [What’s the best event source for doing pub-sub with Lambda](https://theburningmonk.com/2018/04/what-is-the-best-event-source-for-doing-pub-sub-with-aws-lambda/)
- [AWS Lambda — use the invocation context to better handle slow HTTP responses](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)

# AppSync

- [How to model one-to-many relationships with AppSync and DynamoDB](https://theburningmonk.com/2021/03/how-to-model-one-to-many-relationships-with-appsync-and-dynamodb/)
- [How I built a social network in 4 weeks with GraphQL and serverless](https://theburningmonk.com/2020/11/how-i-built-a-social-network-in-4-weeks-with-graphql-and-serverless/)
- [Five reasons you should consider AppSync over API Gateway](https://lumigo.io/aws-serverless-ecosystem/aws-appsync-five-reasons-you-should-consider-it-over-api-gateway/)
- [AppSync: skipping nullable nested resolvers by returning early](https://theburningmonk.com/2020/04/appsync-skipping-nullable-nested-resolvers/)
- [AppSync: how to error on DynamoDB conditional check failures](https://theburningmonk.com/2020/04/appsync-how-to-error-on-dynamodb-conditional-check-failures/)
- [AppSync: how to compare strings lexicographically in VTL](https://theburningmonk.com/2020/05/appsync-how-to-compare-strings-lexicographically-in-vtl/)
- [AppSync: how to inject table names into DynamoDB batch & transact operations](https://theburningmonk.com/2020/07/appsync-how-to-inject-table-names-into-dynamodb-batch-transact-operations/)
- [How I scaled an AppSync project to 200+ resolvers](https://theburningmonk.com/2020/07/how-i-scaled-an-appsync-project-to-200-resolvers/)
- [How to secure multi-tenant applications with AppSync and Cognito](https://theburningmonk.com/2021/03/how-to-secure-multi-tenant-applications-with-appsync-and-cognito/)
- [How to model hierarchical access with AppSync](https://theburningmonk.com/2020/08/how-to-model-hierarchical-access-with-appsync/)
- [How to set up custom domain names for AppSync](https://theburningmonk.com/2020/09/how-to-set-up-custom-domain-names-for-appsync/)
- [How to sample AppSync resolver logs](https://theburningmonk.com/2020/09/how-to-sample-appsync-resolver-logs/)
- [How to monitor and debug AppSync APIs](https://lumigo.io/blog/how-to-monitor-and-debug-appsync-apis/)
- [How to handle client errors gracefully with AppSync and Lambda](https://theburningmonk.com/2021/06/how-to-handle-client-errors-gracefully-with-appsync-and-lambda/)
- [Group-based auth with AppSync custom authoriser](https://theburningmonk.com/2021/09/group-based-auth-with-appsync-lambda-authoriser/)

# API Gateway

- [Checklist for going live with API Gateway and Lambda](https://theburningmonk.com/2019/11/check-list-for-going-live-with-api-gateway-and-lambda/)
- [The why, when and how of API Gateway service proxies](https://lumigo.io/blog/the-why-when-and-how-of-api-gateway-service-proxies/)
- [Using Protocol Buffers with API Gateway and AWS Lambda](https://theburningmonk.com/2017/09/using-protocol-buffers-with-api-gateway-and-aws-lambda/)
- [How to choose the right API Gateway auth method](https://theburningmonk.com/2020/06/how-to-choose-the-right-api-gateway-auth-method/)
- [How to auto-create CloudWatch alarms for API Gateway, using Lambda](https://theburningmonk.com/2018/05/auto-create-cloudwatch-alarms-for-apis-with-lambda/)
- [The API Gateway security flaw you need to pay attention to](https://theburningmonk.com/2019/10/the-api-gateway-security-flaw-you-need-to-pay-attention-to/)

# Step Functions

- [Choreography vs Orchestration in the land of serverless](https://theburningmonk.com/2020/08/choreography-vs-orchestration-in-the-land-of-serverless/)
- [A practical guide to testing AWS Step Functions](https://theburningmonk.com/2022/12/a-practical-guide-to-testing-aws-step-functions/)
- [Step Functions: apply try-catch to a block of states](https://theburningmonk.com/2018/08/step-functions-apply-try-catch-to-a-block-of-states/)
- [Step Functions: how to implement semaphores for state machines](https://theburningmonk.com/2018/07/step-functions-how-to-implement-semaphores-for-state-machines/)
- [How the Saga pattern manages failures with AWS Lambda and Step Functions](https://theburningmonk.com/2017/07/applying-the-saga-pattern-with-aws-lambda-and-step-functions/)
- [How to do blue-green deployment for Step Functions](https://theburningmonk.com/2019/08/how-to-do-blue-green-deployment-for-step-functions/)

# EventBridge

- [The biggest problem with EventBridge Scheduler and how to fix it](https://theburningmonk.com/2023/02/the-biggest-problem-with-eventbridge-scheduler-and-how-to-fix-it/)
- [5 reasons why you should EventBridge instead of SNS](https://lumigo.io/blog/5-reasons-why-you-should-use-eventbridge-instead-of-sns/)

# Performance & Cold Start

- [3 ways to manage concurrency in serverless applications](https://theburningmonk.com/2023/02/3-ways-to-manage-concurrency-in-serverless-applications/)
- [Just how expensive is the full AWS SDK?](https://theburningmonk.com/2019/03/just-how-expensive-is-the-full-aws-sdk/)
- [Improve latency by enabling HTTP keep-alive](https://theburningmonk.com/2019/02/lambda-optimization-tip-enable-http-keep-alive/)
- [How long does AWS Lambda keep your idle functions around before a cold start?](https://read.acloud.guru/how-long-does-aws-lambda-keep-your-idle-functions-around-before-a-cold-start-bf715d3b810)
- [How does language, memory and package size affect cold starts of AWS Lambda?](https://read.acloud.guru/does-coding-language-memory-or-package-size-affect-cold-starts-of-aws-lambda-a15e26d12c76)
- [Comparing AWS Lambda performance when using Node.js, Java, C# or Python](https://read.acloud.guru/comparing-aws-lambda-performance-when-using-node-js-java-c-or-python-281bef2c740f)
- [All you need to know about caching for serverless applications](https://theburningmonk.com/2019/10/all-you-need-to-know-about-caching-for-serverless-applications/)
- [How to: optimize Lambda memory size during CI/CD pipeline](https://theburningmonk.com/2020/03/how-to-optimize-lambda-memory-size-during-ci-cd-pipeline/)
- [This is all you need to know about Lambda cold starts](https://lumigo.io/blog/this-is-all-you-need-to-know-about-lambda-cold-starts/)
- [AWS Lambda — use the invocation context to better handle slow HTTP responses](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)
- [I’m afraid you’re thinking about AWS Lambda cold starts all wrong](https://theburningmonk.com/2018/01/im-afraid-youre-thinking-about-aws-lambda-cold-starts-all-wrong/)
- [AWS Lambda cold starts are about to get faster](https://lumigo.io/blog/aws-lambda-cold-starts-are-about-to-get-faster/)

# Security

- [The Old Faithful: Why SSM Parameter Store still reigns over Secrets Manager](https://theburningmonk.com/2023/03/the-old-faithful-why-ssm-parameter-store-still-reigns-over-secrets-manager/)
- [Passwordless Authentication made easy with Cognito: a step-by-step guide](https://theburningmonk.com/2023/03/passwordless-authentication-made-easy-with-cognito-a-step-by-step-guide/)
- [Implementing Magic Links with Amazon Cognito: A Step-by-Step Guide](https://theburningmonk.com/2023/03/implementing-magic-links-with-amazon-cognito-a-step-by-step-guide/)
- [Yes, S3 now encrypts objects by default, but your job is not done yet](https://theburningmonk.com/2023/01/yes-s3-now-encrypts-objects-by-default-but-your-job-is-not-done-yet/)
- [How to set up geofencing and IP allow-list for Cognito User Pool](https://theburningmonk.com/2022/08/how-to-setup-geofencing-and-ip-allow-list-for-cognito-user-pool/)
- [How to choose the right API Gateway auth method](https://theburningmonk.com/2020/06/how-to-choose-the-right-api-gateway-auth-method/)
- [Many-faced threats to Serverless security](https://hackernoon.com/many-faced-threats-to-serverless-security-519e94d19dba)
- [AWS Lambda and Secret management](https://epsagon.com/blog/aws-lambda-and-secret-management/)
- [To VPC or not to VPC? Pros and cons in AWS Lambda](https://lumigo.io/blog/to-vpc-or-not-to-vpc-in-aws-lambda/)
- [The API Gateway security flaw you need to pay attention to](https://theburningmonk.com/2019/10/the-api-gateway-security-flaw-you-need-to-pay-attention-to/)
- [How building a custom IAM system has made me appreciate AWS IAM even more](https://theburningmonk.com/2021/04/building-a-custom-iam-system-has-made-me-appreciate-aws-iam-even-more/)
- [The case for and against Amazon Cognito](https://theburningmonk.com/2021/03/the-case-for-and-against-amazon-cognito/)

# Kinesis

- [A self-healing Kinesis function that adapts its throughput based on performance](https://theburningmonk.com/2019/05/a-self-healing-kinesis-function-that-adapts-its-throughput-based-on-performance/)
- [3 Pro Tips for Developers using AWS Lambda with Kinesis Streams](https://read.acloud.guru/aws-lambda-3-pro-tips-for-working-with-kinesis-streams-8f6182a03113)
- [Auto-scaling Kinesis streams with AWS Lambda](https://read.acloud.guru/auto-scaling-kinesis-streams-with-aws-lambda-299f9a0512da)
- [AWS Lambda — how to use SNS to retry failed Kinesis events](https://medium.com/@theburningmonk/use-sns-to-retry-failed-kinesis-events-36e978782f05)
- [Lambda and Kinesis — beware of hot streams](https://lumigo.io/blog/lambda-and-kinesis-beware-of-hot-streams/)
- [How to connect SNS to Kinesis for cross-account delivery via API Gateway](https://theburningmonk.com/2019/07/how-to-connect-sns-to-kinesis-for-cross-account-delivery-via-api-gateway/)
- [The best reason to use DynamoDB Streams is…](https://lumigo.io/blog/the-best-reason-to-use-dynamodb-streams-is/)

# Serverless framework

- [Top 10 Serverless best practices](https://datree.io/serverless-best-practices/)
- [Introducing… CloudFormation extrinsic functions](https://theburningmonk.com/2019/04/introducing-cloudformation-extrinsic-functions/)
- [CloudFormation protip: use !Sub instead of !Join](https://theburningmonk.com/2019/05/cloudformation-protip-use-fnsub-instead-of-fnjoin/)
- [How to include Serverless Repository apps in serverless.yml](https://theburningmonk.com/2019/05/how-to-include-serverless-repository-apps-in-serverless-yml/)
- [Making Terraform and the Serverless framework work together](https://theburningmonk.com/2019/03/making-terraform-and-serverless-framework-work-together/)
- [How to make serverless framework boilerplates customizable](https://theburningmonk.com/2019/08/how-to-make-serverless-framework-boilerplates-customizable/)
- [Where Serverless plugin stops and platform starts](https://theburningmonk.com/2019/10/where-serverless-plugin-stops-and-platform-starts/)

# Chaos Engineering

- [How can we apply principles of chaos engineering to AWS Lambda?](https://theburningmonk.com/2017/10/how-can-we-apply-the-principles-of-chaos-engineering-to-aws-lambda/)
- [Applying the principles of chaos engineering to AWS Lambda with latency injection](https://theburningmonk.com/2017/11/applying-principles-of-chaos-engineering-to-aws-lambda-with-latency-injection/)

# Serverless Application Repositories

- [A serverless application to clean up old deployment packages](https://lumigo.io/blog/a-serverless-application-to-clean-up-old-deployment-packages/)
- [Serverless apps to automate the chores around CloudWatch Logs](https://lumigo.io/blog/serverless-applications-automate-chores-cloudwatch-logs/)
- [Serverless apps to speed up all your Lambda functions](https://lumigo.io/blog/serverless-app-to-speed-up-all-your-lambda-functions/)

# Yubl’s road to Serverless

- [part 1 : overview](https://theburningmonk.com/2016/12/yubls-road-to-serverless-architecture-part-1/)
- [part 2 : testing & continuous delivery strategies](https://theburningmonk.com/2017/02/yubls-road-to-serverless-architecture-part-2/)
- [part 3 : ops](https://theburningmonk.com/2017/03/yubls-road-to-serverless-architecture-part-3/)
- [part 4 : building a scalable push notification system](https://theburningmonk.com/2017/05/yubls-road-to-serverless-architecture-part-4-building-a-scalable-push-notification-system/)
- [part 5 : building a better recommendation system](https://theburningmonk.com/2017/07/yubls-road-to-serverless-part-5/)

# Misc

- [What is AWS Lambda’s new Streaming Response](https://lumigo.io/blog/return-large-objects-with-aws-lambdas-new-streaming-response/)
- [Lessons learnt from running serverless in production for 5 years](https://lumigo.io/blog/lessons-learned-running-serverless-in-production/)
- [How to load test a real-time multiplayer mobile game with AWS Lambda and Akka](https://tech.spaceapegames.com/2017/09/26/how-to-load-test-a-realtime-multiplayer-mobile-game-with-aws-lambda-and-akka/)
- [AWS Lambda — build yourself a URL shortener in 2 hours](https://theburningmonk.com/2017/04/aws-lambda-build-yourself-a-url-shortener-in-2-hours/)
- [Comparing Nuclio and AWS Lambda](https://theburningmonk.com/2019/04/comparing-nuclio-and-aws-lambda/)
- [AWS SAM + Cloudformation macros, a patch made in heaven](https://theburningmonk.com/2019/05/aws-sam-cloudformation-macros-a-patch-made-in-heaven/)
- [Using the power of CloudFormation custom resources for great good](https://theburningmonk.com/2019/09/how-to-use-the-power-of-cloudformation-custom-resources-for-great-good/)
- [Provisioned Concurrency — the end of cold starts](https://lumigo.io/blog/provisioned-concurrency-the-end-of-cold-starts/)
- [24 open source tools for the serverless developer: part 1](https://aws.amazon.com/blogs/opensource/24-open-source-tools-for-the-serverless-developer-part-1/)
- [24 open source tools for the serverless developer: part 2](https://aws.amazon.com/blogs/opensource/24-open-source-tools-for-the-serverless-developer-part-2/)
- [HTTP API goes GA!](https://lumigo.io/blog/http-api-goes-ga-today/)
- [Unlocking new Serverless use cases with EFS and Lambda](https://lumigo.io/blog/unlocking-more-serverless-use-cases-with-efs-and-lambda/)
- [Lambda extensions: what they are and why they matter](https://lumigo.io/blog/aws-lambda-extensions-what-are-they-and-why-do-they-matter/)
- [Lambda extensions just got even better](https://lumigo.io/blog/lambda-extensions-just-got-even-better/)
- [AWS Lambda: Function URL is live!](https://lumigo.io/blog/aws-lambda-function-url-is-live/)
- [7 tools to help you become a better serverless developer](https://lumigo.io/blog/seven-tools-help-become-better-serverless-developer/)
- [Welcome to 10GB of tmp storage with Lambda](https://lumigo.io/blog/welcome-to-10gb-of-tmp-storage-with-lambda/)
- [Graviton-based Lambda functions, what it means for you](https://lumigo.io/blog/graviton-based-lambda-functions-what-it-means-for-you/)
- [Package your Lambda function as a container image](https://lumigo.io/blog/package-your-lambda-function-as-a-container-image/)
- [How to work around CloudFormation circular dependencies](https://theburningmonk.com/2022/05/how-to-work-around-cloudformation-circular-dependencies/)
- [How to manage Route53 hosted zones in a multi-account environment](https://theburningmonk.com/2021/05/how-to-manage-route53-hosted-zones-in-a-multi-account-environment/)