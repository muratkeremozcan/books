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



### [Use ](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)`context.getRemainingTimeInMillis()`[ to adjust client-side request timeout based on actual invocation time left](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/) / [AWS Lambda — use the invocation context to better handle slow HTTP responses](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)

**API Gateway have a 30s max timeout** on all integration points. Serverless framework uses a default of 6s for AWS Lambda functions. This poses a problem hard coded timeout values in functions, when a function calls another function and so on, and the original function is waiting for a response.

Instead, we should **set the request timeout based on the amount of invocation time left**, whilst taking into account the time required to perform any recovery steps – e.g. return a meaningful error with application specific error code in the response body, or return a fallback result instead. You can easily find out how much time is left in the current invocation through the `context` object your function is invoked with using `context.getRemainingTimeInMillis()`.

With this approach, we get the best of both worlds: allow requests the best chance to succeed based on the actual amount of invocation time we have left; and prevent slow responses from timing out the function, which allows us a window of opportunity to perform recovery actions.

Check out [Netflix Hystrix](https://github.com/Netflix/Hystrix/wiki). Most of the patterns that are baked into *Hystrix* can be easily adopted in our serverless applications to help make them more resilient to failures

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



### [The best ways to save money on Lambda](https://theburningmonk.com/2022/07/the-best-ways-to-save-money-on-lambda/)

Cost = resources x duration x invocations

Do not allocate more memory (resources) than necessary. 

**You should always optimize the memory setting for functions that use provisioned concurrency**, because provisioned concurrency has an uptime cost per month per unit of concurrency.

Optimize the frequently invoked functions that have a long execution time (the 3%).

Use [aws-lambda-power-tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning). Install it [**here**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:451282441545:applications~aws-lambda-power-tuning). If you use Lumigo, you can sort your functions by cost.



### [Common Node8 mistakes in Lambda](https://serverless.com/blog/common-node8-mistakes-in-lambda)

The main idea is separating out the `await` to make use of concurrency, instead of premature awaiting and running things sequentially.

Example 1:

`teamModel.fetch` doesn't depend on the result of `fixtureModel.fetchAll`, so they should run concurrently.

```js
async function getFixturesAndTeam(teamId) {
  const fixtures = await fixtureModel.fetchAll()
  const team = await teamModel.fetch(teamId)
  return {
    team,
    fixtures: fixtures.filter(x => x.teamId === teamId)
  }
}
```

Here is how you can improve it. In this version, both `fixtureModel.fetchAll` and `teamModel.fetch` are started concurrently:

```js
async function getFixturesAndTeam(teamId) {
  const fixturesPromise = fixtureModel.fetchAll()
  const teamPromise = teamModel.fetch(teamId)
 
  const fixtures = await fixturesPromise
  const team = await teamPromise
 
  return {
    team,
    fixtures: fixtures.filter(x => x.teamId === teamId)
  }
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
  const promises = _.map(teamIds, id => teamModel.fetch(id))
  const teams = await Promise.all(promises)
  return teams
}
```

Example 3:
Async await inside forEach doesn't behave the way you'd expect it to:

```js
[ 1, 2, 3 ].forEach(async (x) => {
  await sleep(x)
  console.log(x)
})

console.log('all done.')

// you only get 
// all done.
```

The problem here is that `Array.prototype.forEach` does not wait for async functions to complete before moving on to the next iteration. If you want to execute an async function for each item in an array in a sequential manner (i.e., waiting for the previous async operation to complete before starting the next), you should use a `for...of` loop instead.

```js
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms * 1000)); 

async function processArray(array) {
  for (const item of array) {
    await sleep(item);
    console.log(item);
  }
  console.log('all done.');
}

processArray([1, 2, 3]);

```

Example 4:
Use AWS SDK’s .promise(). AWS SDK clients support both callbacks and promises. To use `async/await` with the AWS SDK, add `.promise()` to client methods like this:

```js
	
const AWS = require('aws-sdk')
const Lambda = new AWS.Lambda()
 
async function invokeLambda(functionName) {
  const req = {
    FunctionName: functionName,
    Payload: JSON.stringify({ message: 'hello world' })
  }
  await Lambda.invoke(req).promise()
}
```

Example 5:
Use node's promisify. Before Node8, [bluebird](http://bluebirdjs.com/docs/getting-started.html) filled a massive gap. It provided the utility to convert callback-based functions to promise-based. But Node8's built-in `util` module has filled that gap with the `promisify` function. For example, we can now transform the `readFile` function from the `fs` module like this:

```js
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
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

* Encapsulate the shared business logic into modules, and put them in a separate folder.
* In the Lambda handler functions, reference the shared modules using relative paths.
* Use webpack to resolve and bundle them into the deployment package. If you use the Serverless framework, then check out the [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin. (if webpack is not your thing then also check out the newer [serverless-esbuild](https://www.npmjs.com/package/serverless-esbuild) plugin which can achieve the same thing)

To see how everything fits together, check out [this demo repo](https://github.com/theburningmonk/lambda-monorepo-code-sharing-demo). I

### [When to use Lambda Layers](https://lumigo.io/blog/lambda-layers-when-to-use-it/)

Cons: trouble with devDeps & testing. Trouble with versioning when dealing with changes in the layers (no semantic ver). Limited to 5 layers per lambda.

Pro: may be useful for things that don't change like FFMpeg, and / or not available via npm, and very large. Lambda layers is still a good way to share large, seldom-changed files. For example, lambda runtimes for Lambda custom runtimes, or binary dependencies that aren’t distributed via NPM such as FFMPEG and MaxMind’s GeoIP database. The [Awesome Layers](https://github.com/mthenw/awesome-layers) list has a list of language runtimes and utilities (mostly binaries) that are available as Lambda layers.

`serverless-layers` is a handy npm plugin for optimization. Only uploads dependencies if they have changed. You take your dependencies from `package.json`, put them into a layer, and publish that layer to your account. The benefit is not having to upload the same artifacts over and over.

Although Lambda Layers is a poor substitute for package managers, it really shines as a way to optimize the deployment time of your application. By using something like the [serverless-layers](https://www.npmjs.com/package/serverless-layers) plugin you can bundle all of your dependencies as a Lambda layer and automatically update the Lambda functions to reference this layer. On subsequent deployments, if the dependencies haven’t changed, then there’s no need to upload them again. This produces a smaller deployment package and makes deployments faster. If you want to learn more about this pattern, then please give [this article](https://theburningmonk.com/2021/05/lambda-layer-not-a-package-manager-but-a-deployment-optimization/) a read.

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

### [SQS and Lambda: the missing guide on failure modes](https://lumigo.io/blog/sqs-and-lambda-the-missing-guide-on-failure-modes/)

Amazon SQS is a message queueing service. You can use SQS to decouple and scale microservices, [serverless](https://lumigo.io/debugging-aws-lambda-serverless-applications/) applications, and distributed systems. SQS makes it easy to store, receive, and send messages between software components. You can configure SQS queues as event sources for Lambda. Once you set this up, Lambda functions are automatically triggered when messages arrive to an SQS queue. Lambda can then automatically scale up and down according to the number of inflight messages in a queue. This means Lambda takes charge and automates tasks like polling, reading and removing messages from a queue.

1. No Dead Letter Queues (DLQs): Not configuring a DLQ when using SQS and Lambda is a common mistake. It can result in the 'poison message' problem where an invalid message is continuously retrieved, causing the SQS function to error. Always configure a DLQ for every SQS queue.

2. SQS Lambda Visibility Timeout Misalignment: It's important to align the SQS visibility timeout with the Lambda function's timeout, ideally setting the SQS visibility timeout greater than the Lambda function's timeout. Otherwise, if the SQS function has a higher timeout value, in-flight messages may be processed more than once.

3. Partial Failures: Partial failures are tricky to handle as messages are deleted only after the SQS function completes successfully. Solutions to handle this include using a batchSize of 1 or ensuring idempotency. However, both approaches have their own limitations such as lower throughput or increased system complexity.

4. SQS Over-scaling: Lambda auto-scales the number of pollers based on traffic, which can result in the SQS function using up too many available concurrent executions in the region, possibly leading to throttling of Lambda invocations. Mitigation strategies include increasing the concurrency limit, setting reserved concurrency on the SQS function, or implementing backpressure control in front of the SQS queue.

# Big picture questions

### [You are wrong about serverless and vendor lock-in](https://lumigo.io/blog/you-are-wrong-about-serverless-vendor-lock-in/)

The notion of serverless vendor lock-in is misunderstood. Rather than being a lock-in,t choosing a technology or service like serverless computing results in "coupling" rather than trapping users into a specific technology or provider. While moving away from a technology requires time and effort, it is always possible.

The perceived risk of being tightly coupled with a cloud provider is offset by the rewards. Using AWS Lambda as an example, the benefits are scalability, resilience, security, quicker time-to-market, and the ability to focus more on creating business value rather than dealing with infrastructural heavy lifting.

Be warned against focusing too much on portability and vendor lock-in arguments, as doing so often comes at the cost of missing out on provider-specific benefits and can reduce time-to-market. The author argues that getting to market earlier and iterating faster is more important than potential difficulties changing providers later.

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



### [The why, when and how of API Gateway service proxies](https://lumigo.io/blog/the-why-when-and-how-of-api-gateway-service-proxies/)

One of the very powerful and yet often under-utilized features of [API Gateway](https://lumigo.io/blog/tackling-api-gateway-lambda-performance-issues/) is its ability to integrate directly with other AWS services. For example, you can [connect API Gateway directly to an SNS topic](https://www.alexdebrie.com/posts/aws-api-gateway-service-proxy/) without needing a Lambda function in the middle. Or [to S3](https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html), or any number of AWS services. Particularly useful in removing Lambda from the equation, thereby eliminating limitations and overhead that comes with Lambda, such as cold starts, costs, and concurrency limits.

Using API Gateway service proxies is especially beneficial when a Lambda function merely calls another AWS service and returns the response, or when concerns exist about cold start latency overhead or hitting concurrency limits. However, users should keep in mind the additional functions a Lambda function might be fulfilling, such as logging useful contextual information, handling errors, applying fallbacks when an AWS service fails, and injecting failures into requests for chaos engineering purposes.

If users decide to implement API Gateway service proxies, they can use an open-source tool `serverless-apigateway-service-proxy`. This Serverless framework plugin simplifies creating service proxies and currently supports Kinesis Streams, SQS, SNS, and S3, with work in progress to support DynamoDB. The plugin also ensures the correct permissions are in place for the API Gateway, allows CORS and authorization customization, and enables request template customization.



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

1. *CloudTrail* captures the **CreateDeployment** request to *API Gateway*.
2. *CloudWatch Events* pattern against this captured request.
3. *Lambda* function to *a)* enable detailed metrics, and *b)* create alarms for each endpoint

The Serverless framework can create a function that automatically sets these alarms when a new API deployment is created. This function requires certain permissions and environment variables specifying SNS topics for the CloudWatch Alarms.

Yan also proposes extending the automation to include creating CloudWatch Alarms for 5xx errors for each endpoint and creating a CloudWatch Dashboard for the API. 



### [The API Gateway security flaw you need to pay attention to](https://theburningmonk.com/2019/10/the-api-gateway-security-flaw-you-need-to-pay-attention-to/)

The default method limits – 10k req/s with a burst of 5000 concurrent requests – matches your account level limits. As a result, **ALL your APIs in the entire region share a rate limit that can be exhausted by a single method**. It also means that, as an attacker, I only need to DOS attack one public endpoint. I can bring down not just the API in question, but all your APIs in the entire region. Effectively rendering your entire system unavailable.

While AWS's Web Application Firewall (WAF) can create rate-based rules that limit at the IP level, it has limitations. WAF can't fully protect against distributed DOS attacks from a botnet comprising thousands of hosts, or cope with 'low and slow' DOS attacks and can unintentionally block traffic from large institutions that share a single IP address. 

Yan suggests that individual rate limits should be applied for each method, but acknowledges that this requires consistent discipline from developers, something which is often lacking. Furthermore, there is currently no built-in support in the Serverless framework to configure these method settings. 

A solution might be to use a serverless-api-stage plugin or a custom rule in AWS Config to enforce rate limit overrides. Automated remediation like triggering a Lambda function after every API Gateway deployment could also be used. Using CloudFront as a CDN can also help reduce the traffic that reaches the API Gateway, but it comes with its own set of limitations and costs.

A premium service, AWS Shield Advanced, offers payment protection against extra costs incurred during an attack and provides access to the DDoS Response Team, but this may be too expensive for many startups. 

We need better tooling and support from Serverless framework and AWS to easily configure these rate limits. AWS should change the default behavior of applying region-wide limits or at least provide warnings to users about the risks involved.

Serverless framework plugin called `serverless-api-gateway-throttling` allows for easier configuration of default throttling settings and provides overrides for individual endpoints.

# Patterns

### [Applying the pub-sub and push-pull messaging patterns with AWS Lambda](https://hackernoon.com/applying-the-pub-sub-and-push-pull-messaging-patterns-with-aws-lambda-73d5ee346faa)

#### pub-sub

##### SNS + Lambda

Publish-Subscribe (pub-sub) is a decoupled messaging pattern where messages are transferred between publishers and subscribers through an intermediary broker such as ZeroMQ, RabbitMQ, or AWS SNS.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ea33tajnbxzzkzszusw1.png)

In the context of the AWS ecosystem, SNS (Simple Notification Service) acts as the broker, with Lambda functions acting as the receivers of the messages. Each SNS message triggers a new invocation of the subscribed Lambda function, enabling high levels of parallel processing. For instance, if 100 messages are published to SNS, there can be 100 concurrent executions of the Lambda function, optimizing throughput.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qnffunmxzq1w2dn6isfy.png)

However, challenges may arise due to limitations in the throughput capacities of downstream dependencies such as databases or other services. When a burst in throughput is brief, retries (with exponential back off) can usually handle any unprocessed messages, preventing message loss. However, if a burst is sustained or if a downstream dependency experiences an outage, the maximum number of retries may be exhausted, leading to message failure.

When message processing fails, these messages are sent to a Dead Letter Queue (DLQ) after two unsuccessful retries. Consequently, this situation may necessitate human intervention for message recovery. 

Additionally, the concurrent execution of Lambda functions is subject to an account-wide limit. A high number of concurrent executions could potentially impact other AWS Lambda-dependent systems like APIs, event processing, or cron jobs.

##### Kinesis + Lambda

Kinesis Streams and SNS (Simple Notification Service) are different AWS services that each have unique features and use cases.

Lambda interacts with these two services differently: it polls Kinesis Streams for records up to five times a second, while SNS pushes messages directly to Lambda. With Kinesis, records are received in batches up to a user-specified maximum. In contrast, SNS invokes the Lambda function with one message at a time.

If a Lambda function fails to process a batch of records from Kinesis (either due to an error or a timeout), the same batch of records will be received until they are successfully processed or the data is no longer available in the stream. The parallel processing capability in Kinesis is determined by the number of shards in the stream, as there is one dedicated invocation per shard. Kinesis Streams pricing is based on the number of records pushed to the stream, shard hours, and the optional enabling of extended retention.

Kinesis Streams can handle bursts in traffic and downstream outages more effectively than SNS. The maximum throughput is determined by the number of shards, maximum batch size, and reads per second, offering two levers to adjust the maximum throughput. Records are retried until success; unless the outage lasts longer than the retention policy on the stream (default is 24 hours), you will eventually be able to process the records.

However, there are also operational considerations with Kinesis Streams: it's charged based on shard hours, meaning a dormant stream incurs a baseline cost. Furthermore, it lacks built-in auto-scaling capability, necessitating additional management overhead for scaling based on utilization. It's possible to build auto-scaling capabilities yourself, though.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jrrf4h7wgkivyd3dwffw.png)

##### DDB Streams + Lambda

Lastly, AWS offers another streaming option, DynamoDB Streams, which provides another alternative to SNS and Kinesis Streams.

![img](data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27800%27%20height=%27308.77500000000003%27/%3e)![image](https://hackernoon.imgix.net/hn-images/1*3Wp0NTekhku5B6HdwpN2UQ.png?auto=format&fit=max&w=1920)

DynamoDB Streams can be used as an alternative to Kinesis Streams, offering similar functionality when used with AWS Lambda. There are some operational differences worth noting:

- DynamoDB Streams auto-scales the number of shards, simplifying management and scalability considerations. However, this could also lead to potentially overwhelming downstream systems during load spikes, as there's no control over the maximum number of shards a DynamoDB stream can scale up to.
- If you're processing DynamoDB Streams with AWS Lambda, the reads from DynamoDB Streams are free, although you still have to pay for the read & write capacity units for the DynamoDB table itself.
- Unlike Kinesis Streams, DynamoDB Streams does not offer the option to extend data retention to 7 days.

The choice between Kinesis or DynamoDB Streams depends largely on your system's "source of truth". If a row being written in DynamoDB defines the state of your system, then DynamoDB Streams may be a suitable choice. On the other hand, in an event-sourced system, where the state is modelled as a sequence of events, Kinesis streams could serve as the source of truth.

From a cost perspective, Kinesis Streams, despite a baseline cost, grows slower in cost with scale compared to SNS and DynamoDB Streams. However, these cost projections are based on the assumption of consistent throughput and message size, which may not reflect real-world usage.

Another consideration is the aws-lambda-fanout project from awslabs, which allows Lambda functions to propagate events from Kinesis and DynamoDB Streams to other services that cannot directly subscribe to these brokers due to account/region limitations or lack of support. While this approach is beneficial for some specific needs, it also introduces added complexities, such as handling partial failures and dealing with downstream outages or misconfigurations.

#### push-pull, aka fan-out/fan-in

The fan-out/fan-in or push-pull messaging pattern is essentially two separate patterns working in tandem. Fan-out delivers messages to a pool of workers in a round-robin fashion and each message is delivered to only one worker. This allows for parallel processing and increased throughput. In cases where an expensive task is partitioned into many subtasks, fan-in is required to collect results from individual workers and aggregate them.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xnt3hyqp2i2u4f05uiia.png)

##### fan-out with SNS

SNS’s invocation per message policy is an ideal fit for fan-out as it optimizes for throughput and parallelism. For instance, in the case of a social media app, when a user makes a post, the post can be distributed to the followers' timelines as separate subtasks.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/79ad31kesg4iposoda7q.png)

##### fan-out with SQS

SQS was traditionally used for this type of workload before AWS Lambda. Even though SQS is not directly supported as an event source for Lambda, it can still be a good choice for distributing tasks, especially if subtasks take longer than 5 minutes to complete, exceeding the maximum execution time for Lambda.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rxgm5zxerctvtjnw7pm2.png)

##### What about Kinesis or DynamoDB Streams?

Kinesis or DynamoDB Streams are not ideal options for fan-out since the degree of parallelism is constrained by the number of shards, and resharding is costly and lacks flexibility in DynamoDB Streams.

##### fan-in: collecting results from workers & tracking overall progress

Fan-in involves collecting results from workers. This could be done by storing results in DynamoDB or S3, depending on the size of the results. But it's important to note that both methods can lead to hot partitions if not properly mitigated with a GUID for the job ID.

To track the overall progress of tasks, the total number of subtasks should be recorded when the ventilator function partitions the task. Each invocation of the worker function can then atomically decrement the count until it reaches 0, signaling that all the subtasks are complete. The sink function or reducer can then aggregate the individual results. 

The push-pull pattern can be effectively implemented with AWS Lambda and provides a flexible solution for parallel processing of tasks and aggregating results.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d9wbyy15ccz69hsexz1m.png)



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

###  [A simple event-sourcing example with snapshots using Lambda and DynamoDB](https://theburningmonk.com/2019/08/a-simple-event-sourcing-example-with-snapshots-using-lambda-and-dynamodb/)

Discusses a simple event-sourcing example with snapshots using AWS Lambda and DynamoDB. In this demo, uses a banking application scenario where a user can create an account, check the balance, withdraw money, and credit the account.

The main aspects of the demo are:

1. Events: Each time an account holder interacts with the account (withdraws from or credits), an event is recorded. The current balance of the account is then derived from these events.

2. Snapshots: To avoid reading a large amount of data on every request, snapshots are created periodically. These snapshots capture the current state and allow limiting the number of rows that need to be fetched on every request.

3. Rebuilding the current state: The current state is rebuilt by finding the most recent snapshot and applying the events since the snapshot was taken.

4. Optimistic locking: To safeguard against concurrent updates to the account, the Version attribute is configured as the RANGE key. When an event is added to the DynamoDB table, the system checks that the version doesn't exist already.

5. Optimizations: The author suggests several optimizations, like enabling HTTP keep-alive for the AWS SDK, not referencing the full AWS SDK, and using webpack to bundle the functions.

6. Streaming events to other consumers: The author proposes two ways to stream these events to other systems - letting other services subscribe to the DynamoDB table's stream or creating another Kinesis stream and converting these DynamoDB INSERT events into domain events.

### [What’s the best event source for doing pub-sub with Lambda](https://theburningmonk.com/2018/04/what-is-the-best-event-source-for-doing-pub-sub-with-aws-lambda/)

Same article as [Applying the pub-sub and push-pull messaging patterns with AWS Lambda](https://hackernoon.com/applying-the-pub-sub-and-push-pull-messaging-patterns-with-aws-lambda-73d5ee346faa)



# Serverless framework

### [Top 10 Serverless best practices](https://datree.io/serverless-best-practices/)

 



1. **No Wildcards in IAM Role Statements**: To ensure your serverless applications are secure, avoid overprovisioning your functions with access. Adhere to the principle of least privilege by granting your functions only the minimal access they require.

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uqakykf9exwuulnq94db.png)

2. **One IAM Role per Function**: Instead of using a shared role for all the functions in the serverless.yml (which violates the principle of least privilege), use the `serverless-iam-roles-per-function` plugin to define IAM roles for each function.

3. **Configure DLQ for Async Functions**: Configure a separate Dead Letter Queue (DLQ) for each function invoked by async event sources  (see [here](https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html)). This way, if a function errors persistently, invocation events won't be lost.

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

`serverless-plugin-extrinsic-functions`  allows the use of custom functions anywhere in your serverless.yml as if they’re CloudFormation’s intrinsic functions. For instance, to implement the startsWith logic, one could simply use the Fn::StartsWith function.

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

***Update 07/04/2023:** Since I originally wrote this post, my preference has shifted to using **SSM Parameter Store** to share information between Terraform and the Serverless framework. This is preferable because:*

1. *The Serverless Framework has built-in support for reading data from SSM, with the **${ssm:/path/to/param}** syntax.*
2. *CloudFormation is used to provision resources, using it as a container for outputs is a misuse of CloudFormation.*
3. *Creating an SSM parameter is easier than a CloudFormation stack.*
4. *SSM supports SecretString, so you can use it to share sensitive data that should be encrypted at rest, e.g. API keys.*

*But you might ask “What about Secrets Manager instead of SSM?”. That is an option, but personally, I still prefer to use SSM Parameter Store over Secrets Manager in most cases, and [**here’s why**](https://theburningmonk.com/2023/03/the-old-faithful-why-ssm-parameter-store-still-reigns-over-secrets-manager/).*

### [How to make serverless framework boilerplates customizable](https://theburningmonk.com/2019/08/how-to-make-serverless-framework-boilerplates-customizable/)

**JS Proxy objects**: This approach allows you to create a boilerplate config where you can customize a field, even if it's deeply nested. This is accomplished by returning a Proxy that traps any attempt to access a property on the exported object. The property name is used to construct the actual config object. Additionally, you can return another Proxy from the first one to insert or update a property at an arbitrary location. For complex customization needs, you can create a scheme to support key-value pairs in a comma-separated fashion.

```js
const _ = require('lodash');

const template = {
  path: '/',
  method: 'get'
};

const handler = {
  get: function (obj, path) {
    const x = _.cloneDeep(obj);
    return () => new Proxy(x, {
      get: function (obj, value) {
        _.set(obj, path, value);
        return obj;
      }
    });
  }
}

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

1. **Using Reserved Concurrency:**  In AWS, you can use reserved concurrency on a Lambda function to process events from EventBridge. This method allows you to control the rate at which events are processed, which is beneficial when dealing with less scalable downstream systems. However, it has its limitations. Reserved concurrency might limit available concurrency for other functions in the same region, potentially throttling API functions and affecting the user experience. Also, it doesn't guarantee the order of event processing, and you might occasionally see duplicated invocations due to Lambda's at-least-once invocation semantic. You can mitigate this by tracking processed events using a unique ID in a DynamoDB table.

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y1j9jqehvswulcbcefek.png)

2. **Using EventSourceMapping with Kinesis Data Streams:** This method is suitable when you need to process events in the order they're received. You can control the concurrency of your application using the relevant settings on the EventSourceMapping without needing to use Lambda's reserved concurrency. In Kinesis, ordering is preserved within a partition key. This approach allows you to control the concurrency using a number of settings, including Batch Size, Batch window, and Concurrent batches per shard. 

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mtqxo1k867p9lymo8j97.png)

3. **Using EventSourceMapping with SNS FIFO and SQS FIFO:** This method is similar to the second one but involves using SQS FIFO with SNS FIFO for message handling. Like Kinesis, event orders are preserved within a group, identified by the group ID in the messages. AWS has recently introduced a max concurrency setting for SQS event sources, which helps solve the problem of using reserved concurrency for SQS functions. You can use EventSourceMapping for SQS to control the concurrency of your application without having to manage the Lambda concurrency units in the region manually.

   > With SNS FIFO, you can’t fan out messages to Lambda functions directly (see official documentation [here](https://docs.aws.amazon.com/sns/latest/dg/fifo-message-delivery.html)). This is why you always need to have SQS FIFO in the mix as well.

   ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/prnfc0ixxmwi9b7kjq82.png)

The article emphasizes the importance of these methods in managing concurrency in serverless applications, as improper management can lead to issues such as function throttling or improper order of event processing.

**Dynamic concurrency control in serverless applications**

This is an approach that allows an application to dynamically adjust its own concurrency based on external conditions.

Two main strategies are proposed:

1. **Metaprogramming:** Lambda functions can modify their own settings dynamically through API calls to the Lambda service. This allows them to react to external conditions, such as changes in response time and error rates from downstream systems, and adapt their concurrency settings accordingly. To ensure only one invocation can change the relevant settings at once, additional concurrency control measures are necessary.
2. **Using a Controller Process:** Instead of having each function adjust its own settings, a separate process can be used to manage them. This approach can distinguish between "blocking an ongoing execution from entering a critical section" and "not starting another execution at all". The author notes the trade-offs discussed in the Step Functions semaphore post, notably that locking an execution midway makes choosing sensible timeouts more challenging. However, with Step Functions, callback patterns can be implemented using task tokens, eliminating the need for polling loops in the middle of your state machine.

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

* Use lean imports; if you need just DDB, don't import the whole AWS SDK

* Prefer not to instrument the code if it can be helped (x-ray sdk)

* Use module bundlers (webpack, esbuild). But note that the impact in the experiments was not significant when the full AWS SDK was used. The greatest improvement was observed when only the DynamoDB client was required.

  > Yan says: I don't do bundling anymore, run into a few problems and it's changed my mind about bundling. Problem is with the source maps, for non-trivial projects, they get really big (affects cold start) and unhandled exceptions add quite a bit of latency (took seconds to get a 502 back in one API)



### [Improve latency by enabling HTTP keep-alive](https://theburningmonk.com/2019/02/lambda-optimization-tip-enable-http-keep-alive/)

> If you use the AWS SDK v3, you don't need to do this anymore, it's enabled by default now.

In the example this gave 70% boost...



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



### [All you need to know about caching for serverless applications](https://theburningmonk.com/2019/10/all-you-need-to-know-about-caching-for-serverless-applications/)

Caching remains essential in serverless architectures because while Lambda auto-scales by traffic, it has limitations in terms of concurrent executions. Caching not only helps deal with spiky traffic but also improves performance and cost-efficiency by reducing unnecessary roundtrips and the number of pay-per-use services.

Implement caching as close to the end-user as possible for maximal cost-saving benefits. This can be achieved in several places:

1. **Client-side caching**: Useful for data that rarely changes, it can be implemented using techniques like memoization, significantly improving performance.
2. **Caching at CloudFront**: CloudFront provides built-in caching capabilities which are very cost-efficient and can improve latency and user experience. CloudFront supports caching by query strings, cookies, and request headers, and it doesn't require any changes to application code.
3. **Caching at API Gateway**: Unlike CloudFront, which only caches responses to GET, HEAD, and OPTIONS requests, API Gateway caching allows for caching responses to any request. It gives greater control over the cache key. One downside is that it switches from pay-per-use pricing to paying for uptime.
4. **Caching in the Lambda function**: Data declared outside the handler function is reused between invocations. However, cache misses can be high, and there’s no way to share cached data across all concurrent executions of a function. For sharing cached data, Elasticache can be used but this involves added costs and requires the functions to be inside a VPC.
5. **DAX**: If using DynamoDB, DAX should be used for application-level caching as it allows the benefits of Elasticache without having to manage it.

In conclusion, caching is crucial for serverless applications to improve scalability, performance, and cost-efficiency. Depending on the specific use-case and requirements, caching should be implemented at different layers in the application, preferably starting from the client side to the server side.



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

### [The Old Faithful: Why SSM Parameter Store still reigns over Secrets Manager](https://theburningmonk.com/2023/03/the-old-faithful-why-ssm-parameter-store-still-reigns-over-secrets-manager/)

Storing secrets: SSM Parameter Store vs Secrets Manager

1. Cost-effectiveness: While the Secrets Manager charges usage costs and an uptime cost per secret, the SSM Parameter Store offers Standard parameters free of charge. The costs only arise for Higher Throughput mode and are comparable to Secrets Manager. However, it's crucial to manage these costs correctly to avoid unexpected charges.
2. Simplicity: The Secrets Manager offers built-in secret rotation, but it requires additional work from the developer to manage the process. With the SSM Parameter Store, it's easier to implement a custom rotation Lambda function and manage it with a custom EventBridge schedule.
3. Flexibility: Not all application configurations are sensitive and need encryption. The SSM Parameter Store can handle both plain text parameters and encrypted strings, making it more versatile.

However, there are specific cases where Secrets Manager is the better choice, such as:

- For multi-region applications that require cross-region replication of secrets.
- When working with large (> 8kb) secrets due to the SSM Parameter Store's limit of 8kb.
- In situations where secrets need to be shared cross-account.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fvnwa5fnh8vjrw99tad6.png)

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

Components with known vulnerabilities can be a major issue.  Be warned about potential threats posed by NPM publishers who might not be who they claim to be.  Yan further discusses the threat of injection and cross-site scripting attacks, sensitive data exposure, and problems with IAM permissions. Another major point of concern is the risk of Denial of Wallet (DoW) attacks. This is where attackers force an application to scale aggressively, causing significant financial cost.

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

The author concludes by emphasizing the need for improved tooling to help developers apply appropriate rate limits by default and calls for AWS to change the default behavior of applying region-wide limits on every method or provide warnings about potential risks. An update mentions a new Serverless framework plugin called `serverless-api-gateway-throttling` that allows users to configure default throttling settings for the API and override individual endpoint settings.



### [The case for and against Amazon Cognito](https://theburningmonk.com/2021/03/the-case-for-and-against-amazon-cognito/)

The case for Cognito:

1. Integration with other AWS services: Cognito integrates seamlessly with AWS services like API Gateway, AppSync, and ALB, which reduces the amount of custom code required. 

2. Cost: Cognito is significantly cheaper than competitors such as Auth0 and Okta, making it a more feasible choice for business-to-customer (B2C) businesses. For example, Cognito’s cost per monthly active user (MAU) is $0.0055, compared to Auth0’s cost of ~$0.02 per MAU for the Developer tier. 

The case against Cognito:

1. Poor developer experience:  lack of clear, detailed documentation and the need to understand different aspects of Cognito (User Pool, Identity Pool, Sync).

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

### 

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

### [You should sample debug logs in production](https://theburningmonk.com/2018/04/you-need-to-sample-debug-logs-in-production/)

Yan highlights the significance of sampling debug logs in production while working with AWS services like Lambda and CloudWatch. Typically, the log level is set to WARNING for production to manage traffic volume and to consider cost factors, such as the cost of logging, storage, and processing. However, doing so eliminates debug logs in production, which are critical for identifying the root cause of a problem. Without them, deploying a new version of the code to enable debug logging consumes valuable time and increases the mean time to recovery (MTTR) during an incident.

To mitigate this issue, Yan suggests sampling debug logs from a small percentage of invocations, representing a balance between having no debug logs and having all of them. This approach requires a logger that allows dynamic changes to the logging level and a middleware engine like middy.

Yan prefers to use a simple logger module, which offers structured logging with JSON, the ability to log at different levels, and control over the log level via environment variables. By using middy, a middleware can be created to dynamically update the log level to DEBUG for a certain percentage of invocations and then restore the previous log level at the end of the invocation.

In a microservices environment, it is crucial to ensure debug logs cover an entire call chain. To achieve this, the decision to turn on debug logging can be forwarded as a correlation ID, so the next function in the chain respects this decision and passes it on.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mk5jda0jljrzz18jqzpj.png)

### [Centralised logging for AWS Lambda, REVISED (2018)](https://theburningmonk.com/2018/07/centralised-logging-for-aws-lambda-revised-2018/)

Initially, Yan suggested using a Lambda function to ship all Lambda logs from CloudWatch Logs to a log aggregation service such as Logz.io. However, this method can create issues at scale, as it can potentially double the number of concurrently running functions in a region, exceeding the regional limit and causing cascade failures. One solution to this problem is setting the Reserved Concurrency for the log shipping function to limit its max number of concurrent executions. While this could prevent cascade failures, it runs the risk of losing logs when the log shipping function is throttled.

Instead of these measures, Yan proposes a more efficient approach at scale: streaming logs from CloudWatch Logs to a Kinesis stream first, and then processing them with a Lambda function to forward them to a log aggregation service. This method offers better control over the concurrency of the log shipping function, as the number of shards in the Kinesis stream can be increased with the growth of log events, thus also increasing the number of concurrent executions of the log shipping function. [demo repo](https://github.com/theburningmonk/lambda-logging-kinesis-demo) demonstrates how this new approach works, with functions that automatically update retention policies, subscribe new log groups to a Kinesis stream, process log events, and ship them to Logz.io.

In summary; stream the logs from CloudWatch Logs to a Kinesis stream first. From there, a Lambda function can process the logs and forward them on to a log aggregation service.

![img](https://theburningmonk.com/wp-content/uploads/2018/07/img_5b5523f6e52cf.png)



### [Tips and tricks for logging and monitoring AWS Lambda functions](https://theburningmonk.com/2017/09/tips-and-tricks-for-logging-and-monitoring-aws-lambda-functions/)

Discusses logging and monitoring in the context of serverless architecture using AWS Lambda. Many traditional logging practices are no longer applicable in the serverless world. AWS CloudWatch metrics and logs, commonly used for Lambda, have several shortcomings including adding user-facing latency, being only granular down to a 1-minute interval, and usually lagging in real-time updating.

Alternatives like Datadog and Wavefront, despite offering Lambda support, use the same metrics from CloudWatch and therefore have the same latency issues. IOpipe, another alternative, wraps around your code to inject monitoring code but this increases user-facing latency and can potentially cause function errors.

Yan suggests sending custom metrics asynchronously as a possible solution, as Datadog does by writing custom metrics as specially-formatted log messages. This approach can be used even with other monitoring services. Additionally, tracking the memory usage and billed duration of AWS Lambda functions can be done in CloudWatch through parsing REPORT log messages and publishing them as custom metrics.

Yan also highlights the importance of considering concurrency when using Lambda functions to process CloudWatch logs, to prevent exceeding the account-wide limit on concurrent executions which can lead to cascade failures throughout the application. The author suggests installing bulkheads, using fire-and-forget strategies, or sending the decoded log messages into a Kinesis stream to control parallelism as potential workarounds. H**owever, these solutions are considered temporary, as AWS has yet to provide better control over concurrent executions.**

### [Capture and forward correlation IDs through different event sources](https://theburningmonk.com/2017/09/capture-and-forward-correlation-ids-through-different-lambda-event-sources/)

Serverless architectures are microservices by default, you need correlation IDs to help debug issues that spans across multiple functions, and possibly different event source types – asynchronous, synchronous and streams. Correlation IDso tag every log message with the relevant context to help identify and trace each request that travels through multiple microservices. The objective is to make debugging and tracing easier in distributed systems.

![img](https://cdn-images-1.medium.com/max/1600/1*hlat_2akk4kxA_US-1bPSg.png)

If you want to follow along, then the code is available in this [repo](https://github.com/theburningmonk/lambda-correlation-id-demo), and the architecture of the demo project looks like this:

![img](https://cdn-images-1.medium.com/max/1600/1*DIhWeMy87eOfUdBDNLYM0w.png)

*The demo project consists of an edge API, api-a, which initialises a bunch of correlation IDs as well as the decision on whether or not to turn on debug logging. It’ll pass these along through HTTP requests to api-b, Kinesis events and SNS messages. Each of these downstream function would in turn capture and pass them along to api-c. A blueprint for how to capture and forward correlation IDs through 3 of the most commonly used event sources for Lambda.*

![img](https://cdn-images-1.medium.com/max/1600/1*CPtfxdmQQLUeK-g2l-2WLg.png)

Part 1 covers how to add correlation IDs to log outputs, HTTP requests, and SNS messages, enabling developers to follow the flow of requests across different services. It describes creating an "http" module that adds the correlation IDs to the headers and a "sns" module to add these IDs to message attributes. These modules modify the request headers or message attributes to include the correlation IDs without changing the actual payload, making it easy to follow a request through log files.

Part 2 focuses on Amazon Kinesis Streams and DynamoDB Streams, where it's not possible to tag additional information along with the payload. In these cases, it suggests altering the payload itself by inserting a "__context" field to carry the correlation IDs. For handling multiple Kinesis records, each with its own context, the suggested solution is to process records one at a time, thus managing the request context effectively for each record.

When receiving these events, the "__context" field can be removed, and the request context can be set accordingly. However, this method eliminates the chance to optimize by processing all records in a batch. Therefore, an alternative could be to leave the "__context" field on the Kinesis records and let the handler function manage them.



### [You should use the SSM Parameter Store over Lambda env variables](https://theburningmonk.com/2017/09/you-should-use-ssm-parameter-store-over-lambda-env-variables/)



### [Mind the 75GB limit AWS Lambda deployment packages](https://theburningmonk.com/2016/08/aws-lambda-janitor-lambda-function-to-clean-up-old-deployment-packages/#)



### [The good and bad of X-Ray and Lambda](https://read.acloud.guru/im-here-to-tell-you-the-truth-the-good-the-bad-and-the-ugly-of-aws-x-ray-and-lambda-f212b5f332e9)



### [Serverless observability: Lumigo or AWS X-Ray](https://lumigo.io/blog/serverless-observability-lumigo-or-aws-x-ray/)



### [Serverless observability brings new challenges to current practices](https://theburningmonk.com/2018/02/serverless-observability-brings-new-challenges-to-current-practices/)



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

# Kinesis

- [A self-healing Kinesis function that adapts its throughput based on performance](https://theburningmonk.com/2019/05/a-self-healing-kinesis-function-that-adapts-its-throughput-based-on-performance/)
- [3 Pro Tips for Developers using AWS Lambda with Kinesis Streams](https://read.acloud.guru/aws-lambda-3-pro-tips-for-working-with-kinesis-streams-8f6182a03113)
- [Auto-scaling Kinesis streams with AWS Lambda](https://read.acloud.guru/auto-scaling-kinesis-streams-with-aws-lambda-299f9a0512da)
- [AWS Lambda — how to use SNS to retry failed Kinesis events](https://medium.com/@theburningmonk/use-sns-to-retry-failed-kinesis-events-36e978782f05)
- [Lambda and Kinesis — beware of hot streams](https://lumigo.io/blog/lambda-and-kinesis-beware-of-hot-streams/)
- [How to connect SNS to Kinesis for cross-account delivery via API Gateway](https://theburningmonk.com/2019/07/how-to-connect-sns-to-kinesis-for-cross-account-delivery-via-api-gateway/)
- [The best reason to use DynamoDB Streams is…](https://lumigo.io/blog/the-best-reason-to-use-dynamodb-streams-is/)

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

