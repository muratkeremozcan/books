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



### [Use ](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)`context.getRemainingTimeInMillis()`[ to adjust client-side request timeout based on actual invocation time left](https://theburningmonk.com/2018/01/aws-lambda-use-the-invocation-context-to-better-handle-slow-http-responses/)

**API Gateway have a 30s max timeout** on all integration points. Serverless framework uses a default of 6s for AWS Lambda functions. This poses a problem hard coded timeout values in functions, when a function calls another function and so on, and the original function is waiting for a response.

Instead, we should **set the request timeout based on the amount of invocation time left**, whilst taking into account the time required to perform any recovery steps – e.g. return a meaningful error with application specific error code in the response body, or return a fallback result instead. You can easily find out how much time is left in the current invocation through the `context` object your function is invoked with using `context.getRemainingTimeInMillis()`.

With this approach, we get the best of both worlds: allow requests the best chance to succeed based on the actual amount of invocation time we have left; and prevent slow responses from timing out the function, which allows us a window of opportunity to perform recovery actions.

Check out [Netflix Hystrix](https://github.com/Netflix/Hystrix/wiki). Most of the patterns that are baked into *Hystrix* can be easily adopted in our serverless applications to help make them more resilient to failures



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



### [How to auto-create CloudWatch alarms for API Gateway, using Lambda](https://theburningmonk.com/2018/05/auto-create-cloudwatch-alarms-for-apis-with-lambda/)



### [The API Gateway security flaw you need to pay attention to](https://theburningmonk.com/2019/10/the-api-gateway-security-flaw-you-need-to-pay-attention-to/)



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

# Step Functions

- [Choreography vs Orchestration in the land of serverless](https://theburningmonk.com/2020/08/choreography-vs-orchestration-in-the-land-of-serverless/)
- [A practical guide to testing AWS Step Functions](https://theburningmonk.com/2022/12/a-practical-guide-to-testing-aws-step-functions/)
- [Step Functions: apply try-catch to a block of states](https://theburningmonk.com/2018/08/step-functions-apply-try-catch-to-a-block-of-states/)
- [Step Functions: how to implement semaphores for state machines](https://theburningmonk.com/2018/07/step-functions-how-to-implement-semaphores-for-state-machines/)
- [How the Saga pattern manages failures with AWS Lambda and Step Functions](https://theburningmonk.com/2017/07/applying-the-saga-pattern-with-aws-lambda-and-step-functions/)
- [How to do blue-green deployment for Step Functions](https://theburningmonk.com/2019/08/how-to-do-blue-green-deployment-for-step-functions/)



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