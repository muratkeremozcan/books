# Testing

### [A practical guide to testing AWS Step Functions](https://theburningmonk.com/2022/12/a-practical-guide-to-testing-aws-step-functions/)

**Testing with Step Functions Local**: [Step Functions Local](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local.html) is a local simulator for Step Functions and can execute our state machines locally. I generally avoid local simulators (such as [localstack](https://localstack.cloud/)) because they are usually more trouble than they are worth. However, I make an exception for Step Functions Local because its mocking capability is almost a necessity if you want to achieve a good test coverage for error cases or hard to reach paths with e2e. The rest of it is e2e. (The blog says simulating wait is not possible with SFL, but the course Ch04 Testing Step Functions in Testing Serverless Application course says otherwise.)

**End-to-End testing**: To run end-to-end tests, we would deploy the project to AWS and create the state machine and all the resources that it references. Then we would execute the state machine with different inputs to cover different paths. It’s often difficult or impossible to cover all the execution paths using end-to-end tests. For example, a branch logic might depend on the result of an API call to a third-party API such as Stripe or Paypal. Or perhaps an error path relies on DynamoDB throwing an error. These are just a couple of examples of scenarios that we can’t easily cover using end-to-end tests.

For some of these scenarios, we can use mock APIs and return dummy results for our branch logic. For example, you can use [Apidog](https://www.apidog.com/) to host a mock Stripe API to test the payment flow from your state machine. You can also host a local mock API and expose it publicly using [ngrok](https://ngrok.com/).

**Component testing on individual Lambda functions**: this section is basically unit + integration from the above section.

# Tips for writing Lambda functions

### [Running and debugging AWS Lambda functions locally with the Serverless framework and VS Code](https://theburningmonk.com/2017/08/running-and-debugging-aws-lambda-functions-locally-with-the-serverless-framework-and-vs-code/)

`serverless invoke local --function functionName`

[invoke local](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) runs your code locally by emulating the AWS Lambda environment. (Check out [internal link](https://github.com/muratkeremozcan/books/tree/master/aws/Burning-Monk/Serverless-architectures-aws-2#serverless-framework))

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

The downside of these workarounds is that it complicates the client application and hurts the user experience. Putting the object on S3 adds user-facing latency. The client application also needs to download the object from S3 and incur even further latency overhead.

[![img](https://lumigo.io/wp-content/uploads/2022/11/streaming-response-01-1024x299.png)](https://lumigo.io/wp-content/uploads/2022/11/streaming-response-01.png)

Option 4: use pre-signed POST instead

Option 5 (new): use Lambda's new Streaming Response

### [What is AWS Lambda’s new Streaming Response](https://lumigo.io/blog/return-large-objects-with-aws-lambdas-new-streaming-response/)

Yan discusses the newly launched Response Streaming feature in Lambda. This feature allows payloads larger than 6MB to be returned, thereby bypassing the previous need for S3 when returning large objects from a Lambda-backed API. This feature simplifies the client application and improves user experience.

Users need to wrap their function code with the new streamifyResponse decorator to make it work. The feature also changes the function signature to async (requestStream, responseStream, context) from async (event, context).

```js
const { Readable } = require("stream");

module.exports.handler = awslambda.streamifyResponse(
  // notice that the fn signature is different than the usual
  // async (event, context) =>
  async (requestStream, responseStream, context) => {
    const file = await downloadLargeFileFromS3();
    const fileStream = Readable.from(file);
    fileStream.pipe(responseStream);
    await responseStream.finished();
  }
);
```

The `requestStream` contains the stringified version of the invocation event. And the `responseStream` is a writable Stream object. Any bytes you write to the `responseStream` object would be streamed to the client. The `context` object is the same as before.

The most obvious use case for this new feature is to bypass the need for S3 when you to return large objects from a Lambda-backed API. This helps improve the user experience and helps simplify the client application. The Response Streaming feature can be used to improve time-to-first-byte (TTFB) when returning video or audio content. Also, it can be used to stream incremental updates for long-running tasks.

However, there are limitations. The default limit is 20MB, which is a soft limit and can be raised through the Service Quota console or by raising a support ticket. Also, the feature is not supported by API Gateway’s LAMBDA_PROXY integration or ALB’s Lambda integration.

### [Write recursive AWS Lambda functions the right way](https://theburningmonk.com/2017/08/write-recursive-aws-lambda-functions-the-right-way/)

AWS Lambda [limits](http://docs.aws.amazon.com/lambda/latest/dg/limits.html) the maximum execution time of a single invocation to **5 minutes**. You should write Lambda functions that perform long-running tasks as **recursive functions** – eg. [processing a large S3 file](https://hackernoon.com/yubls-road-to-serverless-part-4-building-a-scalable-push-notification-system-62b38924ed61). Suppose you have an expensive task that can be broken into small tasks that can be processed in batches. At the end of each batch, use `context.getRemainingTimeInMillis()` to check if there’s still enough time to keep processing. Otherwise, `recurse` and pass along the current position so the next invocation can continue from where it left off.

Have a look at this [example](https://github.com/theburningmonk/lambda-recursive-s3-demo/blob/master/batch-processor.js) Lambda function that recursively processes a S3 file, using the approach outlined in this post.

```js
const _ = require("lodash");
const AWS = require("aws-sdk");
const Promise = require("bluebird");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();

// Data loaded from S3 and chached in case of recursion.
let cached;

let loadData = async (bucket, key) => {
  try {
    console.log("Loading data from S3", { bucket, key });

    let req = {
      Bucket: bucket,
      Key: key,
      IfNoneMatch: _.get(cached, "etag"),
    };
    let resp = await s3.getObject(req).promise();

    console.log("Caching data", { bucket, key, etag: resp.ETag });
    let data = JSON.parse(resp.Body);
    cached = { bucket, key, data, etag: resp.ETag };
    return data;
  } catch (err) {
    if (err.code === "NotModified") {
      console.log("Loading cached data", { bucket, key, etag: cached.etag });
      return cached.data;
    } else {
      throw err;
    }
  }
};

let recurse = async (payload) => {
  let req = {
    FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    InvocationType: "Event",
    Payload: JSON.stringify(payload),
  };

  console.log("Recursing...", req);
  let resp = await lambda.invoke(req).promise();
  console.log("Invocation complete", resp);

  return resp;
};

module.exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  let bucket = _.get(event, "Records[0].s3.bucket.name");
  let key = _.get(event, "Records[0].s3.object.key");
  let position = event.position || 0;
  let data = await loadData(bucket, key);

  let totalTaskCount = data.tasks.length;
  let batchSize = process.env.BATCH_SIZE || 5;

  try {
    do {
      console.log("Processing next batch...");
      let batch = data.tasks.slice(position, position + batchSize);
      position = position + batch.length;

      for (let task of batch) {
        await Promise.delay(1000); // each task takes a second to process
      }
    } while (
      position < totalTaskCount &&
      context.getRemainingTimeInMillis() > 10000
    );

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

### [Use ](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)`context.getRemainingTimeInMillis()`[ to adjust client-side request timeout based on actual invocation time left](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/) / [AWS Lambda — use the invocation context to better handle slow HTTP responses](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)

**API Gateway have a 30s max timeout** on all integration points. Serverless framework uses a default of 6s for AWS Lambda functions. This poses a problem hard coded timeout values in functions, when a function calls another function and so on, and the original function is waiting for a response.

Instead, we should **set the request timeout based on the amount of invocation time left**, whilst taking into account the time required to perform any recovery steps – e.g. return a meaningful error with application specific error code in the response body, or return a fallback result instead. You can easily find out how much time is left in the current invocation through the `context` object your function is invoked with using `context.getRemainingTimeInMillis()`.

With this approach, we get the best of both worlds: allow requests the best chance to succeed based on the actual amount of invocation time we have left; and prevent slow responses from timing out the function, which allows us a window of opportunity to perform recovery actions.

Check out [Netflix Hystrix](https://github.com/Netflix/Hystrix/wiki). Most of the patterns that are baked into _Hystrix_ can be easily adopted in our serverless applications to help make them more resilient to failures

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zf86nqrkfpcozwyjhqwm.png)

### [Should you have few monolithic functions or many single-purposed functions?](https://theburningmonk.com/2018/01/aws-lambda-should-you-have-few-monolithic-functions-or-many-single-purposed-functions/)

TL, DR; prefer the latter.

By “monolithic functions”, I meant functions that have internal branching logic based on the invocation event and can do one of several things. Example; one function to handle several HTTP endpoints:

```js
module.exports.handler = (event, context, cb) => {
  const path = event.path;
  const method = event.httpMethod;
  if (path === '/user' && method === 'GET') {
    .. // get user
  } else if (path === '/user' && method === 'DELETE') {
    .. // delete user
  } else if (path === '/user' && method === 'POST') {
    .. // create user
  } else if ... // other endpoints & methods
}
```

Evaluation:

- **discoverability**: how do I find out what features and capabilities exist in our system already, and through which functions?

- **debugging**: how do I quickly identify and locate the code I need to look at to debug a problem? e.g. there are errors in system X’s logs, where do I find the relevant code to start debugging the system?

- **scaling the team**: how do I minimize friction and allow me to grow the engineering team?

Utilize a naming convention and tagging on functions. The other 2 are no brainer.

### [How best to manage shared code and shared infrastructure](https://theburningmonk.com/2018/02/aws-lambda-how-best-to-manage-shared-code-and-shared-infrastructure/)

When you have a group of functions that are highly cohesive and are organised into the same repo then sharing code is easy, you just do it via a module inside the repo. To share code more generally between functions across the service boundary, it can be done through shared libraries, perhaps published as private NPM packages so they’re only available to your team. Or, you can share business logic by encapsulating them into a service.

Visibility is better with library vs service. Backward compatibility is also better. Failures are easier to deal with. Latency is better.

Deployment is easier with service. Versioning is easier with service (feature flags).

### [Common Node8 mistakes in Lambda](https://serverless.com/blog/common-node8-mistakes-in-lambda)

The main idea is separating out the `await` to make use of concurrency, instead of premature awaiting and running things sequentially.

Example 1:

`teamModel.fetch` doesn't depend on the result of `fixtureModel.fetchAll`, so they should run concurrently.

```js
async function getFixturesAndTeam(teamId) {
  const fixtures = await fixtureModel.fetchAll();
  const team = await teamModel.fetch(teamId);
  return {
    team,
    fixtures: fixtures.filter((x) => x.teamId === teamId),
  };
}
```

Here is how you can improve it. In this version, both `fixtureModel.fetchAll` and `teamModel.fetch` are started concurrently:

```js
async function getFixturesAndTeam(teamId) {
  const fixturesPromise = fixtureModel.fetchAll();
  const teamPromise = teamModel.fetch(teamId);

  const fixtures = await fixturesPromise;
  const team = await teamPromise;

  return {
    team,
    fixtures: fixtures.filter((x) => x.teamId === teamId),
  };
}
```

Example 2:

You also need to watch out when using `map` with `async/await`. The following will call `teamModel.fetch` one after another:

```js
async function getTeams(teamIds) {
  const teams = _.map(teamIds, id => await teamModel.fetch(id))
  return teams
}
```

Instead, you should write it as the following:

```js
async function getTeams(teamIds) {
  const promises = _.map(teamIds, (id) => teamModel.fetch(id));
  const teams = await Promise.all(promises);
  return teams;
}
```

Example 3:
Async await inside forEach doesn't behave the way you'd expect it to:

```js
[1, 2, 3].forEach(async (x) => {
  await sleep(x);
  console.log(x);
});

console.log("all done.");

// you only get
// all done.
```

The problem here is that `Array.prototype.forEach` does not wait for async functions to complete before moving on to the next iteration. If you want to execute an async function for each item in an array in a sequential manner (i.e., waiting for the previous async operation to complete before starting the next), you should use a `for...of` loop instead.

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms * 1000));

async function processArray(array) {
  for (const item of array) {
    await sleep(item);
    console.log(item);
  }
  console.log("all done.");
}

processArray([1, 2, 3]);
```

Example 4:
Use AWS SDK’s .promise(). AWS SDK clients support both callbacks and promises. To use `async/await` with the AWS SDK, add `.promise()` to client methods like this:

```js
const AWS = require("aws-sdk");
const Lambda = new AWS.Lambda();

async function invokeLambda(functionName) {
  const req = {
    FunctionName: functionName,
    Payload: JSON.stringify({ message: "hello world" }),
  };
  await Lambda.invoke(req).promise();
}
```

Example 5:
Use node's promisify. Before Node8, [bluebird](http://bluebirdjs.com/docs/getting-started.html) filled a massive gap. It provided the utility to convert callback-based functions to promise-based. But Node8's built-in `util` module has filled that gap with the `promisify` function. For example, we can now transform the `readFile` function from the `fs` module like this:

```js
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
```

### [Monorepo vs one repo per service](https://lumigo.io/blog/mono-repo-vs-one-per-service/)

#### Monorepo

Monorepo approach is very productive when you are a small team. It removes a lot of the boilerplate and plumbing involved with setting up new repos. Since the number of people involved is small, there is very little coherence penalty. It’s therefore great for small teams to get started and allows them to move quickly. The cost of maintaining a monorepo follows an exponential curve. The cost starts to quickly outweigh its benefits after the organization grows to around 100-150 people

- The amount of knowledge a new joiner needs to acquire grows with the overall complexity of the overall system. Michael Nygard’s post on [coherence penalty](https://www.michaelnygard.com/blog/2018/01/coherence-penalty-for-humans/) offers a really good explanation for this.
- It’s easy to create leaky abstractions and therefore accidental coupling between services. Because it’s easy to share code inside the same repo, which has less friction than to share code through shared libraries.
- When sharing code between services this way, it makes tracking changes more difficult. As changes in shared code can mean a change in a service’s behaviour, but it’s hard to correlate these changes outside the service’s folder.

As these companies (Google, Twitter, etc.) all went through a period of rapid growth, it was simply unfeasible to split the monorepo at that point. What does Google do now?

- You need to invest heavily in automation. Without the internal tools these companies have developed, the monorepo approach would never have worked at their scale.
- You need engineers who are brave enough to change shared code and create pull requests to hundreds, even thousands of services.

#### One repo per service

With the one repo per service approach, you do incur the overhead with setting up plenty of new repos. This overhead can be largely amortised with scaffolds and smart defaults. Monorepo approach offers small teams a great opportunity to gain early momentum. But you need to keep in mind that the cost of this approach would skyrocket as the organization grows beyond a certain point. By comparison, the one repo per service approach doesn’t have these extremes. There is a constant and small overhead for bootstrapping new repos, but the approach scales well as the number of engineers goes up.

A frequently asked question is “how do I share resources between services, and how do services reference each other’s stack output. My preferred solution is to [manage the shared resources separately](https://theburningmonk.com/2018/02/aws-lambda-how-best-to-manage-shared-code-and-shared-infrastructure/) (covered in [How best to manage shared code and shared infrastructure](https://theburningmonk.com/2018/02/aws-lambda-how-best-to-manage-shared-code-and-shared-infrastructure/)), away from the services that depend on them. This can be done with an infrastructure repo, with its own deployment pipeline and CloudFormation template. To allow other services to reference these shared resources, remember to add outputs (ARNs, SQS queue urls, DynamoDB table names, etc.) to the CloudFormation template. Shared code is published to package managers such as NPM, and consumers of the shared code can manage their own upgrade path.

### [How to share code in a monorepo](https://theburningmonk.com/2019/06/aws-lambda-how-to-share-code-between-functions-in-a-monorepo/)

How can we share business logic between services in a Node.js mono repo?

- Encapsulate the shared business logic into modules, and put them in a separate folder.
- In the Lambda handler functions, reference the shared modules using relative paths.
- Use webpack to resolve and bundle them into the deployment package. If you use the Serverless framework, then check out the [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin. (if webpack is not your thing then also check out the newer [serverless-esbuild](https://www.npmjs.com/package/serverless-esbuild) plugin which can achieve the same thing)

To see how everything fits together, check out [this demo repo](https://github.com/theburningmonk/lambda-monorepo-code-sharing-demo). I

### [When to use Lambda Layers](https://lumigo.io/blog/lambda-layers-when-to-use-it/)

Cons: trouble with devDeps & testing. Trouble with versioning when dealing with changes in the layers (no semantic ver). Limited to 5 layers per lambda.

Pro: may be useful for things that don't change like FFMpeg, and / or not available via npm, and very large. Lambda layers is still a good way to share large, seldom-changed files. For example, lambda runtimes for Lambda custom runtimes, or binary dependencies that aren’t distributed via NPM such as FFMPEG and MaxMind’s GeoIP database. The [Awesome Layers](https://github.com/mthenw/awesome-layers) list has a list of language runtimes and utilities (mostly binaries) that are available as Lambda layers.

`serverless-layers` is a handy npm plugin for optimization. Only uploads dependencies if they have changed. You take your dependencies from `package.json`, put them into a layer, and publish that layer to your account. The benefit is not having to upload the same artifacts over and over.

Although Lambda Layers is a poor substitute for package managers, it really shines as a way to optimize the deployment time of your application. By using something like the [serverless-layers](https://www.npmjs.com/package/serverless-layers) plugin you can bundle all of your dependencies as a Lambda layer and automatically update the Lambda functions to reference this layer. On subsequent deployments, if the dependencies haven’t changed, then there’s no need to upload them again. This produces a smaller deployment package and makes deployments faster. If you want to learn more about this pattern, then please give [Yan](https://theburningmonk.com/2021/05/lambda-layer-not-a-package-manager-but-a-deployment-optimization/) a read.

### [Lambda layers: not a package manager, but a deployment optimization](https://theburningmonk.com/2021/05/lambda-layer-not-a-package-manager-but-a-deployment-optimization/)

I’d still use NPM as the package manager for all my shared code. But in every project, I’d use the [serverless-layers](https://www.npmjs.com/package/serverless-layers) plugin to:

1. Package my project’s NPM dependencies and upload them as a single Lambda layer.
2. Update all the Lambda functions in the project to add a reference to the layer published in step 1.
3. For every deployment, check if my project dependencies have changed, and only publish a new version of the layer (i.e. step 1) if they have. If my NPM dependencies haven’t changed, the plugin would skip step 1 and reference the last published version of the layer instead.

All I have to do is point the plugin to an S3 bucket to upload the layer’s artefact to. In the `serverless.yml` I will add this to the `custom` section:

```
serverless-layers:
  layersDeploymentBucket: ${ssm:/${self:provider.stage}/layers-deployment-bucket-name}
```

And voila! All the benefits of using Lambda layers and none of the drawbacks.

In case you’re wondering, I would create the following resources in every AWS account:

- An S3 bucket for the Layer artefacts.
- An SSM parameter that gives me the name of the bucket so I can reference it from the `serverless.yml` for individual projects.

Add it under plugins, create a custom variable `serverless-layers` > `layersDeploymentBucket`. Create a custom bucket and specify it as a `layersDeploymentBucket` which is a property of the plugin.

![s3-parameter](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/05o8vwdw0rwon37mk85h.png)

### [How to log timed out Lambda invocations](https://theburningmonk.com/2019/05/how-to-log-timed-out-lambda-invocations/)

The `context` object for a Node.js function has a very useful method called `getRemainingTimeInMillis`. It returns the number of milliseconds left in the current invocation. So, we can schedule a callback to be actioned JUST before the function times out and preemptively logs the timeout event.

### [How to detect and stop accidental infinite recursions](https://theburningmonk.com/2019/06/aws-lambda-how-to-detect-and-stop-accidental-infinite-recursions/)

Use [**Lambda powertools project**](https://github.com/getndazn/dazn-lambda-powertools) to track the length of a call chain, they [**added a middleware**](https://github.com/getndazn/dazn-lambda-powertools/tree/master/packages/lambda-powertools-middleware-stop-infinite-loop) to stop invocations when the call chain length reaches a `threshold`. Limitation: the middleware does not work for SQS and Kinesis functions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bqdofk58yvebmksqgqyg.png)

### [Canary deployment for AWS Lambda](https://lumigo.io/blog/canary-deployment-for-aws-lambda/)

You get blue-green deployment out of the box with lambda. Once a new version is deployed, everything switches to new (green), and once executions on the old versions complete (blue) they get garbage collected. You can also do canary deployment with lambda, using weighted alias. There are 2 major limitations:

- Traffic is split by requests, not users.
- In an event driven architecture, we cannot guarantee all lambdas execute with the same version.

This is why using feature flags is a better approach to canary deployment.

### [Canary deployment with LaunchDarkly and AWS Lambda](https://lumigo.io/blog/canary-deployment-with-launchdarkly-and-aws-lambda/)

With FF, we can do all A/B testing, Canary testing, and we can roll back changes instantly without code changes.

We can also ensure the changes are per user (ex: paid vs free), demographics, % (only 10% of free uses in the west coast), and other controllable attributes. LaunchDarkly is popular in this space.

The LaunchDarkly SDK relies on a persistent connection to their streaming API to receive server-sent events (SSE) whenever feature flags change. But the [Node.js SDK](https://docs.launchdarkly.com/docs/node-sdk-reference) gives us the option to use polling mode instead. The use of persistent connections immediately signals trouble as they don’t work well with Lambda. They are often the source of problems for Lambda functions that have to use RDS. Indeed, a [set of practices](https://www.jeremydaly.com/manage-rds-connections-aws-lambda/) were necessary to make them bearable in the context of RDS, which is not applicable here.

### [How to include SNS and Kinesis in your e2e tests](https://theburningmonk.com/2019/09/how-to-include-sns-and-kinesis-in-your-e2e-tests/)

This is covered in Testing Event Driven Architectures Ch05 of Testing Serverless apps. (I prefer to not try hard this way and use a testing tool that works really well with event driven systems, and keep the e2e tests black box).

### Should you pack the AWS SDK in your deployment artefact?](https://theburningmonk.com/2019/09/should-you-pack-the-aws-sdk-in-your-deployment-artefact/)

Yes.

[Are Lambda-to-Lambda calls really that bad?](https://theburningmonk.com/2020/07/are-lambda-to-lambda-calls-really-so-bad/)

In most cases, a Lambda function is an implementation detail and shouldn’t be exposed as the system’s API. Instead, they should be fronted with something, such as API Gateway for HTTP APIs or an SNS topic for event processing systems. This allows you to make implementation changes later without impacting the external-facing contract of your system. But what if the caller and callee functions are both inside the same service? In which case, the whole “breaking the abstraction layer” thing is not an issue. Then it depends.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0wqm7dfwe38dlqg3n2pl.png)

But what if the caller and callee functions are both inside the same service? In which case, the whole “breaking the abstraction layer” thing is not an issue. Are Lambda-to-Lambda calls OK then?

If you’re invoking another Lambda function synchronously (i.e. when `InvocationType` is `RequestResponse` ) then you’re paying for extra invocation time and cost. While the extra cost might be negligible in most cases, the extra latency is usually undesirable, especially for user-facing APIs.

![img](https://theburningmonk.com/wp-content/uploads/2020/07/img_5f0aff37759e8.png)

If you care about either, then you should combine the two functions into one. You can still achieve separation of concerns and modularity at the code level. You don’t have to split them into multiple Lambda functions.

![img](https://theburningmonk.com/wp-content/uploads/2020/07/img_5f0aff4be86b8.png)

I had an interesting conversation about my recommendations around lambda-to-lambda calls, specifically, about the case when an API function offloads secondary tasks to another function so it can return quicker.

It's a common pushback, that instead of a function calling another, we should put a SQS queue in between.

As the image illustrates, this lambda-to-lambda call should be asynchronous (ie. when InvocationType is "Event", I might have been wrong to assume everyone understood what it meant). With async Lambda invocations, you get built-in retries and DLQ support already. So you don't need to put an SQS queue in there unless you have a good reason to do it - e.g. to regulate concurrency or to optimize for efficiency.

![img](https://theburningmonk.com/wp-content/uploads/2020/07/img_5f0aff5fbab80.png)

# Big picture questions

### [You are wrong about serverless and vendor lock-in](https://lumigo.io/blog/you-are-wrong-about-serverless-vendor-lock-in/)

The notion of serverless vendor lock-in is misunderstood. Rather than being a lock-in,t choosing a technology or service like serverless computing results in "coupling" rather than trapping users into a specific technology or provider. While moving away from a technology requires time and effort, it is always possible.

The perceived risk of being tightly coupled with a cloud provider is offset by the rewards. Using AWS Lambda as an example, the benefits are scalability, resilience, security, quicker time-to-market, and the ability to focus more on creating business value rather than dealing with infrastructural heavy lifting.

Be warned against focusing too much on portability and vendor lock-in arguments, as doing so often comes at the cost of missing out on provider-specific benefits and can reduce time-to-market. Yan argues that getting to market earlier and iterating faster is more important than potential difficulties changing providers later.

The real lock-in risk lies in data, not in business logic, as data accumulates and is economically disincentivized to leave its platform.

Skepticism about some of the voices warning about vendor lock-in, as companies with vested interests in traditional infrastructure might have reasons to slow serverless adoption. They conclude that while coupling with a specific provider can be a risk, the benefits of serverless technologies like scalability, resilience, and speed outweigh the potential future costs of migration.

### [You are thinking about serverless costs all wrong](https://theburningmonk.com/2019/01/you-are-thinking-about-serverless-costs-all-wrong/)

When evaluating the cost of serverless architectures like AWS Lambda, it's essential to think beyond the direct service costs. The focus should be on the Total Cost of Ownership (TCO), which includes indirect costs such as engineer salaries, which can significantly outpace service costs.

When utilized correctly, serverless solutions can significantly reduce costs by offloading operational responsibilities such as patching OS, provisioning and scaling servers, setting up load balancers, etc., to the cloud provider. This approach not only saves money but also allows developers to focus on customer-centric tasks.

Moreover, the importance of considering personnel costs is significant. For instance, hiring an engineer with AWS and DevOps experience can cost upwards of $100,000 per year, a cost that serverless approaches can potentially mitigate by simplifying operations.

In conclusion, while serverless architectures like AWS Lambda have their costs and limitations, when considering the TCO, they can often be a more cost-effective and efficient solution.

### [Serverless vs Containers](https://logz.io/blog/serverless-vs-containers/)

Both serverless and container technologies offer productive, machine-agnostic abstractions for engineers. However, there seems to be a divide between the two.

In terms of the state of containers, Docker and Kubernetes have come a long way, with the latter dominating the container orchestration space. AWS, Google Cloud, and Azure all offer managed Kubernetes as a service, and AWS also has its own managed container service, ECS. AWS Fargate, which runs containers without managing servers, blurs the line between containers and serverless.

Regarding the state of serverless, while it's a newer technology compared to containers, it has seen rapid growth. AWS Lambda, Google Cloud, Azure, and IBM have all announced their own serverless offerings, with AWS Lambda leading the market.

In terms of adoption, both serverless and containers are experiencing rapid growth. Many developers prefer serverless due to its simplicity, while DevOps professionals prefer containers for their control.

The debate between serverless and containers often comes down to control vs responsibility. While the ability to control your own infrastructure comes with a lot of responsibilities, serverless offers ease of use at the expense of control.

In terms of tooling support, serverless offers basic observability tools out of the box, while containers have a more mature and diverse ecosystem of tools.

Regarding vendor lock-in, it as a risk but that risk has rarely materialized into significant problems. Instead, companies often find that serverless teams get more done with fewer resources, making the productivity returns worth the potential risk.

In the future, serverless and containers should be used side by side, with a hybrid approach often being the most effective. Container technologies will eventually become serverless, and serverless platforms will allow users to bring their own containers, thus bridging the gap between the two technologies.

- Use serverless for workloads where serverless meets their needs
- Use containers for where it doesn’t, for example, for workloads that:
  - are long-running
  - require more predictable performance
  - require more resilience than can be easily achieved with serverless
  - run at significant scale constantly, and the pay-per-invocation pricing model becomes too costly

### [Why your business needs Serverless](https://www.jeffersonfrank.com/aws-blog/what-are-the-benefits-aws-serverless/)

Serverless computing simplifies repetitive, infrastructure-heavy tasks, allowing focus on more valuable elements of projects.

For developers, serverless architectures, specifically AWS Lambda, eliminate many routine tasks involved in server management, allowing developers to concentrate on implementing product features and evaluating architectural tradeoffs. Lambda also offers automatic scalability, reducing costs by eliminating the need for idle servers.

Managers should care about serverless as it improves team wellbeing and productivity. With AWS Lambda's inherent scalability and resilience, teams deliver faster and experience less stress. By reducing dependency on specialized DevOps or infrastructure teams, it allows the team to have more ownership of the system, thus boosting autonomy.

For business stakeholders, serverless architectures shorten time-to-market and maximize return on investment (ROI). This is achieved by improving developer productivity and reducing the operational costs associated with maintaining server infrastructure. Serverless technology also allows more accurate prediction of transaction costs, facilitating informed decision-making for business optimization.

Overall, serverless computing can benefit all involved in the development process by increasing productivity, reducing costs, and streamlining operations.

### [“Even simple serverless applications have complex architecture diagrams”, so what?](https://theburningmonk.com/2020/11/even-simple-serverless-applications-have-complex-architecture-diagrams-so-what/)

The common misconception is that serverless applications are more complex than serverful ones, based on their seemingly complex architecture diagrams. However, these diagrams are not more complex but are more honest representations of the actual architecture of applications, revealing hidden complexities often overlooked in serverful applications.

For serverful applications, a lot of complexity gets hidden inside EC2 instances and architecture diagrams, including the handling of servers going down, running applications in multiple availability zones, managing multiple RDS instances, and more. Conversely, the architecture diagrams of serverless applications encapsulate most of these complexities upfront, indicating the components provided by the platform or those that have been drastically simplified.

Serverless technologies such as API Gateway, Lambda, and DynamoDB provide built-in scalability, resilience, security, and multi-AZ support out of the box, freeing developers from many infrastructure concerns. For instance, deploying applications, performing blue-green deployments, auto-scaling, and OS patching are either handled automatically or greatly simplified in a serverless context.

In conclusion, while serverless architecture diagrams may look more complex on paper, they actually provide a more accurate picture of what you are running in your AWS account. The perceived complexity is due to these diagrams being a more honest depiction of your application, ultimately allowing you to understand its true complexity, make better architectural decisions, and more efficiently build and maintain your application.

# EventBridge

### [The biggest problem with EventBridge Scheduler and how to fix it](https://theburningmonk.com/2023/02/the-biggest-problem-with-eventbridge-scheduler-and-how-to-fix-it/)

This is a new capability from [Amazon EventBridge](https://aws.amazon.com/eventbridge/) that allows you to create, run, and manage scheduled tasks at scale. With EventBridge Scheduler, you can schedule one-time or recurrently tens of millions of tasks across many AWS services without provisioning or managing underlying infrastructure. In the book “[Serverless Architectures on AWS, 2nd Edition](https://www.manning.com/books/serverless-architectures-on-aws-second-edition?a_aid=aws-lambda-in-motion&a_bid=9318fc6f) a chapter shows five ways to implement a similar service to EventBridge Scheduler and discussed the different considerations for such a service.

- **Precision:** how close to the scheduled time is the task executed?
- **Scalability (number of open tasks):** can the service support millions of tasks that are scheduled but not yet executed?
- **Scalability (hotspots):** can the service execute millions of tasks at the same time?
- **Cost**

The chapter teaches you about architectural design and how to think about (and manipulate) trade-offs by walking you through five different implementations. While the lessons from this chapter are still relevant, the implementation ideas are largely superseded by EventBridge Scheduler. The biggest problem with using EventBridge Scheduler is with executing one-off tasks right now. At the time of writing, one-off schedules are not automatically deleted after they have been executed.

When EventBridge Scheduler invokes the target Lambda function, it does so via an asynchronous invocation. This means we can use Lambda Destinations (which doesn’t support synchronous invocations) to trigger the cleanup step and delete the schedule. You can see an example of this in this [demo repo](https://github.com/theburningmonk/eventbridge-schedule-self-delete-demo).

### [5 reasons why you should EventBridge instead of SNS](https://lumigo.io/blog/5-reasons-why-you-should-use-eventbridge-instead-of-sns/)

SNS and SQS have been the goto options for AWS developers when it comes to service integration. [EventBridge](https://lumigo.io/blog/amazon-eventbridge-a-new-era-of-saas-integration/) (formerly CloudWatch Events) has become a popular alternative.

1. **More targets**: EventBridge supports 20 target types, such as SNS, SQS, Kinesis, ECS, Lambda, and even another AWS account. This eliminates a lot of unnecessary "glue code" required for intermediary functions. However, it's important to note that EventBridge limits 5 targets per rule while SNS allows up to 12,500,000 subscriptions per topic.
2. **AWS and third-party events**: Besides custom application events, EventBridge can capture events in your AWS region and from API calls recorded by CloudTrail. It also supports events from third-party partners such as PagerDuty and Datadog, which allows it to react to events in those systems without the need for complex event ingestion. EventBridge's soft limit is 2400 operations per second for PutEvents, but this can be increased depending on your workload.
3. **Content-based filtering**: Unlike SNS, which only allows filtering by message attributes, EventBridge supports content-based filtering. This means you can pattern-match against the event content and use advanced rules such as numeric comparison, prefix matching, IP address matching, etc. This makes it possible to have a single event bus for all publishers, simplifying management.
4. **Schema discovery**: EventBridge tackles the issue of identifying and versioning event schemas with its Schema Registry. It can auto-generate schema definitions and generate language bindings for Java, Python, and TypeScript. This feature can be enabled on both the default and custom event buses.
5. **Input transformation**: EventBridge also has the capacity to transform the event before passing it to the targets, which reduces the need for custom glue code used solely for payload transformation.

# API Gateway

### [Checklist for going live with API Gateway and Lambda](https://theburningmonk.com/2019/11/check-list-for-going-live-with-api-gateway-and-lambda/)

### [Using Protocol Buffers with API Gateway and AWS Lambda](https://theburningmonk.com/2017/09/using-protocol-buffers-with-api-gateway-and-aws-lambda/)

Protocol Buffers (protobufs) with API Gateway and AWS Lambda to produce smaller and more efficient payloads compared to JSON.

The steps to implementing Protocol Buffers with API Gateway and Lambda include installing the `serverless-apigw-binary` plugin, adding 'application/x-protobuf' to binary media types, and creating a function that returns Protocol Buffers as a base64 encoded response. To encode & decode Protocol Buffers payload in Nodejs, you can use the [protobufjs](https://www.npmjs.com/package/protobufjs) package from NPM.

However, there are some important things to note when using protobufjs in a Lambda function. It requires that the package be installed on a Linux system due to its dependency on native binaries. This issue can be circumvented by deploying your code inside a Docker container, which would locally install a compatible version of the native binaries for your OS.

Yan suggests using HTTP content negotiation to toggle between JSON and Protocol Buffers as required. While Protocol Buffers should be used by default to minimize bandwidth use, a mechanism should be built in for switching the communication to JSON when necessary, for easier debugging.

### [How to choose the right API Gateway auth method](https://theburningmonk.com/2020/06/how-to-choose-the-right-api-gateway-auth-method/)

Be warned against handling authentication and authorization within the Lambda function due to the associated costs and potential vulnerability to denial-of-service attacks.

Cognito Identity Pools can exchange federated identities from external identity providers for temporary IAM credentials, useful for client apps accessing AWS services directly. For API Gateway, it necessitates using AWS_IAM authentication and IAM policies.

API Gateway resource policies provide an additional control layer. These policies can whitelist or blacklist IPs or AWS accounts, and limit access to the API to Virtual Private Clouds (VPCs). IP Whitelisting is useful for internal tools accessible via company VPN, while IP Blacklisting helps exclude suspicious IPs.

Yan suggests using a Web ACL in AWS WAF instead of maintaining blacklists manually. Private APIs can be set up using resource policies. Even with VPC-level restrictions, API level auth methods should be in place for security.

Whitelisting AWS accounts is discussed as a necessary step for cross-account API requests using AWS_IAM auth. The REST API needs to whitelist the caller's AWS account (or user/role) before it can use its IAM policy for API access.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kz9abrhey72vryo8rtjn.png)

#### How do I use Auth0 or Okta for authentication?

With third-party systems such as Auth0 or Okta, we can [integrate them with Cognito User Pools as SAML identity providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-saml-idp.html) (IdPs). That way, we can still use COGNITO authorizer with API Gateway and Cognito User Pools would verify the identity of the caller with the SAML IdP.

#### How do I support social log-in such as Facebook or Google?

Similar to the above, we can also [integrate Facebook, Google, Amazon or Apple with Cognito User Pools as social identity providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html).

### [How to auto-create CloudWatch alarms for API Gateway, using Lambda](https://theburningmonk.com/2018/05/auto-create-cloudwatch-alarms-for-apis-with-lambda/)

We need a solution to automating manual operational tasks associated with API Gateway and Lambda in AWS. These tasks, such as enabling Detailed Metrics for the deployment stage, setting up a dashboard in CloudWatch, and setting up CloudWatch Alarms for p99 latencies and error counts, are often forgotten because they are not part of an automated workflow.

Yan introduces a method to automate these tasks using CloudTrail, CloudWatch Events, and Lambda:

1. _CloudTrail_ captures the **CreateDeployment** request to _API Gateway_.
2. _CloudWatch Events_ pattern against this captured request.
3. _Lambda_ function to _a)_ enable detailed metrics, and _b)_ create alarms for each endpoint

The Serverless framework can create a function that automatically sets these alarms when a new API deployment is created. This function requires certain permissions and environment variables specifying SNS topics for the CloudWatch Alarms.

Yan also proposes extending the automation to include creating CloudWatch Alarms for 5xx errors for each endpoint and creating a CloudWatch Dashboard for the API.

# Patterns



### [How to use the Decoupled Invocation pattern with AWS Lambda](https://theburningmonk.medium.com/applying-the-decoupled-invocation-pattern-with-aws-lambda-2f5f7e78d18)

The Decoupled Invocation pattern is a serverless queue methodology that separates a reply from the initial request to prevent timeouts caused by slower downstream systems. This approach is particularly useful when using an API that is more scalable than its downstream systems or needs to perform an expensive, time-consuming process to respond to a request.

In this pattern, upon receiving a request, the API stores a record for the request in a DynamoDB table and queues a task in either SQS, Kinesis Stream or DynamoDB Stream. The API then responds to the client with a 202 ACCEPTED response, indicating the location of the worker task results. The client periodically polls the API for the result while the API continues to return 202 ACCEPTED until the task is processed.

This allows for processing at a pace that doesn't stress the downstream systems and provides flexibility in retry strategies. Moreover, it enables quick responses to initial requests, allowing for smarter client-side communication.

SQS, as an event source for AWS Lambda, is a good choice for this setup. As throughput increases, AWS automatically increases the number of SQS pollers, hence increasing the function's concurrent executions. However, SNS isn't recommended due to its invocation-per-message policy that doesn't amortize any traffic spikes.

Alternatively, Kinesis or DynamoDB Streams can be used. With DynamoDB Streams, the API only needs to write to the DynamoDB table, relying on the Streams to trigger the background worker. However, it's important to ensure that the client doesn’t poll indefinitely, so a timeout can be set based on the created_at timestamp.

Overall, the Decoupled Invocation pattern is a viable option when performing expensive, time-consuming tasks in response to an HTTP request, or if your API layer is constrained by downstream dependencies.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lkvm9tguma1v1ylmd8wz.png)

### [Create IP-protected endpoints with API Gateway and Lambda](https://theburningmonk.com/2018/07/how-to-create-ip-protected-endpoints-with-api-gateway-and-lambda/)

Describes how to set up IP-protected endpoints with AWS API Gateway and Lambda using resource policies, a feature that enables API Gateway private endpoints to be placed inside a private VPC.

### [DynamoDB TTL as an ad-hoc scheduling mechanism](https://theburningmonk.com/2019/03/dynamodb-ttl-as-an-ad-hoc-scheduling-mechanism/)

(EventBridge scheduler is the meta now)

### [Using CloudWatch and Lambda to implement ad-hoc scheduling](https://theburningmonk.com/2019/05/using-cloudwatch-and-lambda-to-implement-ad-hoc-scheduling/)

(EventBridge scheduler is the meta now)

### [Scheduling ad-hoc tasks with Step Functions](https://theburningmonk.com/2019/06/step-functions-as-an-ad-hoc-scheduling-mechanism/)

(EventBridge scheduler is the meta now)

### [A simple event-sourcing example with snapshots using Lambda and DynamoDB](https://theburningmonk.com/2019/08/a-simple-event-sourcing-example-with-snapshots-using-lambda-and-dynamodb/)

Discusses a simple event-sourcing example with snapshots using AWS Lambda and DynamoDB. In this demo, uses a banking application scenario where a user can create an account, check the balance, withdraw money, and credit the account.

The main aspects of the demo are:

1. Events: Each time an account holder interacts with the account (withdraws from or credits), an event is recorded. The current balance of the account is then derived from these events.

2. Snapshots: To avoid reading a large amount of data on every request, snapshots are created periodically. These snapshots capture the current state and allow limiting the number of rows that need to be fetched on every request.

3. Rebuilding the current state: The current state is rebuilt by finding the most recent snapshot and applying the events since the snapshot was taken.

4. Optimistic locking: To safeguard against concurrent updates to the account, the Version attribute is configured as the RANGE key. When an event is added to the DynamoDB table, the system checks that the version doesn't exist already.

5. Optimizations: Yan suggests several optimizations, like enabling HTTP keep-alive for the AWS SDK, not referencing the full AWS SDK, and using webpack to bundle the functions.

6. Streaming events to other consumers: Yan proposes two ways to stream these events to other systems - letting other services subscribe to the DynamoDB table's stream or creating another Kinesis stream and converting these DynamoDB INSERT events into domain events.

### [What’s the best event source for doing pub-sub with Lambda](https://theburningmonk.com/2018/04/what-is-the-best-event-source-for-doing-pub-sub-with-aws-lambda/)

Same article as [Applying the pub-sub and push-pull messaging patterns with AWS Lambda](https://hackernoon.com/applying-the-pub-sub-and-push-pull-messaging-patterns-with-aws-lambda-73d5ee346faa)

# Serverless framework

### [Top 10 Serverless best practices](https://datree.io/serverless-best-practices/)

**No Wildcards in IAM Role Statements**: To ensure your serverless applications are secure, avoid overprovisioning your functions with access. Adhere to the principle of least privilege by granting your functions only the minimal access they require.

1. ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uqakykf9exwuulnq94db.png)

2. **One IAM Role per Function**: Instead of using a shared role for all the functions in the serverless.yml (which violates the principle of least privilege), use the `serverless-iam-roles-per-function` plugin to define IAM roles for each function.

3. **Configure DLQ for Async Functions**: Configure a separate Dead Letter Queue (DLQ) for each function invoked by async event sources (see [here](https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html)). This way, if a function errors persistently, invocation events won't be lost.

4. **Configure Framework Version Range**: You should specify the frameworkVersion property in your serverless.yml file to ensure you are using a compatible version of the Serverless Framework.

5. **Configure CloudFormation Deploy Role**: Use the Serverless Framework to pass a dedicated deployer role to CloudFormation. This allows you to apply the principle of least privilege to the deployment pipeline and use attribute-based access control.

6. **Configure Stack Tags**: Tags are useful for tracking resources and monitoring AWS spending. Besides the default STAGE tag, consider adding other custom tags using the stackTags property. Deploy the [propagate-cfn-tags SAR app](https://github.com/lumigo-io/SAR-Propagate-CFN-Tags) to your account.

7. **Use Fn::Sub instead of Fn::Join for Clarity**: To construct ARNs and URLs, Fn::Sub is preferable over Fn::Join because it makes for more readable code. See more examples [here](https://theburningmonk.com/2019/05/cloudformation-protip-use-fnsub-instead-of-fnjoin/).

   ```yml
   # Example 1: IAM role name
   RoleName:  # hello-world-dev-{region}-lambdaRole
     !Join
       - '-'
       - - 'hello-world'
         - 'dev'
         - !Ref 'AWS::Region'
         - 'lambdaRole'

   # with Fn::Sub instead
   PolicyName:
     !Sub 'hello-world-dev-${AWS::Region}-lambdaRole

   # Example 2: API Gateway integration URI
   Uri: # arn:{partition}:apigateway:{region}:.../{lambda}/invocations
     !Join
       - ''
       - - 'arn:'
         - Ref: AWS::Partition
         - ':apigateway:'
         - Ref: AWS::Region
         - ':lambda:path/2015-03-31/functions/'
         - !GetAtt 'HelloLambdaFunction.Arn'
         - '/invocations'

   # with Fn::Sub:
   Uri:
     !Sub
       - 'arn:${AWS::Partition}:apigateway:${AWS::Region}:lambda:path/2015/03/31/functions/${Function}/invocations'
       - { Function: !GetAtt 'HelloLambdaFunction.Arn' }

   # Example 3: Lambda permission for API Gateway

   SourceArn: # arn:{partition}:execute-api:{region}:.../*/*
     !Join:
       - ''
       - - 'arn:'
         - Ref: AWS::Partition
         - ':execute-api:'
         - Ref: AWS::Region
         - ':'
         - Ref: AWS::AccountId
         - ':'
         - Ref: ApiGatewayRestApi
         - '/*/*'

   # with Fn::Sub
   SourceArn:
     !Sub
       - 'arn:${AWS::Partition}:execute-api:${AWS::Region}:${AWS::AccountId}:${RestApi}/*/*'
       - { RestApi: Ref: ApiGatewayRestApi }

   ```

8. **For Node.js Functions, Use Webpack to Improve Cold Start and Reduce Package Size** (Yan says he's having 2nd thoughts about this) : Using the serverless-webpack plugin with Node.js functions can significantly reduce initialization time and package size.

9. **Break Large serverless.yml into Multiple Files**: For better manageability, when your serverless.yml file gets too large, break it down into smaller files and reference them in the main serverless.yml file.

### [Introducing… CloudFormation extrinsic functions](https://theburningmonk.com/2019/04/introducing-cloudformation-extrinsic-functions/)

`serverless-plugin-extrinsic-functions` allows the use of custom functions anywhere in your serverless.yml as if they’re CloudFormation’s intrinsic functions. For instance, to implement the startsWith logic, one could simply use the Fn::StartsWith function.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/46jg5nmdourj9u6ks35i.png)

### [How to include Serverless Repository apps in serverless.yml](https://theburningmonk.com/2019/05/how-to-include-serverless-repository-apps-in-serverless-yml/)

[Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications) is pretty awesome. Here are some apps from there:

- [**lambda-janitor**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~lambda-janitor): cron job to delete old, unused versions of all Lambda functions in the region to free up storage space.
- [**auto-subscribe-log-group-to-arn**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~auto-subscribe-log-group-to-arn): subscribes new and existing CloudWatch log groups to a Lambda function, Kinesis stream, or Firehose delivery stream by ARN.
- [**auto-set-log-group-retention**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~auto-set-log-group-retention): updates the retention policy for new and existing CloudWatch log groups to a specified number of days to reduce CloudWatch Logs cost.
- [**async-custom-metrics**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~async-custom-metrics): lets you record custom metrics by writing to stdout (which is recorded in CloudWatch Logs) which is then parsed and forwarded to CloudWatch metrics as custom metrics.
- [**propagate-cfn-tags**](https://github.com/lumigo-io/SAR-Propagate-CFN-Tags): propagates CloudFormation tags to resources that are not automatically tagged, e.g. CloudWatch log groups.
- [**autodeploy-layer**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~autodeploy-layer): automatically deploys a Lambda layer to all new and existing functions in the region. Supports opt-in and opt-out via function tags.

To add a Serverless Repository app to your `serverless.yml` you will need to:

1. Add `Transform: AWS::Serverless-2016–10–31` to the `resources` section of your `serverless.yml`. This enables a global macro that will run over the whole CloudFormation stack and transform special resources as necessary. In this case, it’ll transform `AWS::Serverless::Application` resources into nested CloudFormation stacks.
2. Add Serverless Repository apps as additional CloudFormation resources. These should have the resource type `AWS::Serverless::Application`.

### [Making Terraform and the Serverless framework work together](https://theburningmonk.com/2019/03/making-terraform-and-serverless-framework-work-together/)

**\*Update 07/04/2023:** Since I originally wrote this post, my preference has shifted to using **SSM Parameter Store** to share information between Terraform and the Serverless framework. This is preferable because:\*

1. _The Serverless Framework has built-in support for reading data from SSM, with the **${ssm:/path/to/param}** syntax._
2. _CloudFormation is used to provision resources, using it as a container for outputs is a misuse of CloudFormation._
3. _Creating an SSM parameter is easier than a CloudFormation stack._
4. _SSM supports SecretString, so you can use it to share sensitive data that should be encrypted at rest, e.g. API keys._

_But you might ask “What about Secrets Manager instead of SSM?”. That is an option, but personally, I still prefer to use SSM Parameter Store over Secrets Manager in most cases, and [**here’s why**](https://theburningmonk.com/2023/03/the-old-faithful-why-ssm-parameter-store-still-reigns-over-secrets-manager/)._

### [How to make serverless framework boilerplates customizable](https://theburningmonk.com/2019/08/how-to-make-serverless-framework-boilerplates-customizable/)

**JS Proxy objects**: This approach allows you to create a boilerplate config where you can customize a field, even if it's deeply nested. This is accomplished by returning a Proxy that traps any attempt to access a property on the exported object. The property name is used to construct the actual config object. Additionally, you can return another Proxy from the first one to insert or update a property at an arbitrary location. For complex customization needs, you can create a scheme to support key-value pairs in a comma-separated fashion.

```js
const _ = require("lodash");

const template = {
  path: "/",
  method: "get",
};

const handler = {
  get: function (obj, path) {
    const x = _.cloneDeep(obj);
    return () =>
      new Proxy(x, {
        get: function (obj, value) {
          _.set(obj, path, value);
          return obj;
        },
      });
  },
};

module.exports = new Proxy(template, handler);
```

```yml
functions:
  index:
    handler: index.handler
    events:
      - http: ${file(defaultHttp.js):path./index}
      - http: ${file(defaultHttp.js):method.post}
```

Which creates the endpoints as you’d expect:

```
endpoints:
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/index
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/
```

### [Where Serverless plugin stops and platform starts](https://theburningmonk.com/2019/10/where-serverless-plugin-stops-and-platform-starts/)

Instead, for decisions that apply to ALL projects, you should build them into your platform. And by “platform”, I mean a collection of **capabilities** that are implemented once per account or region.

![img](https://theburningmonk.com/wp-content/uploads/2019/10/img_5da31d0120496.png)

Capabilities such as:

- logs would be delivered to your chosen logging service, be it Elasticsearch, Logz.io, Loggly, NewRelic or whatever it might be.
- log retention policies are configured to X days to reduce storage cost.
- functions can record custom metrics with StatsD format log messages.
- CloudFormation tags are propagated to all resources to enable better cost tracking.

Decisions that are specific to one project, or need to be tailored for each project, should be implemented at the project level. Plugins are a good way to implement these decisions.

- If the capability is universal and should apply to all of your serverless projects, then build it into your platform.
- Otherwise, use a plugin to implement capabilities that are required at a project-by-project basis.

> [AWS Control Tower](https://aws.amazon.com/controltower/) lets you template the baseline configuration for new accounts. You can then use the account factory to quickly provision them. If you’re new to Control Tower, then check out [this session](https://www.youtube.com/watch?v=2t-VkWt0rKk) from re:inforce 2019.

# Performance & Cold Start

### [3 ways to manage concurrency in serverless applications](https://theburningmonk.com/2023/02/3-ways-to-manage-concurrency-in-serverless-applications/)

**Fork-Join Pattern (Push-Pull / Fan-out Fan-in):**

This is a pattern that was designed to solve problems that can be broken into smaller tasks using a concurrent, recursive, divide-and-conquer approach.

Here's a brief description of how it works:

- **Fork:** A given task is split into multiple subtasks. This is usually done recursively, meaning each subtask can further split into its subtasks until the problem is small enough to be solved directly.
- **Join:** The results of the subtasks are then combined into a single result. This is typically done in the opposite order to the forking.

**Thread Pool Pattern:**

The Thread Pool pattern is used to manage a pool of worker threads that are waiting to execute tasks. This pattern is particularly useful when you have a large number of tasks to be executed in parallel, but want to limit the number of threads that are running at the same time.

Here's a brief description of how it works:

- **Initialization:** A number of worker threads are created and added to a pool.
- **Task Execution:** When a task needs to be executed, one of the worker threads from the pool is selected and the task is assigned to it.
- **Recycling:** Once a thread has finished executing its task, instead of being destroyed, it returns to the pool and waits for the next task.

Using a thread pool can improve performance by reducing the overhead of thread creation and destruction.

Both of these patterns are useful for handling concurrency in applications, but they're best suited to different types of tasks. The Fork-Join pattern is typically used for tasks that can be split into smaller, independent tasks, while the Thread Pool pattern is more general-purpose and can be used for any type of task.

There are three ways to manage concurrency in serverless applications, especially those using AWS services like Lambda, EventBridge, and Kinesis. All these are akin to the "thread pool" pattern in multithreaded programming

1. **Using Reserved Concurrency:** In AWS, you can use reserved concurrency on a Lambda function to process events from EventBridge. This method allows you to control the rate at which events are processed, which is beneficial when dealing with less scalable downstream systems. However, it has its limitations. Reserved concurrency might limit available concurrency for other functions in the same region, potentially throttling API functions and affecting the user experience. Also, it doesn't guarantee the order of event processing, and you might occasionally see duplicated invocations due to Lambda's at-least-once invocation semantic. You can mitigate this by tracking processed events using a unique ID in a DynamoDB table.

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y1j9jqehvswulcbcefek.png)

2. **Using EventSourceMapping with Kinesis Data Streams:** This method is suitable when you need to process events in the order they're received. You can control the concurrency of your application using the relevant settings on the EventSourceMapping without needing to use Lambda's reserved concurrency. In Kinesis, ordering is preserved within a partition key. This approach allows you to control the concurrency using a number of settings, including Batch Size, Batch window, and Concurrent batches per shard.

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mtqxo1k867p9lymo8j97.png)

3. **Using EventSourceMapping with SNS FIFO and SQS FIFO:** This method is similar to the second one but involves using SQS FIFO with SNS FIFO for message handling. Like Kinesis, event orders are preserved within a group, identified by the group ID in the messages. AWS has recently introduced a max concurrency setting for SQS event sources, which helps solve the problem of using reserved concurrency for SQS functions. You can use EventSourceMapping for SQS to control the concurrency of your application without having to manage the Lambda concurrency units in the region manually.

   > With SNS FIFO, you can’t fan out messages to Lambda functions directly (see official documentation [here](https://docs.aws.amazon.com/sns/latest/dg/fifo-message-delivery.html)). This is why you always need to have SQS FIFO in the mix as well.

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/prnfc0ixxmwi9b7kjq82.png)

Yan emphasizes the importance of these methods in managing concurrency in serverless applications, as improper management can lead to issues such as function throttling or improper order of event processing.

**Dynamic concurrency control in serverless applications**

This is an approach that allows an application to dynamically adjust its own concurrency based on external conditions.

Two main strategies are proposed:

1. **Metaprogramming:** Lambda functions can modify their own settings dynamically through API calls to the Lambda service. This allows them to react to external conditions, such as changes in response time and error rates from downstream systems, and adapt their concurrency settings accordingly. To ensure only one invocation can change the relevant settings at once, additional concurrency control measures are necessary.
2. **Using a Controller Process:** Instead of having each function adjust its own settings, a separate process can be used to manage them. This approach can distinguish between "blocking an ongoing execution from entering a critical section" and "not starting another execution at all". Yan notes the trade-offs discussed in the Step Functions semaphore post, notably that locking an execution midway makes choosing sensible timeouts more challenging. However, with Step Functions, callback patterns can be implemented using task tokens, eliminating the need for polling loops in the middle of your state machine.

### [Just how expensive is the full AWS SDK?](https://theburningmonk.com/2019/03/just-how-expensive-is-the-full-aws-sdk/)

When you declare functions and variables in a Lambda function, whether you should declare them inside the handler or outside depends on several factors.

Declaring functions and variables outside the handler pros:

1. **Usage across multiple invocations:** Global variables and functions (those declared outside of the handler function) can be used across multiple invocations of the Lambda function during the lifetime of the container. AWS Lambda reuses the container for multiple invocations of the function, so any state (like data in global variables) is preserved between invocations. This can be beneficial if you want to store data or state that can be reused across invocations.
2. **Initialization cost:** Initializing functions and variables outside the handler means they're initialized only once, during a cold start. If the initializations are computationally expensive or require network calls (like setting up a database connection), doing so globally can save time and resources over doing the same work on every invocation.
3. **Cleanliness of code:** Separating variable and function declarations (i.e., putting them outside the handler) can make your code cleaner and easier to read, especially if you follow a modular programming approach.

Declaring functions and variables inside the handler pros:

1. **State isolation:** If your functions and variables are stateful and you want the state to be completely isolated between invocations (meaning no state from one invocation is seen by another), then you should declare them inside the handler. For example, if you have a variable that holds user-specific data and you don't want data from one user to accidentally leak to another, you should declare the variable inside the handler.

2. **Testability:** Code that's inside the handler function can be easier to test, since you can invoke the handler function in a controlled environment and mock any dependencies.

When a Node.js Lambda function cold starts, a number of things happen:

- the Lambda service has to find a server with enough capacity to host the new container
- the new container is initialized
- the Node.js runtime is initialized
- your handler module is initialized, which includes initializing any global variables and functions you declare outside the handler function

To reduce cold starts

- Use lean imports; if you need just DDB, don't import the whole AWS SDK

- Prefer not to instrument the code if it can be helped (x-ray sdk)

- Use module bundlers (webpack, esbuild). But note that the impact in the experiments was not significant when the full AWS SDK was used. The greatest improvement was observed when only the DynamoDB client was required.

  > Yan says: I don't do bundling anymore, run into a few problems and it's changed my mind about bundling. Problem is with the source maps, for non-trivial projects, they get really big (affects cold start) and unhandled exceptions add quite a bit of latency (took seconds to get a 502 back in one API)

### [How long does AWS Lambda keep your idle functions around before a cold start?](https://read.acloud.guru/how-long-does-aws-lambda-keep-your-idle-functions-around-before-a-cold-start-bf715d3b810)

AWS Lambda will generally terminate functions after 45–60 mins of inactivity, although idle functions can sometimes be terminated a lot earlier to free up resources needed by other customers.

Hypothesis:

1. AWS Lambda will eventually reclaim resources from all idle functions, regardless of how long they stay idle.
2. The idle timeout before a cold start is not a constant and can vary.
3. Functions with larger memory allocations are likely to be terminated sooner when idle.

### [How does language, memory and package size affect cold starts of AWS Lambda?](https://read.acloud.guru/does-coding-language-memory-or-package-size-affect-cold-starts-of-aws-lambda-a15e26d12c76)

- Functions are no longer recycled after around 5 minutes of idleness, reducing the frequency of cold starts.
- Memory size improves cold start time linearly.
- C# and Java runtimes experience approximately 100 times the cold start time of Python.
- C#/Java Lambda functions may benefit from higher memory allocation compared to Node.js/Python functions.
- Larger deployment package sizes do not increase cold start time and could potentially reduce it.

### [How to: optimize Lambda memory size during CI/CD pipeline](https://theburningmonk.com/2020/03/how-to-optimize-lambda-memory-size-during-ci-cd-pipeline/)

https://serverlessrepo.aws.amazon.com/applications/us-east-1/451282441545/aws-lambda-power-tuning

AWS Lambda Power Tuning is a great tool for optimizing the configuration of your Lambda functions. However, it does not automatically apply to all your Lambda functions. It's more like a tool you use to run tests and see what the most efficient settings would be. Here are a few reasons you might not want to use it for every Lambda function:

1. **Performance Impact:** The tuning process involves invoking your function multiple times (as per the "num" parameter) with different configurations to gather performance data. This means your function will be executed repeatedly, which could have impacts on your other systems or exceed your rate limits, especially if the function interacts with databases or other services.
2. **Cost:** Each invocation during the tuning process is a billable event. If you're running this process across many functions and with a high "num" parameter, costs could add up.
3. **Time-consuming:** Depending on the complexity of your functions and the range of power values you want to test, the tuning process can be time-consuming.
4. **Not always necessary:** Some functions might not need tuning. If a function has consistent performance and is not causing a noticeable impact on your costs, there may not be much benefit in spending the time to fine-tune it.
5. **Security considerations:** As the documentation points out, the tool runs in your AWS account and makes actual HTTP requests, SDK calls, etc. Depending on your security policies, this may or may not be acceptable.

That being said, the tool can be very useful for optimizing high-usage or resource-intensive Lambda functions where a more efficient configuration could lead to significant cost savings or performance improvements. Remember that the "autoOptimize" parameter can be set to true if you want the tool to automatically apply the optimal configuration found. However, be mindful of the potential side effects and costs.

Yan proposes an alternative, and provides a tutorial on how to automate this power tuning process in the CI/CD pipeline using the lumigo-cli, a command-line interface tool. This tool integrates power-tuning capabilities and outputs results in an easily parseable format, making it easier to integrate into CI/CD pipelines. Check out [**this repo**](https://github.com/theburningmonk/powertune-lambda-CICD-demo) for a demo project that automatically tunes its functions as part of its CI/CD pipeline. Let’s walk through it.

The tutorial shows how to set up a demo project, which utilizes the Serverless framework and lumigo-cli for function configuration and deployment. It also explains how to use a build.sh script for encapsulating key CI/CD pipeline steps like running tests and deploying the project.

The writer also demonstrates how to use lumigo-cli to power-tune each function in the project. They emphasize the need to adjust the payload for different functions that process events from sources like SNS, SQS, Kinesis, etc.

The tutorial shows how to set up a CI/CD pipeline using CircleCI to automate the power tuning process after function deployment. The writer mentions some challenges with the proposed approach, such as tuning functions in every environment after every deployment and managing environment-specific payloads.

As potential solutions to these issues, Yan suggests creating a pull request when improvements are identified instead of updating the functions in-place. They also recommend standardizing the deployment and CI tool and automating the process further by parsing serverless.yml to extract function names, auto-generating the payload based on the configured event source, and creating a CLI for bootstrapping new projects.

# Security

### [Passwordless Authentication made easy with Cognito: a step-by-step guide](https://theburningmonk.com/2023/03/passwordless-authentication-made-easy-with-cognito-a-step-by-step-guide/)

While Cognito does not natively support passwordless authentication, one can implement custom authentication flows using Lambda hooks. The method involves using the DefineAuthChallenge, CreateAuthChallenge, and VerifyAuthChallengeResponse Lambda functions.

Here's the flow:

1. The user initiates the authentication flow using their email address.
2. The user pool calls DefineAuthChallenge Lambda function to decide the next step.
3. To create the custom challenge, the user pool calls CreateAuthChallenge Lambda function. It generates a one-time password and emails it to the user, using Simple Email Service (SES).
4. The user enters the one-time password on the login screen.
5. The user pool calls the VerifyAuthChallengeResponse Lambda function to check the user’s answer.
6. The user pool calls the DefineAuthChallenge function again to decide what happens next. The options include failing the authentication due to too many incorrect attempts, succeeding the authentication flow and issuing the JWT tokens to the user, or giving the user another chance to answer correctly.

There is also a detailed guide to implementing this passwordless authentication in the link, starting with setting up a Cognito User Pool, configuring the User Pool Client for the frontend, defining the PreSignUp hook, setting up frontend for sign-up and sign-in, and creating DefineAuthChallenge, CreateAuthChallenge, and VerifyAuthChallengeResponse functions. The frontend should handle responding to the custom auth challenge, and if the DefineAuthChallenge function tells the user pool to fail authentication, it would throw an NotAuthorizedException exception with the message 'Incorrect username or password'. Try the demo app [here](https://passwordless-cognito.theburningmonk.com/magic-link)

### [Implementing Magic Links with Amazon Cognito: A Step-by-Step Guide](https://theburningmonk.com/2023/03/implementing-magic-links-with-amazon-cognito-a-step-by-step-guide/)

The implementation of a passwordless authentication system using Amazon Cognito, Serverless framework, and AWS Lambda functions. The system relies on sending users a magic link that logs them in directly, thus bypassing the need for a password.

1. **Setup:** It begins with the initial setup, which involves defining the necessary AWS resources such as the AWS Cognito User Pool, a KMS key for encrypting tokens, and AWS Lambda functions for handling different parts of the process.

2. **Lambda Function for User Sign Up:** A custom endpoint is added to register users via a POST /signup request. It interacts with AWS Cognito to create a new user.

3. **Frontend Registration:** The frontend, built with Vue, interacts with the custom registration endpoint to sign up users using their email address.

4. **POST /login Lambda Function:** A logIn function is defined in the Serverless framework to initiate the authentication flow. It generates a time-limited magic link and sends it to the user's email. It also updates a custom attribute in Cognito user's profile with the encrypted token.

5. **Frontend Login Process:** Users initiate the authentication flow by entering their email. An HTTP POST request is made to the /login endpoint, which triggers sending the magic link.

6. **Sign In with Cognito:** When users click the magic link, they are redirected back to the website, which then extracts the email and token values from the link, verifies them, and logs the user in using Amazon Cognito.

7. **DefineAuthChallenge Function:** AWS Cognito custom authentication flow behaves like a state machine and uses this function to decide the next action to be taken during the authentication session.

8. **CreateAuthChallenge Function:** This function only needs to pass the encrypted token to the VerifyAuthChallengeResponse function.

9. **VerifyAuthChallengeResponse Function:** This function performs several tasks including verifying the secret token, decrypting the token to extract email and expiration datetime, checking token expiration, and confirming that the current user's email matches what's in the token.

Overall, this method provides a seamless, passwordless login experience for users, bolstering security by limiting the opportunity for password-related breaches.

### [Yes, S3 now encrypts objects by default, but your job is not done yet](https://theburningmonk.com/2023/01/yes-s3-now-encrypts-objects-by-default-but-your-job-is-not-done-yet/)

Yan emphasizes that while the recent S3 update is beneficial, it only provides a baseline level of security. It guards against threats to AWS's infrastructure but doesn't shield users from many attack vectors that affect the security of their AWS environment. Thus, the implementation of comprehensive data security measures is still necessary. The use of SSE-KMS with a Customer Managed Key (CMK) is suggested. With this encryption mode, S3 is instructed to encrypt objects with a key controlled by the user, and any access to unencrypted content must have the 'kms:decrypt' permission for the CMK. This protects against unauthorized access even if a bucket is accidentally left public.

### [How to set up geofencing and IP allow-list for Cognito User Pool](https://theburningmonk.com/2022/08/how-to-setup-geofencing-and-ip-allow-list-for-cognito-user-pool/)

Explains how to set up geofencing and IP allow-lists for AWS Cognito user pools using AWS Web Application Firewall (WAF) protection. The new AWS feature enables users to apply geofencing and IP allow/deny lists to protect Cognito user pools from bypassing by potential malicious actors.

Geofencing can be used to block users from specific countries from signing up or logging into an application. By adding a custom rule to the WAF web ACL, it identifies users based on their IP address. If the matched action is set to 'Block', the rule prevents these users from interacting with the Cognito user pool's public API.

Similarly, an IP allow/deny list can be implemented to apply the same restriction to individual IP addresses, which can be useful if the system is designed to be used only within a VPN. By creating an IP set in WAF, users can create a rule to block all traffic that does not originate from the list of allowed IP addresses.

The WAF also helps in dealing with VPN proxies which can bypass geofencing systems. By adding the managed rule 'Anonymous IP list' to the web ACL, it can block traffic originating from VPN proxies, Tor nodes, and hosting providers.

### [Many-faced threats to Serverless security](https://hackernoon.com/many-faced-threats-to-serverless-security-519e94d19dba)

Although AWS handles operational responsibilities like maintaining the host OS, it is still essential for developers to patch their application and address vulnerabilities in their code and dependencies.

Components with known vulnerabilities can be a major issue. Be warned about potential threats posed by NPM publishers who might not be who they claim to be. Yan further discusses the threat of injection and cross-site scripting attacks, sensitive data exposure, and problems with IAM permissions. Another major point of concern is the risk of Denial of Wallet (DoW) attacks. This is where attackers force an application to scale aggressively, causing significant financial cost.

Developers should secure external data, especially due to the stateless nature of Lambda functions, applying strict measures to protect data both in transit and at rest. It also highlights the need for secure communication with both internal and external services, advocating the use of IAM roles over API keys for fine-grained access control.

### [To VPC or not to VPC? Pros and cons in AWS Lambda](https://lumigo.io/blog/to-vpc-or-not-to-vpc-in-aws-lambda/)

Pros of using VPCs with Lambda:

1. For a Lambda function to access resources inside the designated VPC, it needs an Elastic Network Interface (ENI). ENIs can be shared across containers to optimize costs and performance.
2. VPCs enable control of egress traffic using security groups and outbound rules, potentially preventing the leak of sensitive data to the internet.

Cons of using VPCs with Lambda:

1. ENI Limits: There's a default limit of 350 ENIs per region. If this limit is reached, invocations of VPC-enabled functions can be throttled.
2. IP Limits: Each ENI uses a private IP address from the associated subnet. Scaling up Lambda functions quickly can exhaust available IP addresses, hampering the function's ability to scale up the number of concurrent executions.
3. Loss of Internet Access: VPC-enabled functions lose internet access as their ENI is associated only with a private IP address from the subnet.
4. Slow Cold Starts: VPC-enabled functions suffer from longer cold starts, as the process of ENIs is time-consuming.

VPCs are considered essential for EC2 instances to shield them from malicious traffic, **Lambda functions don't necessarily require this level of protection.** AWS Identity and Access Management (IAM) service already secures Lambda functions providing both authentication and authorization.

Using VPCs can give a false sense of security because even though they can stop malicious ingress traffic, Lambda functions can still be compromised through other means, such as their dependencies.

In summary, while VPCs can provide certain benefits, they introduce many challenges and limitations to AWS Lambda functions. Hence, Yan agrees with AWS's official recommendation to **avoid using VPCs with Lambda unless it is absolutely necessary**, **like when a function needs to access resources that run in the VPC (like RDS database, Elasticache cluster, internal APIs)**. Tools like FunctionShield can be used to block connectivity to public internet without resorting to VPCs, helping to prevent data theft from compromised functions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n8l27cd2d9mzih7u6bde.png)

### [The API Gateway security flaw you need to pay attention to](https://theburningmonk.com/2019/10/the-api-gateway-security-flaw-you-need-to-pay-attention-to/)

In AWS API Gateway by default every method inherits its throttling settings from the stage, sharing a rate limit that can be exhausted by a single method. This makes the system vulnerable to a Denial of Service (DOS) attack on one public endpoint that could bring down all APIs in the region.

Although AWS's Web Application Firewall (WAF) can provide some protection against basic DOS attacks by creating rate-based rules that rate limit at the IP level, it is not a foolproof system. WAF struggles against Distributed Denial of Service (DDOS) attacks from large botnets and slow DOS attacks that generate a steady stream of requests that mimic normal traffic. It can also block legitimate traffic from institutions sharing the same IP address for multiple users.

**To address this risk, developers need to apply individual rate limits for each method.** However, this requires consistent discipline, which is not always feasible. There is currently no built-in support in the Serverless framework for configuring these method settings, although the `serverless-api-stage plugin` is a potential solution. AWS Config can be used to check that each API Gateway method has a rate limit override, and automated remediation can be implemented using Lambda functions.

Another strategy is to reduce the amount of traffic reaching the API Gateway by leveraging CloudFront as a Content Delivery Network (CDN). However, this can incur extra costs during a DDOS attack. AWS Shield Advanced provides payment protection against these extra costs and access to the DDoS Response Team, but it is costly and may not be accessible for startups.

Yan concludes by emphasizing the need for improved tooling to help developers apply appropriate rate limits by default and calls for AWS to change the default behavior of applying region-wide limits on every method or provide warnings about potential risks. An update mentions a new Serverless framework plugin called `serverless-api-gateway-throttling` that allows users to configure default throttling settings for the API and override individual endpoint settings.

### [The case for and against Amazon Cognito](https://theburningmonk.com/2021/03/the-case-for-and-against-amazon-cognito/)

The case for Cognito:

1. Integration with other AWS services: Cognito integrates seamlessly with AWS services like API Gateway, AppSync, and ALB, which reduces the amount of custom code required.

2. Cost: Cognito is significantly cheaper than competitors such as Auth0 and Okta, making it a more feasible choice for business-to-customer (B2C) businesses. For example, Cognito’s cost per monthly active user (MAU) is $0.0055, compared to Auth0’s cost of ~$0.02 per MAU for the Developer tier.

The case against Cognito:

1. Poor developer experience: lack of clear, detailed documentation and the need to understand different aspects of Cognito (User Pool, Identity Pool, Sync).

2. Lack of polished features: Cognito supports many features, but these often feel incomplete or confusing. There is no IdP-initiated workflow, lack of customization for the hosted sign-in page, and issues with linking accounts.

3. Can't export user passwords: Due to security reasons, you can't export users' passwords from Cognito, making it difficult to migrate the user database to another service.

4. Can't change attributes: Once a Cognito User Pool is created, you can't change the list of attributes collected from users during sign-up, which is inconvenient.

5. Single region: Cognito lacks built-in support for cross-region replication, which can make applications vulnerable to single-region outages.

Yan still recommends Cognito as the default choice for new projects, particularly for B2C businesses with high MAU and budget constraints. The issues are deemed manageable or possible to work around with enough effort.

### [How building a custom IAM system has made me appreciate AWS IAM even more](https://theburningmonk.com/2021/04/building-a-custom-iam-system-has-made-me-appreciate-aws-iam-even-more/)

Use IAM. It's sophisticated for a good reason.

# Step Functions

### [Choreography vs Orchestration in the land of serverless](https://theburningmonk.com/2020/08/choreography-vs-orchestration-in-the-land-of-serverless/)

Covered in Testing Serverless Applications.

### [A practical guide to testing AWS Step Functions](https://theburningmonk.com/2022/12/a-practical-guide-to-testing-aws-step-functions/)

Covered in Testing Serverless Applications.

### [Step Functions: apply try-catch to a block of states](https://theburningmonk.com/2018/08/step-functions-apply-try-catch-to-a-block-of-states/)

Covered in Complete Guide To Step Functions.

### [Step Functions: how to implement semaphores for state machines](https://theburningmonk.com/2018/07/step-functions-how-to-implement-semaphores-for-state-machines/)

Covered in Complete Guide To Step Functions.

### [How the Saga pattern manages failures with AWS Lambda and Step Functions](https://theburningmonk.com/2017/07/applying-the-saga-pattern-with-aws-lambda-and-step-functions/)

Covered in Complete Guide To Step Functions.

# Chaos Engineering

### [How can we apply principles of chaos engineering to AWS Lambda?](https://theburningmonk.com/2017/10/how-can-we-apply-the-principles-of-chaos-engineering-to-aws-lambda/) [Applying the principles of chaos engineering to AWS Lambda with latency injection](https://theburningmonk.com/2017/11/applying-principles-of-chaos-engineering-to-aws-lambda-with-latency-injection/)

Serverless architectures, like those built with Lambda, have different failure modes compared to EC2 instances. AWS Lambda is a higher-level abstraction and handles many failure modes for you, such as "what if we lose these EC2 instances", thus we need to ask different questions to understand the weaknesses within our serverless architectures. [Chaos Monkey](https://github.com/netflix/chaosmonkey), [Chaos Toolkit](https://chaostoolkit.org/), [Gremlin](https://www.gremlin.com/) all focus on infra; ec2 instances or containers. These are not useful for Serverless. There are no servers to kill. AWS already runs chaos experiments on the infra layer. Focus on identifying weaknesses in our code.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ruk1wsygvryta2lsre33.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/klkwygglz8inn34ka1bd.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qjcvsnvhq1weh1c8t7du.png)

Serverless architectures have inherent chaos due to factors like:

- Shift in modularity from "services" to "functions", which are more numerous
- Increased need to harden around each function as opposed to a service
- More intermediary services each with their own failure modes
- More overall configurations, leading to more opportunities for misconfiguration
- Trading off more control of our infrastructure, introducing more unknown failure modes

The library [failure-lambda](https://github.com/gunnargrosch/failure-lambda) by Gunnar Grosch is the best bet for injecting lambda failures. (You have to make code changes, devex isn't great).

The question is, is it actually worth doing in a serverless environment. The payoff isn't as great as when you have a serverful application.

Often there is little we can do during an outage. So the solution is to invest in multi-region.

# Serverless Application Repositories

### [A serverless application to clean up old deployment packages](https://lumigo.io/blog/a-serverless-application-to-clean-up-old-deployment-packages/)

Unused dependencies do not add to initialization time, but they can hurt your regional cold storage limit. (Use [lambda-janitor](https://serverlessrepo.aws.amazon.com/applications/us-east-1/374852340823/lambda-janitor) for that to delete the old versions of your lambda.). This application, once deployed to an AWS account, deploys a "Clean" function that runs every hour for up to 15 minutes. The function has IAM permissions to list functions, versions, and aliases, as well as to delete function versions.

### [Serverless apps to automate the chores around CloudWatch Logs](https://lumigo.io/blog/serverless-applications-automate-chores-cloudwatch-logs/)

If you look around the [Serverless Application Repository](https://console.aws.amazon.com/serverlessrepo/home?region=us-east-1#/available-applications) console, you will find a number of applications that can help you ship logs from CloudWatch Logs to external services. One such example is the LogzioCloudWatchShipper application below.

![The Serverless Application Repository contains a number of applications for shipping Cloudwatch logs to external services.](https://lumigo.io/wp-content/uploads/2019/03/1-Logzio-CloudWatchShipper.jpg)

However, after I deploy these serverless applications I still need to go to the CloudWatch Logs console and subscribe my log groups to the relevant Lambda function. Since every function has a matching log group in CloudWatch Logs, you need to do this all the time. This is a chore and one that should be automated away.

Yan introduces two open-source applications to automate tasks around AWS CloudWatch Logs. Both of these applications are available in Lumigo’s Github repository and the Serverless Application Repository (SAR).

The first application, called `auto-subscribe-log-group-to-arn` is a solution for automating the process of subscribing log groups to relevant Lambda functions. Deploying this application means the user no longer needs to manually subscribe each log group to the Lambda function every time, a task that previously had to be done repetitively. The application takes a Destination ARN, pointing to a Lambda function, Kinesis Data Stream, or a Firehose Delivery Stream, and handles all the complexities related to permissions. Users can customize the configuration of the subscription filter, and specify a Prefix to forward logs for different services to different destination ARNs.Once deployed, the application creates two functions. The first one is triggered when a log group is created, and it subscribes the group to the destination ARN if it matches the configured prefix. The second function runs every hour and checks all the log groups to ensure they are subscribed to the destination ARN. This function helps when users decide to change the destination ARN, as it automatically updates all log groups.

The second application, `auto-set-log-group-retention` helps automate the process of updating the retention policy of logs. This is useful since CloudWatch Logs carry a storage cost, and by default, the retention policy for all log groups is to never expire. This application works similarly to the first one. It requires users to specify how many days they would like to keep the logs in CloudWatch Logs, and it creates two functions that update log groups when they are created and ensure existing log groups have the correct retention policy.

### [Serverless apps to speed up all your Lambda functions](https://lumigo.io/blog/serverless-app-to-speed-up-all-your-lambda-functions/)

If you use the AWS SDK v3, you don't need to do this anymore, it's enabled by default now.

# Serverless Observability

### [You need to use structured logging with AWS Lambda](https://theburningmonk.com/2018/01/you-need-to-use-structured-logging-with-aws-lambda/)

console.log is simple but eventually has limitations. Specifically, the use of console.log makes it hard to add consistent contextual information, filter log messages by specific attributes, and control the logging level based on configuration.

To overcome these challenges, Yan suggests the use of structured JSON for logging from the outset. This method allows for more context-rich and easily extractable data. It is recommended to use the log client that one has been using previously—like log4j, nlog, loggly, log4net, and others—and configure it to format log messages as JSON while attaching as much contextual information as possible.

Moreover, it is also beneficial to enable debug logging on the entire call chain for a small percentage of requests in production. This approach can help catch pervasive bugs in the logic, which would otherwise necessitate a complete redeployment of functions to turn on debug logging.



### [Centralised logging for AWS Lambda, REVISED (2018)](https://theburningmonk.com/2018/07/centralised-logging-for-aws-lambda-revised-2018/)

Initially, Yan suggested using a Lambda function to ship all Lambda logs from CloudWatch Logs to a log aggregation service such as Logz.io. However, this method can create issues at scale, as it can potentially double the number of concurrently running functions in a region, exceeding the regional limit and causing cascade failures. One solution to this problem is setting the Reserved Concurrency for the log shipping function to limit its max number of concurrent executions. While this could prevent cascade failures, it runs the risk of losing logs when the log shipping function is throttled.

Instead of these measures, Yan proposes a more efficient approach at scale: streaming logs from CloudWatch Logs to a Kinesis stream first, and then processing them with a Lambda function to forward them to a log aggregation service. This method offers better control over the concurrency of the log shipping function, as the number of shards in the Kinesis stream can be increased with the growth of log events, thus also increasing the number of concurrent executions of the log shipping function. [demo repo](https://github.com/theburningmonk/lambda-logging-kinesis-demo) demonstrates how this new approach works, with functions that automatically update retention policies, subscribe new log groups to a Kinesis stream, process log events, and ship them to Logz.io.

In summary; stream the logs from CloudWatch Logs to a Kinesis stream first. From there, a Lambda function can process the logs and forward them on to a log aggregation service.

![img](https://theburningmonk.com/wp-content/uploads/2018/07/img_5b5523f6e52cf.png)

### [Tips and tricks for logging and monitoring AWS Lambda functions](https://theburningmonk.com/2017/09/tips-and-tricks-for-logging-and-monitoring-aws-lambda-functions/)

Discusses logging and monitoring in the context of serverless architecture using AWS Lambda. Many traditional logging practices are no longer applicable in the serverless world. AWS CloudWatch metrics and logs, commonly used for Lambda, have several shortcomings including adding user-facing latency, being only granular down to a 1-minute interval, and usually lagging in real-time updating.

Alternatives like Datadog and Wavefront, despite offering Lambda support, use the same metrics from CloudWatch and therefore have the same latency issues. IOpipe, another alternative, wraps around your code to inject monitoring code but this increases user-facing latency and can potentially cause function errors.

Yan suggests sending custom metrics asynchronously as a possible solution, as Datadog does by writing custom metrics as specially-formatted log messages. This approach can be used even with other monitoring services. Additionally, tracking the memory usage and billed duration of AWS Lambda functions can be done in CloudWatch through parsing REPORT log messages and publishing them as custom metrics.

Yan also highlights the importance of considering concurrency when using Lambda functions to process CloudWatch logs, to prevent exceeding the account-wide limit on concurrent executions which can lead to cascade failures throughout the application. Yan suggests installing bulkheads, using fire-and-forget strategies, or sending the decoded log messages into a Kinesis stream to control parallelism as potential workarounds. H**owever, these solutions are considered temporary, as AWS has yet to provide better control over concurrent executions.**

### [Capture and forward correlation IDs through different event sources](https://theburningmonk.com/2017/09/capture-and-forward-correlation-ids-through-different-lambda-event-sources/)

Serverless architectures are microservices by default, you need correlation IDs to help debug issues that spans across multiple functions, and possibly different event source types – asynchronous, synchronous and streams. Correlation IDso tag every log message with the relevant context to help identify and trace each request that travels through multiple microservices. The objective is to make debugging and tracing easier in distributed systems.

![img](https://cdn-images-1.medium.com/max/1600/1*hlat_2akk4kxA_US-1bPSg.png)

If you want to follow along, then the code is available in this [repo](https://github.com/theburningmonk/lambda-correlation-id-demo), and the architecture of the demo project looks like this:

![img](https://cdn-images-1.medium.com/max/1600/1*DIhWeMy87eOfUdBDNLYM0w.png)

_The demo project consists of an edge API, api-a, which initialises a bunch of correlation IDs as well as the decision on whether or not to turn on debug logging. It’ll pass these along through HTTP requests to api-b, Kinesis events and SNS messages. Each of these downstream function would in turn capture and pass them along to api-c. A blueprint for how to capture and forward correlation IDs through 3 of the most commonly used event sources for Lambda._

![img](https://cdn-images-1.medium.com/max/1600/1*CPtfxdmQQLUeK-g2l-2WLg.png)

Part 1 covers how to add correlation IDs to log outputs, HTTP requests, and SNS messages, enabling developers to follow the flow of requests across different services. It describes creating an "http" module that adds the correlation IDs to the headers and a "sns" module to add these IDs to message attributes. These modules modify the request headers or message attributes to include the correlation IDs without changing the actual payload, making it easy to follow a request through log files.

Part 2 focuses on Amazon Kinesis Streams and DynamoDB Streams, where it's not possible to tag additional information along with the payload. In these cases, it suggests altering the payload itself by inserting a "\_\_context" field to carry the correlation IDs. For handling multiple Kinesis records, each with its own context, the suggested solution is to process records one at a time, thus managing the request context effectively for each record.

When receiving these events, the "**context" field can be removed, and the request context can be set accordingly. However, this method eliminates the chance to optimize by processing all records in a batch. Therefore, an alternative could be to leave the "**context" field on the Kinesis records and let the handler function manage them.

### [You should use the SSM Parameter Store over Lambda env variables](https://theburningmonk.com/2017/09/you-should-use-ssm-parameter-store-over-lambda-env-variables/)

Yan describes the difficulty of sharing configs across projects and implementing fine-grained access control with Lambda environment variables.

Challenges with environment variables include the inability to share configurations across projects as they are function specific, making updates cumbersome when configurations change. They also don't allow for adequate access control, which is a significant concern when dealing with sensitive data, like credentials, API keys, or DB connection strings. These should be encrypted at rest and in transit, and access should be based on the principle of least privilege.

As a solution, Yan recommends the SSM Parameter Store. The reasons include it being fully managed, allowing for easy configuration sharing, integrating with KMS out-of-the-box, offering fine-grained control via IAM, recording a history of changes, and being accessible through various interfaces, like the console, AWS CLI, and its HTTPS API.

However, there are service limits, including a maximum of 10,000 parameters per account, a maximum length of parameter value of 4096 characters, and a maximum of 100 past values for a parameter.

Serverless framework's added of SSM parameters support. Although this is an improvement, it still has drawbacks, like tying deployment ability to access to sensitive configuration data and lack of easy propagation for config value changes. Therefore, the Yan suggests fetching SSM parameter values at runtime and caching these values, with hot-swapping when source values change.

### [microserver anti-patterns](https://theburningmonk.com/2015/05/craftconf15-takeaways-from-microservice-antipatterns/)

1. **Overzealous Services**: The most common mistake is to dive straight into microservices without starting with the simplest thing possible. This approach adds complexity and slows down development teams. The recommended strategy is to start simple and gradually extract components into microservices as hotspots become apparent.

2. **Schemas Everywhere**: Sharing a database between services can create tight coupling and hinder the independent deployment of microservices. Instead, each service should have its own database. Changes to an API should be versioned semantically and deployed side by side to avoid breaking dependencies.

3. **Spiky Load between Services**: Uneven traffic between services can be a problem, often resolved by using queues to distribute the load evenly.

4. **Hardcoded IPs and Ports**: Hardcoding IPs and ports can cause trouble when configuring multiple environments and deployments. A solution can be the use of a discovery service like consul or etcd or a centralized router.

5. **Dogpiles**: When one service under load is bombarded with retry calls from other services, it can lead to system-wide cascading failures. The solution is to implement exponential backoff and the circuit breaker pattern.

6. **Debugging Hell**: Debugging becomes complicated in microservices architectures due to difficulty in tracing a service call failure to a user request. Using correlation IDs can be a solution to this problem.

7. **Missing Mock Servers**: If a service is depended on by other teams, those teams would need to mock and stub that service for testing. It's suggested that the provider of the service maintain a mock service and client for easier integration.

8. **Flying Blind**: Microservice architecture requires ongoing operational metrics. Without them, one risks running blind. Numerous commercial and open-source tools are available for this, including NewRelic, StackDriver, and Hystrix.

### [Mind the 75GB limit AWS Lambda deployment packages](https://theburningmonk.com/2016/08/aws-lambda-janitor-lambda-function-to-clean-up-old-deployment-packages/#)

Use [**lambda-janitor**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~lambda-janitor).

### [The good and bad of X-Ray and Lambda](https://read.acloud.guru/im-here-to-tell-you-the-truth-the-good-the-bad-and-the-ugly-of-aws-x-ray-and-lambda-f212b5f332e9)

Good: Yan found most features to be effective once properly configured. AWS X-Ray provided a trace of the service-a function, including the time it took to initialize the function and the various systems it interacted with. It also displayed the trace of service-c function.

Bad: AWS X-Ray inaccurately reported a 200 response code for an API Gateway endpoint invoking service-a function that errors. This is due to Lambda service returning a 200 response with payload indicating an error, causing confusion. Yan reported that traces don't span over API Gateway endpoints, meaning when the service-a function makes an outgoing HTTP request to an API Gateway endpoint, the trace stops and doesn't extend to the Lambda functions triggered by API Gateway.

Ugly: Yan encountered problems with the sampling mechanism, noting that every request was sampled instead of the documented 1 request per minute. Also, the addition of annotation and metadata to the root segment didn't work as expected. It was found that AWSXray.getSegment() was returning the root segment from the previous invocation, identified as a bug in the X-Ray SDK for Nodejs.

Despite some impressive features, Yan was disappointed by AWS X-Ray's inability to span traces over API Gateway endpoints and its lack of support for correlating IDs in log messages. Furthermore, issues with request sampling and incorrect annotation and metadata operation might add unnecessary costs and complications.

### [Serverless observability: Lumigo or AWS X-Ray](https://lumigo.io/blog/serverless-observability-lumigo-or-aws-x-ray/)

Observability is a measure of how well the internal state of an application can be inferred from its external outputs. It plays a critical role in troubleshooting problems in production, especially as different tools use varying methodologies for collecting data and provide different levels of insights.

AWS X-Ray is a native tool that provides basic distributed tracing, which involves collecting traces from applications and revealing insights such as transaction durations and performance bottlenecks. It requires manual instrumenting of code and integrates with many AWS services. However, its scope is limited and doesn't offer a complete observability package. Among its drawbacks are the need for extensive manual instrumentation, limited support for event-driven applications, and restrictions on tracing time and search syntax. Despite these limitations, it is a cost-effective solution that meets the basic needs of distributed tracing.

On the other hand, Lumigo is an observability tool that automatically instruments your code, aggregates errors, and provides built-in alerting and notification. Unlike X-Ray, it doesn't require manual instrumentation, offers high-level performance summaries, and supports event-driven applications across multiple regions and AWS accounts. It captures more data, offers free-text search on collected data, and can search up to 30 days' worth of data. However, Lumigo's tracer can add latency to every Lambda invocation, and it can't trace direct integrations between AppSync/Step Functions and other AWS services.

Despite X-Ray's cost-effectiveness, it falls short in its utility, especially outside the context of AppSync and Step Functions. Conversely, Lumigo provides clear value, offering a comprehensive observability solution, making it the best observability tool for serverless applications in his opinion. Lumigo improves the developer experience, reduces the need for debugging logs, and captures more state information about the application, making troubleshooting more effective.

### [Serverless observability brings new challenges to current practices](https://theburningmonk.com/2018/02/serverless-observability-brings-new-challenges-to-current-practices/)

Due to serverless technologies like AWS Lambda, many traditional methods of gaining observability for services running in virtual machines or containers have become redundant. With Lambda, access to underlying infrastructure is lost, making it impossible to install agents & daemons that collect, batch, and publish data to our observability systems.

Another challenge is the drastic change in how system concurrency is managed. With serverless technologies, concurrency is managed by the platform, which while beneficial, also results in higher traffic to the observability system, which could lead to performance and cost implications at scale.

The lifecycle of an AWS Lambda function presents another challenge. Lambda services tend to clear containers that haven't received a request for a while, and if there's any observability data that hasn't been published yet, it will be lost. Continuously receiving requests won't prevent this, as the Lambda service will still clear the container after a few active hours, resulting in potential loss of unpublished data.

Sending observability data as part of function invocation may impact user-facing latency. With the trend towards building event-driven architectures, function invocations often become chained through asynchronous event sources, making tracing such invocations a complex task.

Finally, Yan acknowledges the work done by companies like IOpipe, Dashbird, and Thundra in this challenging space, and advises the reader to consider these factors when choosing an observability tool. For example, when building user-facing APIs where latency is important, it is better to use an observability tool that can send data asynchronously, or use a stringent sample rate. The cost and execution priority may also influence the choice of observability method.

### [Serverless observability, what can we use out of the box?](https://theburningmonk.com/2018/04/serverless-observability-what-can-you-use-out-of-the-box/)

AWS provides several tools by default:

- CloudWatch for monitoring, alerting, and visualization
- CloudWatch Logs for logs
- X-Ray for distributed tracing
- Amazon ElasticSearch for log aggregation

With CloudWatch Logs, all outputs written to stdout are captured by the Lambda services and sent to CloudWatch Logs. This is a form of background processing provided by the platform. All log messages for a specific function will appear in CloudWatch Logs under a single Log Group. However, it's not easy to search for log messages in CloudWatch Logs, and there's no way to search logs for multiple functions at once. Although AWS has improved this service, it is still inferior to other alternatives in the market.

CloudWatch Metrics provides some basic metrics such as invocation count, error count, invocation duration, etc. But it misses some valuable data points, such as estimated costs, concurrent executions, cold starts, billed duration, and memory usage. You can set up Alarms in CloudWatch against any of these metrics, and you can set up basic dashboards in CloudWatch at a small cost.

X-Ray provides distributed tracing, but it focuses narrowly on one function, the distributed aspect is severely undercooked. It doesn't trace over API Gateway, or asynchronous invocations such as SNS or Kinesis. For a holistic view of your system, you would need to move away from what happens inside one function and be able to look at the entire call chain. Our tracing tools need to help us visualize the connections between our functions and follow data as it enters our system through both synchronous and asynchronous events.

Finally, our system should be thought of like a brain, with neurons (functions), synapses (connections between functions), and electrical signals (data). But when we look at our dashboards and X-Ray traces, we don't see this. Instead, we see a static list that doesn't reflect the movement of data and activity areas.

In conclusion, AWS provides some decent tools out of the box. While they have their shortcomings, they're good enough to start with. However, as our serverless applications become more complex, these tools need to either evolve with us or they will need to be replaced in our stack.

### [How to auto-create CloudWatch alarms for API Gateway, using Lambda](https://theburningmonk.com/2018/05/auto-create-cloudwatch-alarms-for-apis-with-lambda/)

Discusses automating the creation of CloudWatch Alarms for APIs with Lambda in Amazon Web Services (AWS). Yan emphasizes the importance of certain manual steps that often get missed due to their tedious nature. These steps include enabling detailed metrics for the deployment stage, setting up a dashboard in CloudWatch to display various metrics, and setting up CloudWatch Alarms for certain latencies and error counts.

He proposes a solution to automate these steps using CloudTrail, CloudWatch Events, and Lambda. This process involves three simple steps:

1. CloudTrail captures the CreateDeployment request to API Gateway.
2. CloudWatch Events create a pattern against this captured request.
3. A Lambda function enables detailed metrics and creates alarms for each endpoint.

Inside the handler function, which you can find [here](https://github.com/theburningmonk/manning-aws-lambda-in-motion/blob/master/functions/create-alarms.js), we perform a few steps

1. enable detailed metrics with an `updateStage` call to API Gateway
2. get the list of REST endpoints with a `getResources` call to API Gateway
3. get the REST API name with a `getRestApi` call to API Gateway
4. for each of the REST endpoints, create a p99 latency alarm in the `AWS/ApiGateway` namespace

A few key takeaways from the code are:

- The function requires certain permissions (apigateway:PATCH, apigateway:GET, and cloudwatch:PutMetricAlarm) to enable detailed metrics, get API name and REST endpoints, and create the alarms.
- Environment variables specify SNS topics for the CloudWatch Alarms.

Once this automation is set up, every time a new API is created, CloudWatch Alarms will automatically be set up to alert when the 99th percentile latency for an endpoint exceeds 1 second for 5 consecutive minutes.

Yan concludes by mentioning that one could take this automation a step further to create CloudWatch Alarms for 5xx errors for each endpoint and to create a CloudWatch Dashboard for the API. Yan prefers this automation approach because it scales better with team size and doesn't rely on developers remembering to perform these steps manually.

### [How to monitor Lambda with CloudWatch Metrics](https://lumigo.io/blog/how-to-monitor-lambda-with-cloudwatch-metrics/)

A detailed guide on how to utilize AWS CloudWatch Metrics for monitoring Lambda functions. It addresses several important Lambda metrics, their significance, and how to monitor them using CloudWatch, along with their potential limitations.

The key metrics include:

1. Lambda Errors: CloudWatch counts two types of errors - uncaught exceptions thrown by your code and runtime errors.
2. Dead-Letter Errors: These are critical issues that may lead to data loss, caused by problems like incorrect permissions, incorrect resource configurations, or size limits.
3. Function Duration: This refers to the time taken by each Lambda function to run, impacting application performance and costs.
4. Function Timeout: If a function exceeds the preset time, it stops running and CloudWatch doesn't log its duration.
5. Function Invocations: Successful function calls are recorded and used for billing purposes. Any changes in the number of invocations significantly influence costs.
6. Iterator Age: For streaming data, this metric is used to track the time it takes for the latest record in a stream to reach Lambda and be processed.

However, Yan points out several limitations of CloudWatch Metrics, such as missing valuable metrics like Concurrent Executions for all functions, Cold Start Count, Memory Usage, Billed Duration, Timeout Count, and Estimated Cost.

Additionally, Yan discusses how to design service dashboards and how to set alerts for monitoring. For instance, alerts should be set up for error rates, timeouts, Iterator Age, SQS message age, DLQ errors, throttling, and API latency. Yan also mentions CloudWatch Events, which can trigger Lambda functions to solve issues in other AWS services.

Lastly, Yan provides tips on how to automate the process of creating alerts using CloudFormation macros and discusses the potential of dashboards in CloudWatch.

### [Getting the most out of CloudWatch Logs](https://lumigo.io/blog/getting-the-most-out-of-cloudwatch-logs/)

Yan delves into using AWS CloudWatch for monitoring AWS Lambda functions.

1. CloudWatch Logs for AWS Lambda: The messages written by Lambda functions to stdout or stderr are collected asynchronously and shipped to AWS CloudWatch Logs, arranged into log groups. Each function has a matching log group with the same name. Inside each log group, there are log streams each mapping to a concurrent execution of the function. The system is cost-effective, scalable, resilient and can store data for a long period.
2. CloudWatch Subscription Filters: These let you stream log events to a destination within AWS, like Kinesis stream, Kinesis Firehose delivery stream, or a Lambda function. At larger scales, sending logs to Kinesis or Kinesis Firehose is more practical to prevent over-consumption of concurrency by the log-shipping function.
3. CloudWatch Metric Filters: These allow conversion of logs into metrics and alerts. Metrics can be created by selecting the log group and setting a filter pattern for the relevant log messages. Metrics are created based on the number of matched log messages or custom latency metrics.
4. CloudWatch Logs Insights: This feature offers query capability for log messages, allowing SQL-esque queries, sorting, stats generation, and visualization of search results. It also lets you query multiple log groups at once.

The limitations include inability to query logs across multiple log groups (although Logs Insights allows querying multiple log groups simultaneously), a cap of 100 metric filters per log group, and the inability to operate Logs Insights across account boundaries.

In conclusion, AWS CloudWatch Logs provide a powerful tool for monitoring and analyzing AWS Lambda functions, despite some limitations. Users are also encouraged to adopt good logging practices and consider tools like the open-source [dazn-lambda-powertools](https://github.com/getndazn/dazn-lambda-powertools) to enhance their logging experience.

### [Introducing an easier way to record custom metrics from Lambda](https://theburningmonk.com/2019/07/introducing-a-better-way-to-record-custom-metrics/)

Yan presents a new approach to recording custom metrics from AWS Lambda through asynchronous recording, aiming to overcome problems like added latency to invocations associated with synchronous methods. Traditional synchronous publishing of metrics can cause delays and fragility at integration points, particularly if CloudWatch experiences an outage or increased response time.

Although asynchronous recording also has drawbacks, like additional delay in seeing recent metric data, increased costs, and added complexity, Yan suggests using a Lambda function to process logs and turn them into metrics, which is more scalable for complex systems with numerous functions and custom metrics.

To facilitate easy recording of custom metrics asynchronously, Yan has published a new application to the Serverless Application Repository [`async-custom-metrics`](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~async-custom-metrics). The application, which can be deployed via the AWS console or as part of a CloudFormation stack with AWS SAM, allows users to record custom metrics by writing to stdout in a specific format. Once deployed, custom metrics can be recorded without adding latency to invocations, with values published as custom metrics in CloudWatch.

### [How to debug Lambda performance issues](https://medium.com/lumigo/how-to-debug-aws-lambda-performance-issues-57053db1caf9)

Services like Lumigo enhance the observability of serverless architectures, collecting ample information to understand the internal state of applications. While AWS X-Ray provides valuable services, Lumigo enhances these capabilities with more detailed recording and visualization features, helping to identify and resolve performance issues more effectively.

### [Debugging AWS Lambda timeouts](https://lumigo.io/blog/debugging-aws-lambda-timeouts/)

Yan is about debugging Lambda timeouts in serverless applications and the various methods to detect and mitigate them. Lambda timeouts can be challenging to identify and debug because Lambda does not report a separate error metric for timeouts, and there's usually multiple IO operations happening during an invocation.

Detecting timeouts can be done by looking at a function's Max Duration metric or by creating a custom metric with the pattern "Task timed out after". A more advanced method would be to use 3rd-party tools such as Lumigo which can detect Lambda timeouts in real-time.

![AWS Lambda Max Duration](https://lumigo.io/wp-content/uploads/2020/08/1_KIJdL0P3zyWiFNRX4R6SMw.png)

To find the root cause of the timeout, one way is to log a pair of START and END messages around every IO operation, though this might be challenging to scale for larger applications. A better method could be to use Amazon X-Ray to trace every operation performed, or using 3rd-party tools such as Lumigo that provide similar timeline views and more functionalities.

To mitigate Lambda timeouts, developers can timebox IO operations based on the remaining invocation time using `context.getRemainingTimeInMillis()`. For read operations, fallbacks to return previously cached responses can be used, while for write operations, retries can be queued up where applicable. These approaches allow developers to build more resilient serverless applications. See [Use ](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)`context.getRemainingTimeInMillis()`[ to adjust client-side request timeout based on actual invocation time left](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/) / [AWS Lambda — use the invocation context to better handle slow HTTP responses](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/).

![set timeout based on remaining invocation time](https://lumigo.io/wp-content/uploads/2020/08/set-timeout-based-on-remaining-invocation-time.png)

### [How to debug slow Lambda response time](https://lumigo.io/blog/debugging-slow-lambda-response-times)

Yan discusses how to debug Lambda response time issues effectively by maximizing telemetry data and using tools such as X-Ray or Lumigo. It first highlights how AWS Lambda provides scalability and redundancy by default, automatically scaling the number of workers running your code based on traffic.

Yan explains the key components that can contribute to the end-to-end request latency of an API built on AWS. These components include API Gateway, which typically has low latency overhead, Lambda functions, and DynamoDB. Yan points out the importance of tracking the latency of external services that Lambda functions integrate with and suggests looking at the API Gateway’s IntegrationLatency as a proxy for the total response time from Lambda.

![serverless latency onion layers dynamodb lambda api gateway](https://lumigo.io/wp-content/uploads/2020/09/serverless-latency-onion-layers-dynamodb-lambda-api-gateway.png)

Take the following latency spike as an example, everything moved apart from DynamoDB’s `SuccessfulRequestLatency`. What could possibly cause the caller-side DynamoDB latency to spike without affecting the underlying `SuccessfulRequestLatency`? We don’t know for sure, but a pretty good bet would be caller-side retries and exponential delays.

![lambda dynamodb api gateway latency spike](https://lumigo.io/wp-content/uploads/2020/09/lambda-dynamodb-api-gateway-latency-spike.png)

For monitoring and debugging, Yan recommends AWS X-Ray, but it also points out X-Ray's limitations, such as the lack of support for many async event sources and any TCP-based transactions. To address these issues, Yan suggests using third-party observability tools like Lumigo, which provides more sophisticated tools for complex serverless applications. Lumigo supports SNS, S3, Kinesis, and DynamoDB Streams, traces TCP-based transactions, and offers a transaction timeline. Moreover, Lumigo allows for viewing the transaction and Lambda logs side-by-side, offering a complete picture of what happens during a transaction. This can be useful for identifying poor-performing dependencies and debugging issues more quickly.

### [Serverless Observability: it’s easier than you think](https://lumigo.io/blog/serverless-observability-its-easier-than-you-think/)

AWS provides services like CloudWatch, CloudWatch Logs, and X-Ray that help build observability into serverless applications, but these fall short of the enhanced developer experience offered by vendors like Lumigo. However, AWS services can still provide good observability if their limitations are worked around, such as using reusable libraries for X-Ray, logging invocation events, capturing additional request/response data, and forwarding correlation IDs and logs. While these strategies require significant engineering time and coordination, they are feasible.

Yan suggests that if the decision is based on capabilities and developer productivity, a third-party service like Lumigo that fulfills most needs, supplemented with AWS services, might be the best approach. Using Lumigo has allowed Yan to focus more on solving business challenges and delivering projects on time and on budget.

Yan concludes that while building custom solutions for serverless observability can be an interesting challenge, third-party platforms like Lumigo make the process easier and allow businesses to focus on their unique value propositions.

### [Shine some light on your SNS to SQS to Lambda stack](https://lumigo.io/blog/sns-sqs-to-lambda-shine-some-light/)

The combination of SNS to SQS to Lambda is a common sight in serverless applications on AWS. Perhaps triggered by messages from an API function.

[![img](https://lumigo.io/wp-content/uploads/2022/08/sns-sqs-trace-01-1024x160.png)](https://lumigo.io/wp-content/uploads/2022/08/sns-sqs-trace-01.png)

This architecture is great for improving UX by offloading slow, asynchronous tasks so the API can stay responsive.

It presents an interesting challenge for observability, however. Because observability tools are **not able** to trace invocations through this combination end-to-end. In X-Ray, for example, the trace would stop at SNS. resulting in incomplete or fragmented visibility into application behavior.

TL, DR; use observability tools like Lumigo.

[![img](https://lumigo.io/wp-content/uploads/2022/08/sns-sqs-trace-02-1024x172.png)](https://lumigo.io/wp-content/uploads/2022/08/sns-sqs-trace-02.png)

### [Lambda Logs API: a new way to process Lambda logs in real-time](https://lumigo.io/blog/lambda-logs-api-a-new-way-to-process-lambda-logs-in-real-time/)

Lambda logs are outdated, Telemetry API supersedes it.

### [AWS Lambda Telemetry API: a new way to process Lambda telemetry data in real-time](https://lumigo.io/blog/lambda-telemetry-api-a-new-way-to-process-lambda-telemetry-data-in-real-time/)

This API, which replaces and improves upon the previously released Logs API, allows Lambda extensions to subscribe and receive telemetry data such as function logs, extension logs, events, metrics, and traces. The Telemetry API gives vendors more access to the Lambda execution environment, aiding them in building better tools.

One of the key features of the Telemetry API is its ability to run extensions after the function code finishes, without negatively impacting the user experience due to the "early return" feature introduced by AWS in 2021. This allows for background processing time that is billable, but not user-facing.

[![img](https://lumigo.io/wp-content/uploads/2022/10/telemetry-api-01-1024x475.png)](https://lumigo.io/wp-content/uploads/2022/10/telemetry-api-01.png)

The Telemetry API enables users to collect platform traces and performance metrics directly from Lambda, in addition to the logs collected by the Logs API. This feature allows, for example, metrics and traces to be converted to Open Telemetry format and sent to a vendor directly.

Lumigo, as an AWS launch partner, has updated its lambda-telemetry-shipper extension to utilize the Telemetry API. This update allows for easier detection of Lambda timeouts, and emits a custom CloudWatch Metric when a function times out. The extension is available in all AWS regions and can be installed via Lambda layer.

# AppSync

### [How to model one-to-many relationships with AppSync and DynamoDB](https://theburningmonk.com/2021/03/how-to-model-one-to-many-relationships-with-appsync-and-dynamodb/)

Yan provides insight on how to model a one-to-many relationship with AppSync and DynamoDB, focusing on a relationship from "Profile" to a property called "Tag" (from Appsync masterclass). The post also addresses how a "Tweet" can reference one or more of the user's own "Tags".

Yan emphasizes two important aspects to consider:

1. Representing the one-to-many relationship in the GraphQL model: For bounded arrays, Yan suggests modifying the "tags" array to prevent null return in the array. For unbounded arrays like "tweets", the advice is to return a TweetsPage type, which attaches the first page of a user's tweets and provides a method for fetching more.
2. Modeling the one-to-many relationship in DynamoDB: Yan advises to nest the array in the "Profile" object for a bounded array. However, for unbounded arrays, nesting wouldn't work due to DynamoDB's object size limits. Yan suggests two methods to tackle this issue: using a single-table design or putting them in a separate table, with a preference for the latter.

Using a separate table is seen as simpler due to fewer custom VTL code requirements, ease in understanding data in a table, ability to monitor costs for different tables, easier implementation of DynamoDB streams for data changes, and ease in restricting access to data in DynamoDB. Yan also mentions that GraphQL and AppSync are adept at stitching the data together.

### [How I built a social network in 4 weeks with GraphQL and serverless](https://theburningmonk.com/2020/11/how-i-built-a-social-network-in-4-weeks-with-graphql-and-serverless/)

GG.

### [Five reasons you should consider AppSync over API Gateway](https://lumigo.io/aws-serverless-ecosystem/aws-appsync-five-reasons-you-should-consider-it-over-api-gateway/)

1. **Cognito group-based authorization**: While API Gateway supports this feature, its implementation is complicated. On the other hand, AppSync makes it easy to implement group-based authorization.

2. **Request and Response validation**: API Gateway only provides request validation, and no support for response validation. In contrast, AppSync handles both request and response validation, and this validation is inherent in the GraphQL type definitions.

3. **Scalable WebSockets**: While API Gateway's WebSockets work fine for simple use cases, AppSync's subscriptions are easier to work with and can support millions of connected clients without requiring the developer to manage any connections themselves.

4. **Automated API documentation**: API Gateway's process for exporting API documentation is not as straightforward as desired. However, in GraphQL (and thus AppSync), the .graphql spec resulting from defining types, queries, and mutations is self-documenting.

5. **Integration with DynamoDB/ElasticSearch/RDS**: AppSync provides a more straightforward and less complicated process of integrating with other services such as DynamoDB, ElasticSearch, and RDS compared to API Gateway.

While API Gateway can achieve the same features, Yan argues that in every case, it requires significantly more effort than with AppSync. They share an example of a project where after struggling with API Gateway for a week, they were able to implement everything they needed and more with AppSync within a few hours. The conclusion is that AppSync, particularly for GraphQL-based APIs, can be more efficient and manageable than API Gateway.

### [AppSync: skipping nullable nested resolvers by returning early](https://theburningmonk.com/2020/04/appsync-skipping-nullable-nested-resolvers/)

The issue is related to handling nullable nested fields within the VTL (Velocity Template Language) template used by AppSync, specifically when needing to skip null values. [This helpful post](https://adrianhall.github.io/cloud/2019/01/03/early-return-from-graphql-resolvers/) which mentions `#return` keyword that lets you short-circuit a resolver execution and return early.

![img](https://theburningmonk.com/wp-content/uploads/2020/04/img_5e87d6afae4ee.png)

With this, I was able to work around the problem by adding just 3 lines of code to my request template.

```
#if ($util.isNullOrEmpty($context.source.coach))
  #return
#end

{
  "version" : "2017-02-28",
  "operation" : "GetItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($context.source.coach)
  }
}
```

### [AppSync: how to error on DynamoDB conditional check failures](https://theburningmonk.com/2020/04/appsync-how-to-error-on-dynamodb-conditional-check-failures/)

# AppSync: how to error on DynamoDB conditional check failures

To make an AppSync DynamoDB resolver throw exceptions on conditional check errors, we need to check `$context.error` in the response mapping template ourselves. Like this:

```
#if ( $ctx.error )
  #if ( $ctx.error.type.equals("DynamoDB:ConditionalCheckFailedException") )
    $util.error("your error message")
  #else
    $util.error($ctx.error.message, $ctx.error.type)
  #end
#end
$utils.toJson($context.result)
```

### [AppSync: how to compare strings lexicographically in VTL](https://theburningmonk.com/2020/05/appsync-how-to-compare-strings-lexicographically-in-vtl/)

https://stackoverflow.com/questions/49244281/lexicographic-compare-of-two-strings-in-velocity

### [AppSync: how to inject table names into DynamoDB batch & transact operations](https://theburningmonk.com/2020/07/appsync-how-to-inject-table-names-into-dynamodb-batch-transact-operations/)

When working with CloudFormation, AWS recommends not to give explicit names to resources and let CloudFormation name them for you. This has several advantages:

- It’s harder for attackers to guess resource names such as S3 buckets or DynamoDB tables.
- You can deploy the same stack multiple times to the same account. This is useful [when you use temporary stacks](https://theburningmonk.com/2019/09/why-you-should-use-temporary-stacks-when-you-do-serverless/) for developing feature branches or for running end-to-end tests in your CI pipeline.

However, this makes it harder for you to use AppSync’s batch or transact DynamoDB operations.

\*[serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin) has a built-in `substitutions` features which injects table names into DynamoDB batch & transact operations.

you need to define a `substitutions` attribute under `custom.appsync`like this:

```
substitutions:
  userTableName: !Ref UserTable
```

You will be able to reference this as `${userTableName}` in your VTL templates.

### [How I scaled an AppSync project to 200+ resolvers](https://theburningmonk.com/2020/07/how-i-scaled-an-appsync-project-to-200-resolvers/)

GG.

### [How to secure multi-tenant applications with AppSync and Cognito](https://theburningmonk.com/2021/03/how-to-secure-multi-tenant-applications-with-appsync-and-cognito/)

A common requirement in multi-tenant applications is to support different roles within each tenant and also restrict access to certain operations by role.

My preferred way of accomplishing all this is to:

1. Model roles as Cognito groups: AppSync can specify which users can perform which GraphQL operations, so you can use Cognito groups to represent roles within the application.
2. Model tenants as Cognito attributes: You can capture the tenant ID as a Cognito custom attribute. This way, the tenant ID would be available in the $context.identity.claims object for both VTL templates and Lambda resolvers. You need to set `AllowAdminCreateUserOnly` to true to ensure a new tenant is created by an admin user.
3. Never accept tenantId as an argument in the GraphQL schema: Tenant ID should not be taken as a request argument, it should always come from Cognito to ensure data access operations are secure.

![img](https://theburningmonk.com/wp-content/uploads/2021/03/img_605e03089d580.png)

### [Group-based auth with AppSync custom authoriser](https://theburningmonk.com/2021/09/group-based-auth-with-appsync-lambda-authoriser/)

While AppSync supports group-based authorization with Cognito out-of-the-box, this support does not extend to third-party identity services like Auth0 or Okta if they're connected via AppSync's OpenID Connect authorization mode.

Yan suggests using AppSync's Lambda authorizer for group-based authorization, which works differently from API Gateway's Lambda authorizer. The AppSync Lambda authorizer returns a payload to AppSync that contains custom attributes, such as tenant ID. This flag indicates whether the user is authorized to access the AppSync API, and can also specify which operations the user cannot access.

Yan explains how to implement group-based authorization using the Lambda authorizer, which involves maintaining a list of the GraphQL operations that each user group can access. This can then be used to build up the 'deniedFields' array.

Yan also discusses the decision between using Cognito or another identity provider. While Cognito's pricing model is favorable for businesses with many non-paying, transient users, it lacks many features offered by other identity providers, such as MFA, CAPTCHA, passwordless login flow, etc. However, the new AppSync Lambda authorizers have made implementing group-based authorization with third-party identity providers simpler.

### [How to model hierarchical access with AppSync](https://theburningmonk.com/2020/08/how-to-model-hierarchical-access-with-appsync/)

The challenge was modeling overlapping actions in the GraphQL schema, as actions differed depending on user roles.

1. Encapsulating each group into its own Query and Mutation types, which makes it easier to scale the complexity of the project. Each user group gets its own Query and Mutation types and access is controlled in one place. This solution also avoids the need to rely on naming conventions for overlapping actions.

Using separate Query and Mutation types for each user group can simplify the maintenance of the GraphQL schema as the project grows, without compromising the security model.

### [How to set up custom domain names for AppSync](https://theburningmonk.com/2020/09/how-to-set-up-custom-domain-names-for-appsync/)

Yan discusses two methods of setting up custom domain names for AWS AppSync: using CloudFront and using API Gateway.

1. **CloudFront**: Yan's preferred method, it's simple to set up and cost-effective. You create a CloudFormation resource to route traffic to your AppSync API. The configuration includes defining origins, enabling HTTP2, setting cache behaviors, and viewer certificates, among other properties. If you're using the Serverless framework, you can use the serverless-appsync-cloudfront plugin for easy configuration.
2. **API Gateway**: This method involves setting up an HTTP proxy that routes traffic to the AppSync API, and configuring a custom domain name in API Gateway. While it incurs higher cost and latency compared to CloudFront, it's another viable method. You can use the Serverless Application Model (SAM)'s macro AWS::Serverless-2016–10–31 to configure API Gateway in your serverless.yml.

For both methods, the final step involves configuring a Route53 record in your hosted zone. The custom domain (like dev.example.com) for your AppSync API will be accessible to users, making it more user-friendly and memorable.

### [How to sample AppSync resolver logs](https://theburningmonk.com/2020/09/how-to-sample-appsync-resolver-logs/)

Yan provides a solution for managing and sampling AppSync resolver logs effectively without incurring excessive costs. AWS AppSync offers in-built logging integration with CloudWatch Logs. The Field resolver log level can be set to NONE, ERROR, or ALL, with the ALL setting providing the most detailed information about requests, responses, and latency. However, setting log level to ALL sends a large volume of data to CloudWatch Logs, leading to significant costs.

One strategy to manage these costs is using Lambda functions to toggle the Field resolver log level between ALL and ERROR via a pair of cron jobs. This way, a balance between costs and visibility into the application's operations is achieved. The Lambda functions can be set to turn on resolver logging at the 8th minute of each hour, and turn it off at the 10th minute of each hour, capturing logs for roughly 3% of Query/Mutation operations.

If you wish to keep all logs in a development environment and only enable sampling in production, you can conditionally exclude the cron job functions for the development stage using the serverless-ifelse plugin.

Another recommendation is to set the log retention policy to avoid indefinite storage of logs, which also adds to costs. You can use a SAR (Serverless Application Repository) application to manage log retention for all your log groups.

An alternative strategy is to run a cron job every few minutes and have the Lambda function toggle the resolver log level, busy wait for around 10 seconds, and then switch it back. This method gives you logs for Query/Mutation requests for 10 seconds every few minutes instead of 2 minutes every hour.

### [How to monitor and debug AppSync APIs](https://lumigo.io/blog/how-to-monitor-and-debug-appsync-apis/)

AppSync offers a range of metrics, including the number of 4xx and 5xx errors, request latency, and API request numbers. However, these metrics, being aggregated at the API level, do not offer insights into the performance of individual resolvers.

To gain detailed visibility into resolvers, AppSync's logging feature can be activated. The "Field resolver log level" can be set to "All" to receive extensive log messages about each resolver's performance and tracing information. While these logs are valuable for debugging, they generate a large volume of data and can thus significantly add to costs when using CloudWatch Logs.

AppSync also integrates with AWS X-Ray, providing trace segments to help identify performance bottlenecks. However, X-Ray does not offer granular debugging information comparable to AppSync's detailed logs, and its traces are not organized for easy access to specific resolver data.

Lumigo aids in managing the data from AppSync's logs and X-Ray integration. Lumigo provides an interface to search through ingested AppSync data, making it simpler to locate information about specific resolvers or requests.

### [How to handle client errors gracefully with AppSync and Lambda](https://theburningmonk.com/2021/06/how-to-handle-client-errors-gracefully-with-appsync-and-lambda/)

In API Gateway and Lambda, client errors can be dealt with by returning a 4xx response. However, with AppSync and Lambda, the function has to either return a valid response or throw an error. Too many error alerts cause [alert fatigue](https://www.atlassian.com/incident-management/on-call/alert-fatigue).

Yan outlines a workaround that involves having the Lambda function return a specific response such as {error: {message: "blah blah", type: "SomeErrorType"}} and using a custom response VTL template to transform this into a GraphQL error. This ensures that the Lambda invocation is deemed successful and doesn’t trigger any alerts on Lambda errors.

Yan also addresses a control-flow challenge: always having to return something to the top-level function handler instead of throwing an error. A possible solution would be to explicitly capture the error state and always return something.

For greater convenience with Node.js functions, Yan recommends using a middy middleware to intercept specific errors and handle them. For instance, the middleware can handle a specific error in the onError handler. This approach means that a ValidationError can be thrown from anywhere in the code and it will not fail the Lambda invocation. Instead, it will be turned into a successful response. The response VTL template can then transform it into a GraphQL error.

# Kinesis

### [A self-healing Lambda function that adapts its throughput based on performance](https://theburningmonk.com/2019/05/a-self-healing-kinesis-function-that-adapts-its-throughput-based-on-performance/)

Yan presents a solution to a common problem of managing concurrent requests to multiple third-party APIs that have variable performance and restrictions such as rate limits. In the context of the financial services sector where data from numerous service providers is fetched daily, Yan proposes a self-adjusting, self-healing system based on AWS Lambda and Kinesis.

The proposed system uses a "ventilator" Lambda function to manage the flow of requests, fetches data slowly and steadily, adjusts the rate of requests based on the provider's API performance, and prevents fetching the same data more than once per day. To achieve these goals, each provider has its own Kinesis stream into which the records to fetch are enqueued. The ventilator function receives records in batches, fans them out to worker functions specific to each provider, and tracks processed records in a DynamoDB table.

![img](https://theburningmonk.com/wp-content/uploads/2019/05/img_5ce206cb74866.png)

The ventilator function's batch size can be adjusted dynamically based on the API response time. When response time rises, the batch size is reduced, and when the response time returns to normal, the batch size is gradually increased. In extreme cases, if the provider's API is still struggling with a batch size of 1, the Kinesis event source mapping can be temporarily disabled. The ventilator function is then periodically triggered by a CloudWatch schedule to check if the API response time has improved and if so, it re-enables the Kinesis stream.

![img](https://theburningmonk.com/wp-content/uploads/2019/05/img_5ce206ef92ae4.png)

This design makes use of the circuit breaker pattern applied to stream processing. This design approach ensures that the number of concurrent requests to third-party APIs is effectively managed to stay within their operational limits while maintaining system reliability. Yan includes a demonstration app, you can find the source code [here](https://github.com/theburningmonk/self-adjusting-kinesis-function-demo).

[Circuit breaker pattern](https://martinfowler.com/bliki/CircuitBreaker.html): the Circuit Breaker pattern is employed to wrap a function call that could fail due to the volatile nature of network calls, monitoring it for any failures.

When these failures reach a certain threshold, the circuit breaker "trips," and subsequent calls to the function return an error, without invoking the original function at all. The state of the circuit breaker, whether open (tripped and blocking function calls) or closed (allowing function calls), is determined by comparing the failure count to a set threshold. If the circuit is open, the protected call isn't made at all, avoiding further strain on resources.

An advanced version of this pattern, the self-resetting circuit breaker, is discussed. This variant attempts the protected call again after a certain interval and resets the circuit if successful. It introduces a third state, "half-open", where the circuit breaker is prepared to make a trial call to see if the original issue has been resolved.

### [3 Pro Tips for Developers using AWS Lambda with Kinesis Streams](https://read.acloud.guru/aws-lambda-3-pro-tips-for-working-with-kinesis-streams-8f6182a03113)

1. **Consider Partial Failures**: AWS Lambda and Kinesis will try to reprocess failing records until they expire. If some records fail persistently, it can halt the overall system. The developers should make an informed decision about how partial failures are handled to maintain real-time system flow. For instance, Yubl chose to prioritize system flow over processing every event, accepting that some events may fail and get discarded.
2. **Use Dead Letter Queues (DLQ)**: While AWS Lambda DLQ support does not extend to poll-based invocations like Kinesis, the concept can still be applied. Yan recommends a series of steps, including retries for failed events and sending these to a DLQ after exhausting retries. AWS Simple Notification Service (SNS) can be used to simplify this process, with Lambda processing events further before sending them to the DLQ.
3. **Avoid “Hot” Streams**: Yubl noticed that a Kinesis stream with 5 or more Lambda subscribers started showing throughput exceeded errors. Lambda sometimes lags behind, leading to unpredictable performance spikes. Increasing shards worsened the issue. Their solution was to apply the 'fan out' pattern, adding another layer of Lambda functions that distribute Kinesis events, even though it complicates partial failure handling and slows down event processing.

In conclusion, AWS Lambda and Kinesis require careful management to ensure system flow and performance. While powerful tools, developers need to account for potential partial failures, utilize Dead Letter Queues, and mitigate 'hot' streams.

### [Lambda and Kinesis — beware of hot streams](https://lumigo.io/blog/lambda-and-kinesis-beware-of-hot-streams/)

Yan examines the issues encountered when multiple Lambda functions are subscribed to a single Kinesis stream, particularly in the context of 'hot streams'. It starts by explaining that subscribing five or more functions to a Kinesis stream can lead to frequent ReadProvisionedThroughputExceeded errors. Although these errors do not need to be manually addressed as they are handled and retried by Lambda’s internal polling layer for Kinesis, they can cause occasional delays.

Yan then discusses the introduction of enhanced fan-out for Kinesis streams by AWS, which allows each function to perform five reads per second per shard, up to 2MB per second. To test if this improvement has mitigated the issue of hot streams, an experiment was conducted with up to 30 functions subscribed to a Kinesis stream. Results showed that ReadProvisionedThroughputExceeded errors increased linearly with the number of subscribers, however, the IteratorAge, which signifies when functions are lagging due to contention, was unaffected.

The experiment also found a new issue: after the first 15 functions were subscribed to the stream, it became increasingly difficult to deploy any subsequent functions due to ProvisionThroughputExceededException errors. This could prove to be a significant problem in a production environment, especially for companies relying on an automated CI/CD pipeline.

To address these challenges, Yan suggests considering design decisions such as:

1. Multiple Write Streams: Instead of subscribing multiple functions to one stream, events could be written to multiple streams. However, this could still lead to too many subscribers for one stream, loss of event order, and implicit coupling between event producers and consumers.

   ![A diagram comparing the one-stream approach to many streams](https://lumigo.io/wp-content/uploads/2019/05/Image-5.jpg)

2. Fan-Out to Multiple Reader Streams: A centralized stream could be used to [fan out events to multiple streams](https://www.linkedin.com/pulse/how-fan-out-amazon-kinesis-streams-alex-casalboni/). to multiple reader streams, allowing more flexibility and supporting the combination of different types of events in the same stream.

![A better approach is to push all events to a centralized stream and then use this technique to fan-out to multiple reader streams](https://lumigo.io/wp-content/uploads/2019/05/Image-7.jpg)

Despite the additional cost, Yan suggests focusing on the Total Cost of Ownership (TCO), as productivity and focus can often outweigh the cost savings on an AWS bill.

### [Auto-scaling Kinesis streams with AWS Lambda](https://read.acloud.guru/auto-scaling-kinesis-streams-with-aws-lambda-299f9a0512da)

Yan discusses a cost-effective approach to auto-scaling AWS Kinesis streams using AWS Lambda. The goal is to quickly scale up Kinesis streams in response to increased load and scale down under-utilized streams to save cost.

Rather than using polling CloudWatch metrics, which is often delayed and can have a cost impact, Yan suggests using a push-based approach with CloudWatch Alarms and SNS as a proxy to trigger a Lambda function. This can scale up the stream that has tripped the alarm faster.

Different metrics can be used to trigger auto-scaling, including WriteProvisionedThroughputExceeded, IncomingBytes, and IncomingRecords at both stream and shard levels. Each of these metrics has different benefits and complexities, and after each scaling activity, it's crucial to adjust the alarm thresholds.

Scaling up a Kinesis stream involves increasing the number of active shards. Two options are presented: using UpdateShardCount or SplitShard. While the first option is simpler, it has more limitations. The second option uses shard level metrics to split only the shards that have triggered the alarms.

To scale down a Kinesis stream, two adjacent shards are merged. However, since scaling down can potentially increase costs if done too often, Yan suggests using a cron job to scale down infrequently, like once every 36 hours.

A Lambda function is used to determine which Kinesis stream to scale down by analyzing throughput and metrics over the past 24 hours. If all data points are below 50% of the provisioned throughput, the stream is scaled down.

Finally, to set up the initial CloudWatch Alarms for a stream, Yan uses a repository hosting the configurations for all Kinesis streams. It contains a script for creating missing streams and associated CloudWatch Alarms using CloudFormation templates.

###

### [How to connect SNS to Kinesis for cross-account delivery via API Gateway](https://theburningmonk.com/2019/07/how-to-connect-sns-to-kinesis-for-cross-account-delivery-via-api-gateway/)

Yan presents a problem faced by DAZN, where microservices in their AWS account contend for the same regional limits such as the number of concurrent Lambda executions. The major issue was the high traffic and spiky pattern from sporting events which led to Lambda throttling events in the region.

Several solutions were proposed the chosen one being **Go direct from SNS to Kinesis (via API Gateway):** Instead of going through SQS and Lambda, an HTTPS endpoint could be subscribed to the third-party SNS topic. This eliminates Lambda from the process, but API Gateway has its own throttling and contention issues. You can find the source code for the demo project on GitHub [here](https://github.com/theburningmonk/sns-to-api-gateway-demo).

![img](https://theburningmonk.com/wp-content/uploads/2019/07/img_5d34e38c7ab32.png)

![img](https://theburningmonk.com/wp-content/uploads/2019/07/img_5d34e3b8838d6.png)

### [The best reason to use DynamoDB Streams is…](https://lumigo.io/blog/the-best-reason-to-use-dynamodb-streams-is/)

Yan discusses the key differences between AWS Kinesis Streams and AWS DynamoDB Streams.

Kinesis Streams is the de facto AWS solution for streaming and processing real-time events. It offers considerable flexibility for data processing, allowing Lambda functions to process events in real-time, shipping data to Amazon ElasticSearch or S3 via a Firehose Delivery Stream, running complex queries using Athena, and more. It scales using the number of shards with no upper limit, making it highly scalable. However, Kinesis Streams lacks an in-built auto-scaling mechanism, requiring custom solutions, and retains data for a default 24 hours, extendable up to 7 days for an additional fee.

On the other hand, DynamoDB Streams is typically used with Lambda, with no direct integration with Kinesis Firehose or Kinesis Analytics. It auto-scales the number of shards based on traffic and retains data for only 24 hours, with no option for extension. Unlike Kinesis, DynamoDB auto-scales the number of partitions for on-demand tables or provisioned capacity tables with auto-scaling enabled. However, DynamoDB Streams loses precise control of the concurrency of its subscriber Lambda functions. The pricing model is also different, charging only for the number of read requests. Notably, a DynamoDB Stream only contains events related to the entities in its table, modeled as domain events for DynamoDB.

![A table showing the key differences between Kinesis Streams and DynamoDB Streams.](https://lumigo.io/wp-content/uploads/2019/09/image.png)

In terms of choosing between the two, Yan suggests using DynamoDB Streams can help eliminate many distributed transactions from your system. This can simplify operations by reducing the complexities of managing distributed transactions. Despite Kinesis Streams being generally better for streaming real-time events, DynamoDB Streams can be more beneficial for certain applications.

![img](https://lumigo.io/wp-content/uploads/2019/09/Screenshot-2020-04-06-at-11.58.12.png)

We can remove the distributed transaction by using DynamoDB Streams instead of publishing to another Kinesis stream from the _add_user_ function.

![img](https://lumigo.io/wp-content/uploads/2019/09/Screenshot-2020-04-06-at-11.58.26.png)

# Misc

### [Lessons learned from running serverless in production for 5 years](https://lumigo.io/blog/lessons-learned-running-serverless-in-production/)

(This post seemed to have become the course Lambda best practices)

- Think about observability from the start.
- Use multiple AWS accounts.
- Don’t put secrets in plain text in environment variables.
- Follow the principle of least privilege.
- Monitor and optimize Lambda cold start performance.

### [How to load test a real-time multiplayer mobile game with AWS Lambda and Akka](https://tech.spaceapegames.com/2017/09/26/how-to-load-test-a-realtime-multiplayer-mobile-game-with-aws-lambda-and-akka/)

(meh)

### [AWS Lambda — build yourself a URL shortener in 2 hours](https://theburningmonk.com/2017/04/aws-lambda-build-yourself-a-url-shortener-in-2-hours/)

(meh)

### [Comparing Nuclio and AWS Lambda](https://theburningmonk.com/2019/04/comparing-nuclio-and-aws-lambda/)

(meh)

### [AWS SAM + Cloudformation macros, a patch made in heaven](https://theburningmonk.com/2019/05/aws-sam-cloudformation-macros-a-patch-made-in-heaven/)

While AWS SAM has been efficient in building applications, it lacks the customization flexibility of the Serverless framework due to the absence of a plugin system.

### [Using the power of CloudFormation custom resources for great good](https://theburningmonk.com/2019/09/how-to-use-the-power-of-cloudformation-custom-resources-for-great-good/)

Yan discusses the benefits and potential uses of CloudFormation custom resources in AWS. They can be used to enable functionalities not natively supported by CloudFormation, such as provisioning DataDog dashboards, running load tests with every CloudFormation stack deployment, or working with AWS resources like EventBridge.

### [24 open source tools for the serverless developer: part 1](https://aws.amazon.com/blogs/opensource/24-open-source-tools-for-the-serverless-developer-part-1/)

### Deployment frameworks

- [Serverless Framework](https://serverless.com/cli/)

- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)

- [AWS CDK](https://aws.amazon.com/cdk/)

- [Terraform](https://www.terraform.io/)

- [Claudia.js](https://claudiajs.com/)

- [Zappa](https://github.com/Miserlou/Zappa)

- [Architect](https://arc.codes/)

  ![overview of frameworks from opinionated to customizable](https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2020/02/28/cui_f1_750.png)

### Serverless Framework plugins

- [serverless-iam-roles-per-function](https://github.com/functionalone/serverless-iam-roles-per-function)
- [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) [serverless-esbuild](https://www.npmjs.com/package/serverless-esbuild) reduce deployment artifact size, reduce cold start
- [serverless-offline](https://github.com/dherault/serverless-offline) runs API Gateway locally `sls offline` , and similar to built-in `sls invoke local`
- [serverless-domain-manager](https://github.com/amplify-education/serverless-domain-manager) custom domain names for your APIs and Route53 record set
- [serverless-step-functions](https://github.com/serverless-operations/serverless-step-functions)
- [serverless-finch](https://github.com/fernando-mc/serverless-finch) `sls client deploy`, deploys a static website to an s3 bucket

### CLIs

- [org-formation](https://github.com/OlafConijn/AwsOrganizationFormation) manage your entire [AWS organization](https://aws.amazon.com/organizations/) using Infrastructure-as-Code (IAC
- [lumigo-cli](https://github.com/lumigo-io/lumigo-cli) `lumigo-cli list-lambda`, `analyze-lambda-cold-starts`, `powertune-lambda`

### [24 open source tools for the serverless developer: part 2](https://aws.amazon.com/blogs/opensource/24-open-source-tools-for-the-serverless-developer-part-2/)

### Libraries

- [docker-lambda](https://github.com/lambci/docker-lambda) a docker image that replicates the live AWS Lambda environment, used in `sls invoke local`

- [middy](https://github.com/middyjs/middy)

  [Middy](https://github.com/middyjs/middy) is a middleware engine for Node.js Lambda functions, and makes it easy for users to handle cross-cutting concerns and encapsulate them into middleware. More than 15 built-in middleware address common concerns, such as setting CORS headers in [Amazon API Gateway](https://aws.amazon.com/api-gateway/) responses.

  My favorites are the ssm and secretsManager middleware, which implement best practices for loading secrets into Lambda functions. My rule of thumb is never to store secrets in unencrypted form in environment variables, which is the first place an attacker would look if they manage to compromise my application, perhaps through a compromised or malicious dependency. Rather, my suggestion is to:

  1. Load the secrets from SSM or Secrets Manager during cold start.
  2. Cache the secret so you don’t have to read from source on every invocation.
  3. Set the secret to the `context` object, not the environment variables.
  4. Access secrets through the `context` object inside the handler code.

  ![Output showing: Access secrets through the context object inside the handler code.](https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2020/03/02/cui_f6_750.png)

- [dazn-lambda-powertools](https://github.com/getndazn/dazn-lambda-powertools) Among other things, it allows you to automatically capture and forward correlation IDs with many AWS services. Using these tools, your functions would automatically include correlation IDs in their logs.

### AWS Serverless Application Repository applications

- [lambda-janitor](https://go.aws/2t3rQ7a) clean up old, unused versions of your functions in the whole region. This

- [aws-lambda-power-tuning](https://go.aws/2NZ8dUW) eploys a Step Functions state machine that you can run to help you find the optimal memory setting for your functions. This is what powers the lumigo-cli’s `powertune-lambda` command. I recommend using the lumigo-cli as it takes care of deploying and upgrading this AWS Serverless Application Repository app to make sure you always run on the latest version of the app.

- [auto-subscribe-log-group-to-arn](https://go.aws/2tyBjDH)

- n; it automatically subscribes [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) log groups to the ARN you configure, which can be Lambda, [Amazon Kinesis](https://aws.amazon.com/kinesis/), [Amazon Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/), or [Amazon Elasticsearch Service (Amazon ES)](https://aws.amazon.com/elasticsearch-service/).

  Once deployed, it’ll subscribe all the existing CloudWatch log groups in the region to the configured destination right away. When you create a new log group either yourself or when you create a new Lambda function, the new log group would be subscribed to the destination automatically, too.

- [auto-set-log-group-retention](https://go.aws/2TAQhno)

- s closely related to auto-subscribe-log-group-to-arn, except it automatically updates the retention policy of log groups instead.

  By default, CloudWatch log groups are set to **Never Expire**. This has a cost implication as CloudWatch charges $0.03 per GB per month. It’s rarely useful to keep logs in CloudWatch Logs forever, especially if you are shipping logs somewhere else already.

- [sfn-callback-urls](https://go.aws/38KynD1) Step Functions lets you [implement callback patterns using task tokens](https://docs.aws.amazon.com/step-functions/latest/dg/callback-task-sample-sqs.html). But it’s tricky to use in some situations, such as sending an email with a callback link, which often necessitates adding an API Gateway and Lambda to handle the callback URL. The [sfn-callback-urls](https://go.aws/38KynD1) app makes it easy to do exactly that.

### [Tools to help you become a better serverless developer](https://lumigo.io/blog/seven-tools-help-become-better-serverless-developer/)

- [Dynobase](https://dynobase.dev/) is a professional GUI client for DynamoDB and is leaps and bounds better than the AWS console for managing DynamoDb tables and working with your data.

- [evb-cli](https://github.com/mhlabs/evb-cli). It’s a common-line tool for working with EventBridge and packs some very useful commands.

- If you use API Gateway or AppSync you likely have to deal with VTL templates. It’s not everyone’s cup of tea and most people struggle to write even basic business logic in VTL. But to get the best performance, scalability and cost efficiency out of API Gateway and AppSync you should be using their built-in integration with other AWS services (the so-called “functionless” approach). Unfortunately, that means writing VTL mapping templates.

  This is where the [Mapping Tool](https://mappingtool.dev/) by [Zac Charles](https://twitter.com/zaccharles) comes in. I

### [Creating and attaching an EFS file system](https://lumigo.io/blog/unlocking-more-serverless-use-cases-with-efs-and-lambda/)

Lambda platform has added a new arrow to its quiver – [the ability to integrate with Amazon Elastic File System](https://aws.amazon.com/blogs/aws/new-a-shared-file-system-for-your-lambda-functions/) (EFS) natively.

Until 2020, a Lambda function was limited to 512MB of /tmp directory storage. While this is sufficient for most use cases, it’s often prohibitive for use cases such as Machine Learning, as Tensorflow models are often GBs in size and cannot fit into the limited /tmp storage. Or maybe you’re processing large amounts (say, GBs) of data and need to store them in the /tmp directory for easier access. It unlocks many use cases for Lambda, which is hamstrung by various storage-related limitations today, such as the 250MB deployment package size limit or the 512MB /tmp storage limit. While these limits are generous for most use cases, they are often showstoppers for folks who are trying to run machine learning workloads on Lambda.

### [Lambda extensions: what they are and why they matter](https://lumigo.io/blog/aws-lambda-extensions-what-are-they-and-why-do-they-matter/)

This article, written by Yan Cui on October 8, 2020, announces the release of AWS Lambda Extensions by Amazon. AWS Lambda Extensions are designed to improve the observability of AWS customers' serverless applications, specifically by collecting telemetry data about AWS Lambda functions in a performant and cost-effective way.

Existing Application Performance Management (APM) solutions require the deployment of an agent or daemon to collect and send telemetry data. Prior to AWS Lambda Extensions, it was difficult to install these agents/daemons on Lambda due to constraints, leading to challenges for third-party vendors who had to choose between sending telemetry data at the end of each invocation or writing telemetry data to CloudWatch Logs, both of which have their disadvantages.

Lambda Extensions, however, are scripts that run alongside code, receiving updates about functions via a poll-based API. These can be internal (modifying the Lambda runtime environment and running in-process with code) or external (running in a separate process to code). They can impact the performance of functions, given they share the same resources - CPU, memory, storage, and network bandwidth. Lambda Extensions thus change the lifecycle of a Lambda Execution Environment with additional steps during initialization, invocation, and shut down. Lambda Extensions allow vendors to offer more comprehensive observability, security, and governance.

### [AWS Lambda: Function URL is live!](https://lumigo.io/blog/aws-lambda-function-url-is-live/)

In 2022 AWS has launched the Lambda Function URLs feature, which allows users to build REST APIs backed by Lambda functions without the need for API Gateway. This can significantly reduce costs for users who do not require the advanced features provided by API Gateway.

To create a function URL, users should enable the function URL box under Advanced settings when creating a new function. Function URLs have the structure https://{url-id}.lambda-url.{region}.on.aws, where the url-id is a randomly assigned ID.

The new feature uses the same schema format as API Gateway payload format 2.0, which means code does not need to be altered when switching from API Gateway to function URL. Function URLs can handle different HTTP verbs and URL paths.

Other features include basic request throttling, achievable via Lambda reserve concurrency, and custom domains through creating a CloudFront distribution and pointing it at the function URL.

However, for APIs that require advanced features like user authentication with Cognito User Pool, usage plans, or WebSockets API, users should still consider API Gateway. But for simpler APIs, the Lambda Function URLs feature can be a cost-saving option.

### [Welcome to 10GB of tmp storage with Lambda](https://lumigo.io/blog/welcome-to-10gb-of-tmp-storage-with-lambda/)

Since March 2022, AWS Lambda functions offer the ability to expand the size of their ephemeral storage from the standard 512MB to up to 10GB. The /tmp directory, which serves as the ephemeral storage, can be used for fast I/O operations and as a cache for data between invocations on the same Lambda worker instance. Prior to this, its use was limited due to a fixed size of 512MB.

The updated storage can be configured through multiple platforms such as CloudFormation, AWS CLI, AWS SDK, or the AWS console. Users will have to pay for the extra storage space, although the pricing details were not available at the time of the announcement.

The increase in storage does not have a significant impact on the performance of Lambda functions nor does it change the limit on the deployment package size (still 250MB). For larger files, users can package their function as a container image or download the large files during initialization and save them into the /tmp directory.

Using the ephemeral storage (i.e. the `/tmp` directory) differs from EFS in two major ways.

- Performance: EFS is a network file system and its read and write latency is therefore much higher (~5-10x) than the ephemeral storage.
- Data sharing: each Lambda function worker has its own instance of `/tmp` directory and they don’t share any data. Whereas with EFS, data is shared between all the components (Lambda functions, EC2 instances or containers) that are connected to the same EFS file system.

Lambda offers a number of storage options:

- Lambda Layers
- Ephemeral storage (`/tmp` directory)
- EFS
- Container images

They cater for different use cases and have different characteristics and limitations. James Beswick has an excellent article on how to choose between these options [here](https://aws.amazon.com/blogs/compute/choosing-between-aws-lambda-data-storage-options-in-web-apps/).

1. **Lambda Layers:** These allow for bundling of additional libraries as part of the Lambda function deployment package. A function can have up to five layers and this can be an effective way to bundle large dependencies. However, layers are static once deployed, and the contents can only be changed by deploying a new version.

2. **Temporary Storage with /tmp:** The Lambda execution environment offers a /tmp file system with a fixed size of 512 MB. This area acts as a transient cache for data between invocations and is cleared each time a new execution environment is created. It is intended for ephemeral storage and should be used for data required for a single invocation.

3. **Amazon EFS:** This is a fully managed, elastic, shared file system that integrates with other AWS services, and can be mounted in Lambda functions. It allows for sharing of data across invocations, supports standard file operations and is ideal for deploying code libraries or working with packages that exceed the limit of layers.

4. **Amazon S3:** This object storage service scales elastically, offering high availability and durability. Ideal for storing unstructured data such as images, media, log files and sensor data, it features event integrations with Lambda and allows for automated workflows.

### [Graviton-based Lambda functions, what it means for you](https://lumigo.io/blog/graviton-based-lambda-functions-what-it-means-for-you/)

Amazon Web Services (AWS) has introduced support for AWS Lambda functions powered by Graviton2 processors, a custom-built, 64-bit Arm-based processor with an improved price to performance ratio. When creating a new Lambda function, users can now choose to run their code on either x86_64 or arm64 architectures.

Graviton2-based Lambda functions are 20% cheaper and perform better than x86-based ones, according to AWS. They offer a price-performance improvement of up to 34%. However, it's essential to benchmark your workload as performance results may vary based on the workload you test.

Graviton2 is suitable for a wide range of workloads and allows users to make cost-effective decisions. For instance, Lambda functions that handle API requests and call DynamoDB or other AWS services can utilize Graviton2 for a better price without compromising user experience. Additionally, a Lambda function that trains Machine Learning models can run with thousands of concurrent executions to improve throughput.

Contrarily, for CPU intensive and time-sensitive workloads, like encoding customer-uploaded videos, it might be better to opt for x86 architecture for optimal performance, even if it is less cost-effective.

### [Package your Lambda function as a container image](https://lumigo.io/blog/package-your-lambda-function-as-a-container-image/)

AWS has added a new feature to its Lambda platform: the ability to package code and dependencies as container images. This allows for a more consistent toolset for tasks such as security scanning and code signing, and it also increases the maximum code package size to 10GB. The feature does not replace ECS or Fargate; Lambda's invocation model, with a maximum duration of 15 minutes, still applies.

Packaging the contents of a Lambda function as a container image rather than a zip file allows for the use of preferred Linux base images like Alpine or Debian. Container images can be up to 10GB, substantially larger than the 250MB limit on deployment packages. However, the 512MB storage limit on the /tmp directory still applies.

After a function has been deployed as a container image, it undergoes an optimization process before it can be invoked. If a function hasn't been invoked in over 14 days, it may be marked as INACTIVE and need to undergo the optimization process again upon the next invocation.

A few caveats to be aware of: Lambda features such as layers, code signing, and automatic patching with runtime updates aren't supported for functions packed as container images. And, idle functions may become temporarily inoperational as they need to be reoptimized.

**Container image support is designed to solve specific problems and might not be necessary for all users. However, for those who have large dependencies or who work in highly regulated environments that require consistent security standards, this could make Lambda a more attractive platform.**

**This update does not make EFS redundant. Although container images and EFS can both be used to navigate around limits on the deployment package size and /tmp directory space, there are important differences to note. EFS, for example, can provide virtually unlimited storage space but has much higher read and write latency compared to a local filesystem.**

### [How to work around CloudFormation circular dependencies](https://theburningmonk.com/2022/05/how-to-work-around-cloudformation-circular-dependencies/)

- replace one of the CloudFormation pseudo-functions in the circular dependency with a handcrafted string;
- rearchitect your solution and introduce a layer of indirection, such as an EventBridge bus or a DynamoDB Stream;
- capture the desired value as an SSM parameter and load it at runtime instead.

### [How to manage Route53 hosted zones in a multi-account environment](https://theburningmonk.com/2021/05/how-to-manage-route53-hosted-zones-in-a-multi-account-environment/)

Managing Route53 DNS records in a multi-account environment can pose challenges, especially when using infrastructure-as-code (IaC) tools such as CloudFormation, CDK, and Terraform, which do not span across multiple accounts. To overcome this issue, the suggested solution is to arrange domain names so that each account owns its own subdomain and can verify any Amazon Certificate Manager (ACM) requests it creates.

The process involves hosting the root domain in the master account, and then hosting a subdomain in each environment-specific account for dev, test, staging, prod, etc. The next steps involve noting the NS record that Route53 has created automatically for each subdomain, and creating a new NS record for each subdomain in the master account using the NS record values from the previous step. This effectively delegates the ownership of the subdomains to the corresponding AWS account's Route53 hosted zone.

To set up the hosted zones, manual setup may suffice for a small number of environments, but for scalability or more complex needs, using a tool like org-formation is recommended. This open-source tool enables you to manage your entire AWS Organization with a CloudFormation-like syntax. It also allows for cross-account references, simplifying the setup of the subdomains and the reference of their NS values in the master account. An example template is available for use.

# Yubl’s road to Serverless

### [part 2 : testing & continuous delivery strategies](https://theburningmonk.com/2017/02/yubls-road-to-serverless-architecture-part-2/)

In [Growing Object-Oriented Software, Guided by Tests](http://amzn.to/2jrKLxx), _Nat Pryce_ and _Steve Freeman_ talked about the 3 levels of testing

1. **Acceptance** – does the whole system work?
2. **Integration** – does our code work against code we can’t change?
3. **Unit** – do our objects do the right thing, are they easy to work with?

In the FAAS paradigm the **value of integration and acceptance tests are also higher than ever**.

In [Growing Object-Oriented Software, Guided by Tests](http://amzn.to/2jrKLxx), _Nat Pryce_ and _Steve Freeman_ also talked about why you shouldn’t mock types that you can’t change because…

> _…We find that tests that mock external libraries often need to be **complex** to get the code into the right state for the functionality we need to exercise._
>
> _The mess in such tests is telling us that the design isn’t right but, instead of fixing the problem by improving the code, we have to carry the **extra complexity** in both code and test…_
>
> _…The second risk is that we have to be sure that the behaviour we stub or mock matches what the external library will actually do…_
>
> _Even if we get it right once, we have to make sure that the tests **remain valid** when we upgrade the libraries…_

I believe the same principles apply here, and that you **shouldn’t mock services that you can’t change**.

Since the purpose is to test the integration points, so it’s important to configure the function to use the same downstream systems as the real, deployed code. If your function needs to read from/write to a _DynamoDB_ table then your integration test should be using the real table as opposed to something like [dynamodb-local](https://www.npmjs.com/package/dynamodb-local).

It does mean that your tests can leave artefacts in your integration environment and can cause problems when running multiple tests in parallel (eg. the artefacts from one test affect results of other tests). Which is why, as a rule-of-thumb, I advocate:

- avoid hard-coded IDs, they often cause unintentional coupling between tests
- always clean up artefacts at the end of each test

The same applies to acceptance tests.

_…Wherever possible, an **acceptance** **test** should exercise the system **end-to-end** without directly calling its internal code._

_An end-to-end test interacts with the system **only from the outside**: through its interface…_

_…We prefer to have the end-to-end tests exercise both the system and the **process by which it’s built and deployed**…_

Whilst we had around 170 _Lambda_ functions running production, many of them work together to provide different features to the app. Our approach was to group these functions such that:

- functions that form the endpoints of an API are grouped in a project
- background processing functions for a feature are grouped in a project
- each project has its own repo
- functions in a project are tested and deployed together

### [part 3 : ops](https://theburningmonk.com/2017/03/yubls-road-to-serverless-architecture-part-3/)

1. **NoOps != No Ops:** Yan points out that "NoOps", a term often associated with serverless technologies, doesn't mean you can entirely ignore Ops. Operations still exist, regardless of whether your software is running on VMs in the cloud, on-premise hardware, or as Lambda functions. The term "NoOps" to Yan implies no specialized ops team in the organization.

2. **Logging and Centralised Logging:** Logging is achieved using AWS CloudWatch Logs. When Lambda functions are created, their logs are sent to their respective Log Groups in CloudWatch. The ELK stack is used for centralizing logs from different Log Groups. To automate the process, a rule in CloudWatch Events can be set up to invoke a subscribe-log-group Lambda function for new Log Groups.

3. **Distributed Tracing:** For correlating logs from different services to understand all events that occurred during a single user request, correlation IDs are used. The handling of the initial user request flows through API calls, Kinesis events, and SNS messages, capturing and forwarding these correlation IDs.

4. **Monitoring:** Basic metrics can be obtained from CloudWatch. However, custom metrics can also be published to CloudWatch using the AWS SDK. To maintain less API latency overhead, metrics can be published as special log messages. Dashboards and alerts are set up in CloudWatch and Graphite, with opsgenie alerting the on-call person.

5. **Limitations of CloudWatch:** Yan suggests considering alternatives to CloudWatch due to its limited UI, customization, lack of advanced features, and metrics granularity.

6. **Config Management:** The initial approach was to add environment variables to Lambda functions, but as the number of functions increased, a centralised config service was adopted, using API Gateway, Lambda, and DynamoDB. Sensitive data are encrypted using KMS and stored in encrypted form.

7. **Conclusion:** The emergence of serverless technologies like AWS Lambda has simplified the skills and tools required for ops responsibilities. However, it also introduced new limitations and challenges that require new practices and tools to handle.

_NoOps to me, means **no ops specialization** in my organization – ie. no dedicated ops team – because the **skills and efforts required to fulfill the ops responsibilities do not justify the need for such specialization**. As an organization it’s in your best interest to delay such specialization for as long as you can both from a financial point of view and also, perhaps more importantly, because **[\*Conway’s law\*](http://www.melconway.com/Home/Conways_Law.html)** tells us that having an ops team is the surefire way to end up with a set of operational procedures/processes, tools and infrastructure whose complexity will in turn justify the existence of said ops team._
