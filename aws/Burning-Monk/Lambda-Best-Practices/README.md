# Lambda best practices

## Performance

### Tuning function memory

https://aws.amazon.com/lambda/pricing/

Lambda memory allocation is the only way to control the performance and cost of our functions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2kym4dcu40nbmjqi2kw3.png)

We do not want to do manual tuning, but take advantage of the below utilities. Identify the sweet spot for you needs. It's a cost vs execution time decision.

1. [aws-lambda-power-tuning project](https://github.com/alexcasalboni/aws-lambda-power-tuning) - **KEY**

![image-20230413062546425](/Users/murat/Library/Application Support/typora-user-images/image-20230413062546425.png)

2. [Lumigo CLI](https://www.npmjs.com/package/lumigo-cli). Install via NPM by running "npm i -g lumigo-cli". Pick speed, balance or cost as strategy.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/08yu720zpsgnzv1sgqqj.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eqaoiwmmlyl4ts84153b.png)

#### [The best ways to save money on Lambda](https://theburningmonk.com/2022/07/the-best-ways-to-save-money-on-lambda/) (blog)

Cost = resources x duration x invocations

Do not allocate more memory (resources) than necessary.

**You should always optimize the memory setting for functions that use provisioned concurrency**, because provisioned concurrency has an uptime cost per month per unit of concurrency.

Optimize the frequently invoked functions that have a long execution time (the 3%).

Use [aws-lambda-power-tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning). Install it [**here**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:451282441545:applications~aws-lambda-power-tuning). If you use Lumigo, you can sort your functions by cost.

Also check out Yan's blog post [How to: optimize Lambda memory size during CI/CD pipeline](https://theburningmonk.com/2020/03/how-to-optimize-lambda-memory-size-during-ci-cd-pipeline/)

### What's in a cold start?

Click [here](https://levelup.gitconnected.com/aws-lambda-cold-start-language-comparisons-2019-edition-️-1946d32a0244) for the post on Lambda cost start comparison.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/we4nx1h8xyhxf85dse97.png)

You can use the Lumigo cli to analyze code start duration of your functions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/twpup4t2hrx7jz5lawi1.png)

### What effects the initialization time

Memory allocation doesn't effect initialization time during cold start. (Click [here](https://medium.com/@hichaelmart/shave-99-93-off-your-lambda-bill-with-this-one-weird-trick-33c0acebb2ea) for Michael Hart's article.)

Unused dependencies do not add to initialization time, but they can hurt your regional cold storage limit. (Use [lambda-janitor](https://serverlessrepo.aws.amazon.com/applications/us-east-1/374852340823/lambda-janitor) for that to delete the old versions of your lambda.)

**KEY**: It is faster to load dependencies from a layer, vs the deployment artifact.

**KEY**: The main optimization you can do to improve cold start is having less dependencies in your lambda handler code; require explicitly vs the whole package.

### Measuring cold start performance

You can initiate a lambda on the AWS console once, and then another time to measure the cold start time. Change an environment variable to reset cold starts. To scale cold start measurement we can use Lumigo cli.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hn8ixitknfygzo6vd2l3.png)

### Make cold starts faster - KEY

One option is using layers. (Click [here](https://lumigo.io/blog/lambda-layers-when-to-use-it/) to see when you should use Lambda layers.)

The other is requiring explicitly.

```js
// don't
const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB();

// do
const DynamoDB = require("aws-sdk/clients/dynamodb");
const dynamoDB = new DynamoDB();
```

Sls-wepback plugin can help with tree shaking and minification. It also helps to not need the layer.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/llbph089ki0v8jwlhnaq.png)

#### [Just how expensive is the full AWS SDK?](https://theburningmonk.com/2019/03/just-how-expensive-is-the-full-aws-sdk/) (blog)

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

  > Yan says: I don't do bundling anymore, run into a few problems and it's changed my mind about bundling. Problem is with the source maps, for non-trivial projects, they get really big (affects cold start) and unhandled exceptions add quite a bit of latency (took seconds to get a 502 back in one API). For reference [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) [serverless-esbuild](https://www.npmjs.com/package/serverless-esbuild).

### Provisioned Concurrency KEY

[Provisioned Concurrency - the end of cold starts](https://lumigo.io/blog/provisioned-concurrency-the-end-of-cold-starts/#:~:text=Once%20enabled%2C%20Provisioned%20Concurrency%20will,at%20lunch%20and%20dinner%20time.) : Once enabled, Provisioned Concurrency will keep your desired number of concurrent executions initialized and ready to respond to requests. This means an end to cold starts!

Mind that when provisioned concurrency happens, the init duration does not seem to change. It still happens, but happens ahead of time; that's why it feels much faster but still reports a high duration.

**Difference between Provisioned Concurrency and warm starts**: It's about the instances. Warm start is 1 instance of the lambda, and the rest still cold start. P.C. can be set to scale

From Yan:
_The actual problem with warm starts is that they don't scale beyond keeping a handful of instances of your functions warm because there's no way to direct an invocation to specific instances (ie. worker) of a function. So if you have a handful of functions and you just need to keep 1 instance of each warm for a low throughput API, then warmers are a good, cheap way to do it compared to using Provisioned Concurrency. But if you need an enterprise-scale solution that can keep 50, 100 instances of your functions warm, and auto-scale the no. of warm instances based on traffic patterns or based on a schedule, and you don't mind (potentially) paying extra for these, then use Provisioned Concurrency. I said potentially paying extra, because Provisioned Concurrency can actually work out cheaper than on-demand concurrency if you have good utilization of the Provisioned Concurrency you have (~60% is the break-even point)._

> P.C. happens against a version

When to use Provisioned Concurrency?

* When we cannot optimize cold start any further.

* Cold starts are stacking up in a service call (spiky traffic).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q025m29weskbfzithk44.png)

After invoking the function with Test, things can be verified in Cloudwatch metrics.
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qnqhvglv82rxhiiaviay.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3002eixqcf2o32krwj5u.png)

### When to use Provisioned Concurrency

Let's say you optimized your lambdas (requiring less, webpack...), and cannot optimize further.

Maybe you have so many services and cold starts add up.

You may be reaching the regional concurrency limit and get throttled (3000 US West, East, EU west, 1000 Asia, 500 other regions).

Provisioned concurrency can solve that problem
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8xc35tbqlsdehu5nteos.png)

#### Limitations

Cannot use $LATEST alias.

It consumes regional limit.

#### When to use

- Optimization can't help you reach performance target
- Cold starts would likely stack
- Traffic is spiky

### Enable HTTP keep-alive (node) - **KEY**

> If you use the AWS SDK v3, you don't need to do this anymore, it's enabled by default now.

[Blog post - Improve latency by enabling HTTP keep-alive](https://theburningmonk.com/2019/02/lambda-optimization-tip-enable-http-keep-alive/).
In the example this gave 70% boost...

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1v6ymm4yc2bmpofatbaa.png)

You can also set it in code:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u5bppsgp2gklmcpgrfo8.png)

### Process data in parallel (node) - **KEY**

The difference below is half the time.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ejkpbzt47r4fqai8srz8.png)

vs

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nicx4bosev128k2w3n3r.png)

## Scalability

### Fan-out pattern

Used to improve the throughput of our system. The goal is to keep pace with the number of messages coming in, by increasing the concurrency.

In this pattern, we have a ventilator that splits a large task into smaller tasks and distributes them across a pool of workers.

Lambda auto scales the number of executions for the workers. But for the ventilator, we have to decide what do we use as the queue between the function that splits up the large task and the individual workers. We have many choices for that.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8i2c9t4gozoo940okmqh.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/glv8qht3g0v5cgbh7u66.png)

One thing to consider is cost. For low throughput, Kinesis might be expensive because it has a base cost.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gdxeu0fxhr43fn5izzx2.png)

At scale, Kinesis can be profitable.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lhmmtz0qrv3701gvjl0n.png)

The other consideration is how quickly does concurrency go up with the rate of messages.

For example with SNS and EventBridge, concurrency grows linearly with the number of messages. As soon as we send a message to SNS, we trigger the subscriber. If we publish 100 messages concurrently, it will in turn create 100 executions of our worker function. There is no batching.

For SQS, the lambda concurrency is determined by the number of pollers the lambda service runs on your behalf; 5 to 60 to 1000 pollers.
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0fjwkv47fygkdov2tr0x.png)

Compared to SNS and EventBridge, with SQS the concurrency of the worker lambda function will go up more gradually.

With Kinesis, we have 1 execution for every shard, so the concurrency goes up in discrete steps.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dmavd52cuzcfljb08wix.png)

Step functions are useful for modeling fan out as well as fan in.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r5ss3cdwql32h1rxtkn4.png)

Click [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/cloudwatch-limits-eventbridge.html) for EventBridge service limits.

Click [here](http://amzn.to/2EM3bI9) for Lambda scaling behaviour.

Click [here](https://amzn.to/2RudmGV) for how Lambda works with SQS.

### Controlling concurrency

Suppose we have a downstream system that just can't keep up with the scaling.
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1gioxd5lwdjyui8s494f.png)

With fan-out, there are cases where we want to control the concurrency, and instead of scaling we want to push to work into a backlog.

Plausible case: the spike errors are retried.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w36d1785bcmyij4qs076.png)

If the spike persists, and the retries are also fail. When the retries are exhausted, we rely on the dead letter queue to capture the failed messages so we don't lose them.  
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/63op93m1fds1oc7p0udl.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vvtljqv82l7qjh7um9o8.png)

With Kinesis any spikes in traffic is amortized and will be processed later.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jcoml8pu13lik0imxksh.png)

With SNS and Eventbridge, If there is an outage, all the failed messages require human intervention with dead letter queue.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zw5c9iu17xj6n2ft2x23.png)

With Kinesis the workers pick up where they left off once the outage is over.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s86jk2vg8x7bmp52wm9q.png)

Click [here](https://theburningmonk.com/2019/05/a-self-healing-kinesis-function-that-adapts-its-throughput-based-on-performance/) to see my article on self-healing Kinesis function. [A self-healing Lambda function that adapts its throughput based on performance](https://theburningmonk.com/2019/05/a-self-healing-kinesis-function-that-adapts-its-throughput-based-on-performance/)

Click [here](https://lumigo.io/blog/amazon-builders-library-in-focus-4-avoiding-insurmountable-queue-backlogs/) to see summary of "Avoiding insurmountable queue backlogs".

Click [here](https://lumigo.io/blog/amazon-builders-library-in-focus-2-using-load-shedding-to-avoid-overload/) to see summary of "Using load shedding to avoid overload".

### When to use API Gateway service proxies?

In AWS, an API Gateway proxy is a type of integration that allows you to create a single, unified interface for your backend resources, such as AWS Lambda functions, HTTP endpoints, or other AWS services. The proxy integration enables the API Gateway to forward incoming requests to the specified backend resource and return its response to the caller, without the need for extensive configuration or request/response mapping.

When using the proxy integration, the API Gateway acts as a "passthrough" for the request, meaning that it forwards the entire request and its headers, query parameters, and body to the backend resource. Similarly, it returns the backend's response without any modifications, unless you configure additional processing through middleware or other configurations.

When you are concerned about cold start overhead (and Provisioned concurrency has already been considered) , or burst limit, consider API gateway service proxies.

What you lose:

- Retry and exponential backoff
- Contextual logging from the function
- Error handling & Fallbacks
- Tracing
- Chaos tools
- You might have to use VTL

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8wohhrnr1pvjompcrjuq.png)

#### [The why, when and how of API Gateway service proxies](https://lumigo.io/blog/the-why-when-and-how-of-api-gateway-service-proxies/)

One of the very powerful and yet often under-utilized features of [API Gateway](https://lumigo.io/blog/tackling-api-gateway-lambda-performance-issues/) is its ability to integrate directly with other AWS services. For example, you can [connect API Gateway directly to an SNS topic](https://www.alexdebrie.com/posts/aws-api-gateway-service-proxy/) without needing a Lambda function in the middle. Or [to S3](https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html), or any number of AWS services. Particularly useful in removing Lambda from the equation, thereby eliminating limitations and overhead that comes with Lambda, such as cold starts, costs, and concurrency limits.

Using API Gateway service proxies is especially beneficial when a Lambda function merely calls another AWS service and returns the response, or when concerns exist about cold start latency overhead or hitting concurrency limits. However, users should keep in mind the additional functions a Lambda function might be fulfilling, such as logging useful contextual information, handling errors, applying fallbacks when an AWS service fails, and injecting failures into requests for chaos engineering purposes.

If users decide to implement API Gateway service proxies, they can use an open-source tool [`serverless-apigateway-service-proxy`](https://github.com/horike37/serverless-apigateway-service-proxy). This Serverless framework plugin simplifies creating service proxies and currently supports Kinesis Streams, SQS, SNS, and S3, with work in progress to support DynamoDB. The plugin also ensures the correct permissions are in place for the API Gateway, allows CORS and authorization customization, and enables request template customization.

Click [here](https://github.com/ToQoz/api-gateway-mapping-template) for the api-gateway-mapping-template project.

### Load testing

#### (from Testing Serverless Architectures)

Performance test that simulate heavy workload to measure a system's performance and identify bottlenecks or other issues.

Load pattern should be realistic. (Ex: no need to hammer the login endpoint if users login once every few weeks...)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f6la7rk1tc93sjjk1efd.png)

Serverless gives you a lot of scalability out of the box. But it's not free, and it's not infinitely scalable. You still have to worry about service limits (regional limit on API Gateway # of requests/sec, regional limit on lambda concurrency).

Architect with service limits in mind. Load test to make sure.

When load testing, ensure to have a gradual increase because we may run into lambda throttling. Instead of unrealistic sharp spikes, simulate a gradual increase.

Test realistic user journeys, not individual functions. Otherwise all you are testing is AWS. Don't forget to load test the asynchronous parts of the system.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tellu3asexos2q1hztct.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9qdl4w7loazdkv485mgq.png)

Click [here](https://docs.aws.amazon.com/lambda/latest/dg/scaling.html) for the official AWS documentation on Lambda's scaling behavior.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ypjneayqnjcq7q23g8zz.png)

Commonly perceived performance standard for web apps:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dusvoujiec2gowwb13aq.png)

## Security

### Principle of least privilege (from [Top 10 Serverless best practices](https://datree.io/serverless-best-practices/))

**No Wildcards in IAM Role Statements**: To ensure your serverless applications are secure, avoid overprovisioning your functions with access. Adhere to the principle of least privilege by granting your functions only the minimal access they require.

**One IAM Role per Function**: Instead of using a shared role for all the functions in the serverless.yml (which violates the principle of least privilege), use the [`serverless-iam-roles-per-function`](https://www.npmjs.com/package/serverless-iam-roles-per-function) plugin to define IAM roles for each function.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n1zci924pyvulh7ouha5.png)

Click [here](https://iam.cloudonaut.io/) for the Complete AWS IAM Reference.

### Secret management (blog [The Old Faithful: Why SSM Parameter Store still reigns over Secrets Manager](https://theburningmonk.com/2023/03/the-old-faithful-why-ssm-parameter-store-still-reigns-over-secrets-manager/))

Storing secrets: SSM Parameter Store vs Secrets Manager

1. Cost-effectiveness: While the Secrets Manager charges usage costs and an uptime cost per secret, the SSM Parameter Store offers Standard parameters free of charge. The costs only arise for Higher Throughput mode and are comparable to Secrets Manager. However, it's crucial to manage these costs correctly to avoid unexpected charges.
2. Simplicity: The Secrets Manager offers built-in secret rotation, but it requires additional work from the developer to manage the process. With the SSM Parameter Store, it's easier to implement a custom rotation Lambda function and manage it with a custom EventBridge schedule.
3. Flexibility: Not all application configurations are sensitive and need encryption. The SSM Parameter Store can handle both plain text parameters and encrypted strings, making it more versatile.

However, there are specific cases where Secrets Manager is the better choice, such as:

- For multi-region applications that require cross-region replication of secrets.
- When working with large (> 8kb) secrets due to the SSM Parameter Store's limit of 8kb.
- In situations where secrets need to be shared cross-account.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fvnwa5fnh8vjrw99tad6.png)

Click [here](https://aws.amazon.com/secrets-manager/pricing) for Secrets Manager pricing. Click [here](https://aws.amazon.com/systems-manager/pricing/#Parameter_Store) for SSM Parameter Store pricing.

Click [here](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_limits.html) for Secrets Manager limits.

Click [here](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-throughput.html) for SSM Parameter Store's user guide on throughput tiers.

**Distribution of secrets:** secrets should never be in plain text in env variables

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2axsk5ht29nlgharqqet.png)

Instead fetch at cold start, cache & invalidate every x minutes

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j53f24wdl0fnfcgs0fbd.png)

Middy has a middleware that helps with that

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6459l8xue1k3mnxdtj6e.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jyw82ifnd1rkarw44o3h.png)

### API Gateway

The max requests per second for a default API gateway is set to 10k, which is also the default for the region. If an attacker attacks 1 api, therefore they can take out the entire region by reaching the limit. So limit the maxRequestsPerSecond.

Click [here](https://github.com/DianaIonita/serverless-api-gateway-throttling) for the serverless-api-gateway-throttling plugin.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i1guf7cwoaoxwxreicgs.png)

### [The API Gateway security flaw you need to pay attention to](https://theburningmonk.com/2019/10/the-api-gateway-security-flaw-you-need-to-pay-attention-to/) (blog)

The default method limits – 10k req/s with a burst of 5000 concurrent requests – matches your account level limits. As a result, **ALL your APIs in the entire region share a rate limit that can be exhausted by a single method**. It also means that, as an attacker, I only need to DOS attack one public endpoint. I can bring down not just the API in question, but all your APIs in the entire region. Effectively rendering your entire system unavailable.

While AWS's Web Application Firewall (WAF) can create rate-based rules that limit at the IP level, it has limitations. WAF can't fully protect against distributed DOS attacks from a botnet comprising thousands of hosts, or cope with 'low and slow' DOS attacks and can unintentionally block traffic from large institutions that share a single IP address.

Yan suggests that individual rate limits should be applied for each method, but acknowledges that this requires consistent discipline from developers, something which is often lacking. Furthermore, there is currently no built-in support in the Serverless framework to configure these method settings.

A solution might be to use a serverless-api-stage plugin or a custom rule in AWS Config to enforce rate limit overrides. Automated remediation like triggering a Lambda function after every API Gateway deployment could also be used. Using CloudFront as a CDN can also help reduce the traffic that reaches the API Gateway, but it comes with its own set of limitations and costs.

A premium service, AWS Shield Advanced, offers payment protection against extra costs incurred during an attack and provides access to the DDoS Response Team, but this may be too expensive for many startups.

We need better tooling and support from Serverless framework and AWS to easily configure these rate limits. AWS should change the default behavior of applying region-wide limits or at least provide warnings to users about the risks involved.

Serverless framework plugin called `serverless-api-gateway-throttling` allows for easier configuration of default throttling settings and provides overrides for individual endpoints.

## Resilience

### Multi-region, active-active

API example: Route 53, API Gateway, Lambda, DDB:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gdr63ml9a093xsn7sox2.png)

Data processing pipeline example with [static availability zones](https://lumigo.io/blog/amazon-builders-library-in-focus-5-static-stability-using-availability-zones/) :

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fhdx3aivd965w6ht6vr3.png)

### Handling partial failures

With Kinesis -> Lambda, things retry until success. Make sure to take advantage of configurable fields here, so things do not get stuck retrying.

Click [here](https://lumigo.io/blog/amazon-builders-library-in-focus-4-avoiding-insurmountable-queue-backlogs) for my summary of the Amazon Builders' Library article on avoiding insurmountable queue backlogs.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/atw5dm1u6kboh5rfcs2f.png)

With SQS -> Lambda, the problem comes up when the lambda errors and some of the messages are not deleted successfully.

#### [SQS and Lambda: the missing guide on failure modes](https://lumigo.io/blog/sqs-and-lambda-the-missing-guide-on-failure-modes/) (blog)

Amazon SQS is a message queueing service. You can use SQS to decouple and scale microservices, [serverless](https://lumigo.io/debugging-aws-lambda-serverless-applications/) applications, and distributed systems. SQS makes it easy to store, receive, and send messages between software components. You can configure SQS queues as event sources for Lambda. Once you set this up, Lambda functions are automatically triggered when messages arrive to an SQS queue. Lambda can then automatically scale up and down according to the number of inflight messages in a queue. This means Lambda takes charge and automates tasks like polling, reading and removing messages from a queue.

1. No Dead Letter Queues (DLQs): Not configuring a DLQ when using SQS and Lambda is a common mistake. It can result in the 'poison message' problem where an invalid message is continuously retrieved, causing the SQS function to error. Always configure a DLQ for every SQS queue.

2. SQS Lambda Visibility Timeout Misalignment: It's important to align the SQS visibility timeout with the Lambda function's timeout, ideally setting the SQS visibility timeout greater than the Lambda function's timeout. Otherwise, if the SQS function has a higher timeout value, in-flight messages may be processed more than once.

3. Partial Failures: Partial failures are tricky to handle as messages are deleted only after the SQS function completes successfully. Solutions to handle this include using a batchSize of 1 or ensuring idempotency. However, both approaches have their own limitations such as lower throughput or increased system complexity.

4. SQS Over-scaling: Lambda auto-scales the number of pollers based on traffic, which can result in the SQS function using up too many available concurrent executions in the region, possibly leading to throttling of Lambda invocations. Mitigation strategies include increasing the concurrency limit, setting reserved concurrency on the SQS function, or implementing backpressure control in front of the SQS queue.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8iy7px1bhkqrgvuu4189.png)

There are 3 ways to deal with it; 3rd one preferred.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jxlpfz9jvsjwx6dprc3a.png)

### Standardize error handling through middleware / wrappers

Wrap all this inside middleware, share it as a package and share it across the org:

- Log error message
- Classify the error type, can it be retried, etc.
- Return error code, request ID, etc.
- Track error count metric by type
- Implement fallbacks

### When to use Lambda Destinations

Lambda Destinations allows to configure a destination / target, so that when an event succeeds or fails, the target receives a notification.

Click [here](https://www.trek10.com/blog/lambda-destinations-what-we-learned-the-hard-way) for the Trek10 blog post on Lambda Destinations and some of its caveats.

Destinations feature provides a simple, powerful mechanism to handle the asynchronous invocations of your AWS Lambda functions.

In asynchronous invocation, when a function is invoked, AWS Lambda sends the event to a queue. A separate process reads events from the queue and runs your function. When all retries fail, or if the function returns an error, Lambda can direct the failed event record to a dead-letter queue (DLQ), an SNS topic, or a Lambda function (configured via the function's on-failure destination), which developers can then handle in their own way.

The Lambda Destinations feature takes this further by providing routing options for both successful and failed function invocations. This means you can specify different destinations for success (on-success destination) and failure scenarios (on-failure destination), thus making the error handling and event management more streamlined and effective.

Destinations could be another Lambda function, an Amazon SNS topic, an Amazon SQS queue, or an Amazon EventBridge event bus.

For failure events, prefer Lambda Destinations to DLQs.

For success events, if it is a simple 1 hop, use Lambda Destinations over complex step functions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3hutz57bkuqbl7i33u7e.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1k0zoojnodk1txhwiy6m.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b72oycbjajofswaa5v1p.png)

## Observability - also check out [Observability from blog posts](../yans-blog-posts.md#serverless-observability)

### Alerts you can't do without (blog [What alerts should you have for Serverless applications?](https://lumigo.io/blog/what-alerts-should-you-have-for-serverless-applications/))

Use alarms to alert you that something is wrong, not necessarily what is wrong.

**ConcurrentExecutions**: set to 80% of the regional limit.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bpz9fowelkbfzev7aq3g.png)

**IteratorAge**: for lambda functions that process against Kinesis streams, you need an alarm for IteratorAge. Should be in milliseconds usually, but can fall behind.

**DeadLetterErrors**: for functions that are triggered by an async event source (SNS, EventBridge) you should have dead letter queues setup, and have an alarm against DeadLetterErrors, which indicates that lambda has trouble sending error events to DLQ.

**Throttles**: for business critical functions you need an alarm that will fire as soon as the fn gets throttled. Maybe there's a rouge fn that's consuming the concurrency in the region, and causing business critical fns to get throttled.

**Error count & success rate %**: according to your SLA

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i5jbkjmxgvzhb0atmjsp.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0vkj8by1thojr440r27t.png)

### Logging

Use Lambda's built-in log collection

Use structured logging with JSON. Click [here](https://www.loggly.com/blog/8-handy-tips-consider-logging-json/) for 8 handy tips to consider when logging in JSON.

Traditional loggers are too heavy for Lambda. Take advantage of DAZN Lambda powertools (check it out [here](https://github.com/getndazn/dazn-lambda-powertools)).

It's not easy to query logs in CloudWatch Logs. Many use 3rd party services. But all logging 3rd party logging consumes concurrency limit. You can either limit concurrency for the log shipping function (and potentially lose logs due to throttling), or have CloudWatch Logs stream the logs to a Kinesis stream first, then process them via lambda.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hjvjpobr9llkea6c9k9t.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fevp6fs7m7ch1nj7yvhg.png)

Keep in mind that every time you create a new function, a new log group is created. You don't want to manually subscribe the log group to a function or kinesis stream. Instead use the auto-subscribe-log-group-to-arn SAR app [here](http://bit.ly/auto-subscribe-log-group-to-arn) .

### Distributed tracing

Imagine you have a non-trivial system. Something somewhere goes wrong, and it's hard to figure out where. Or you're not reaching your SLA, you need to optimize somewhere. DT helps with these.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q2926l4j9ycadvyhajak.png)

Click [here](https://github.com/theburningmonk/lambda-distributed-tracing-demo) for the demo project comparing the 4.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lubj5o99hisqt9fcxx8a.png)

### [Lambda powertools](https://github.com/getndazn/dazn-lambda-powertools)

Check out the [demo usage](https://github.com/theburningmonk/lambda-distributed-tracing-demo/tree/master/lambda-powertools/functions).

#### Overview of available tools

- [logger](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-logger): structured logging with JSON, configurable log levels, and integrates with other tools to support correlation IDs and sampling (only enable debug logs on 1% of invocations)
- [correlation IDs](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-correlation-ids): create and store correlation IDs that follow the DAZN naming convention
- [correlation IDs middleware](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-middleware-correlation-ids): automatically extract correlation IDs from the invocation event
- [sample logging middleware](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-middleware-sample-logging): enable debug logging for 1% of invocations, or when upstream caller has made the decision to enable debug logging
- [obfuscater middleware](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-middleware-obfuscater): allows you to obfuscate the invocation event so that sensitive data (e.g. PII) is not logged accidentally
- [log timeout middleware](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-middleware-log-timeout): logs an error message when a function invocation times out
- [stop infinite loop middleware](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-middleware-stop-infinite-loop): stops infinite loops

#### Client libraries

- [http client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-http-client): HTTP client that automatically forwards any correlation IDs you have captured or created, and records both latency as well as response count metrics
- [CloudWatchEvents client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-cloudwatchevents-client): CloudWatchEvents client that automatically forwards any correlation IDs you have captured or created when you put events to an event bus
- [EventBridge client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-eventbridge-client): EventBridge client that automatically forwards any correlation IDs you have captured or created when you put events to an event bus
- [SNS client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-sns-client): SNS client that automatically forwards any correlation IDs you have captured or created when you publish a message to SNS
- [SQS client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-sqs-client): SQS client that automatically forwards any correlation IDs you have captured or created when you publish a message to SQS
- [Kinesis client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-kinesis-client): Kinesis client that automatically forwards any correlation IDs you have captured or created when you publish record(s) to a Kinesis stream
- [Firehose client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-firehose-client): Firehose client that automatically forwards any correlation IDs you have captured or created when you publish record(s) to a Firehose delivery stream
- [Step Functions client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-step-functions-client): Step Functions client that automatically forwards any correlation IDs you have captured or created when you start an execution
- [Lambda client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-lambda-client): Lambda client that automatically forwards any correlation IDs you have captured or created when you invokes a Lambda function directly
- [DynamoDB client](https://github.com/getndazn/dazn-lambda-powertools/blob/master/packages/lambda-powertools-dynamodb-client): DynamoDB client that automatically forwards any correlation IDs you have captured or created when you perform put or update operations against DynamoDB. These correlation IDs are then available to functions processing these events from the table's 

## Cost

### Tuning function memory

Lambda cost is per request and duration.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5ggwikosv8ld41t3jx62.png)

A function that just does IO does not benefit much from memory. These are prime targets for cost reduction by reducing memory consumption.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ydlbgp7036oj8v3nd4wd.png)

A CPU bound function sees significant improvements as memory is added. Use a balanced approach.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7vd9epu8towei30lt87j.png)

If we combine the above 2 functions, and get a function that both does IO and is CPU intensive, we get interesting results.
We can exploit a cheaper and faster combination. Look out for these free upgrades.

```js
const https = require("https");

exports.handler = ({ n }, context, callback) => {
  https
    .get("https://google.com", (res) => {
      console.log("statusCode:", res.statusCode);

      let a = 1,
        b = 0,
        temp;

      while (n > 0) {
        temp = a;
        a = a + b;
        b = temp;
        n--;
      }

      callback(null, b);
    })
    .on("error", (e) => {
      console.error(e);
    });
};
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/huo4hkuzeyje2sc60emb.png)

Click [here](https://github.com/alexcasalboni/aws-lambda-power-tuning) for the aws-lambda-power-tuning project. Easiest way: deploy at [AWS Applications](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:451282441545:applications~aws-lambda-power-tuning) then execute the state machine per lambda.

Click [here](https://www.npmjs.com/package/lumigo-cli) for the Lumigo CLI. Install via NPM by running "npm i -g lumigo-cli".

Click [here](https://www.gigaspaces.com/blog/amazon-found-every-100ms-of-latency-cost-them-1-in-sales/) for the post on how latency affects revenue and conversion rate.

### Cost monitoring tools

TL, DR; don't optimize prematurely, use data to identify the critical 3%.

Take advantage of cost allocation tags and AWS Cost Management to understand your AWS bill. AWS billing is great for macro-level trends and decisions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/256mfovc4yjmoeodxr8b.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ho52m2z6ckqlqi1foj2o.png)

Whereas AWS Cost Explorer is great for tracking what we are spending where, CloudZero is a tool that helps find interesting cost trends and anomolies, then figure out contributing factors which could be the team or feature that causes it. Click [here](https://www.cloudzero.com/) to check out CloudZero.

Lumigo CLI has an analyze lambda command that gives a cost outlook of all your functions. Click [here](https://www.npmjs.com/package/lumigo-cli) for the lumigo-cli on NPM. But Lambda is the cheapest cost in any stack, so focusing on lambda alone isn't enough.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xhykg7enhe2oyjhce7es.png)

Lumigo can give a complete outlook to cost. Click [here](https://lumigo.io/) to check out Lumigo.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/axvcph5r09xo6s0v3exg.png)

### Watch out for costs of peripheral services

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/trh0rf18mkpp726egyz9.png)

Lambda cost is small part of the whole. API gateway is expensive. Prefer to do caching at CloudFront. Caching at the edge is very cost-efficient as it cuts out most of the calls to API Gateway and Lambda. Skipping these calls also improve the end-to-end latency and ultimately the user experience. Also, by caching at the edge, you don’t need to modify your application code to enable caching.

#### [All you need to know about caching for serverless applications](https://theburningmonk.com/2019/10/all-you-need-to-know-about-caching-for-serverless-applications/)

Caching remains essential in serverless architectures because while Lambda auto-scales by traffic, it has limitations in terms of concurrent executions. Caching not only helps deal with spiky traffic but also improves performance and cost-efficiency by reducing unnecessary roundtrips and the number of pay-per-use services.

Implement caching as close to the end-user as possible for maximal cost-saving benefits. This can be achieved in several places:

1. **Client-side caching**: Useful for data that rarely changes, it can be implemented using techniques like memoization, significantly improving performance.
2. **Caching at CloudFront**: CloudFront provides built-in caching capabilities which are very cost-efficient and can improve latency and user experience. CloudFront supports caching by query strings, cookies, and request headers, and it doesn't require any changes to application code.
3. **Caching at API Gateway**: Unlike CloudFront, which only caches responses to GET, HEAD, and OPTIONS requests, API Gateway caching allows for caching responses to any request. It gives greater control over the cache key. One downside is that it switches from pay-per-use pricing to paying for uptime.
4. **Caching in the Lambda function**: Data declared outside the handler function is reused between invocations. However, cache misses can be high, and there’s no way to share cached data across all concurrent executions of a function. For sharing cached data, Elasticache can be used but this involves added costs and requires the functions to be inside a VPC.
5. **DAX**: If using DynamoDB, DAX should be used for application-level caching as it allows the benefits of Elasticache without having to manage it.

In conclusion, caching is crucial for serverless applications to improve scalability, performance, and cost-efficiency. Depending on the specific use-case and requirements, caching should be implemented at different layers in the application, preferably starting from the client side to the server side.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gbe3l5jsjli7ose7lstl.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0jbhxz1c3206ubz9j3n4.png)

Click [here](https://aws.amazon.com/api-gateway/pricing/) for API Gateway pricing. Click [here](https://aws.amazon.com/step-functions/pricing/) for Step Functions pricing.

Click [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) for API Gateway HTTP APIs vs REST APIs.

### Keeping CloudWatch costs in check

Don't log debug in production. Sample debug logs instead. Sample rate should give you coverage of every scenario, tweak it based on your traffic. (DAZN Lambda Powertools has these settings out of the box. Click [here](https://github.com/getndazn/dazn-lambda-powertools))

By default, CloudWatch logs does not expire your logs, ever. Keeping them forever is costly. To help manage the log retention policy in one central place, deploy [**auto-set-log-group-retention**](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:374852340823:applications~auto-set-log-group-retention): updates the retention policy for new and existing CloudWatch log groups to a specified number of days to reduce CloudWatch Logs cost.

#### [You should sample debug logs in production](https://theburningmonk.com/2018/04/you-need-to-sample-debug-logs-in-production/) (blog)

Yan highlights the significance of sampling debug logs in production while working with AWS services like Lambda and CloudWatch. Typically, the log level is set to WARNING for production to manage traffic volume and to consider cost factors, such as the cost of logging, storage, and processing. However, doing so eliminates debug logs in production, which are critical for identifying the root cause of a problem. Without them, deploying a new version of the code to enable debug logging consumes valuable time and increases the mean time to recovery (MTTR) during an incident.

To mitigate this issue, Yan suggests sampling debug logs from a small percentage of invocations, representing a balance between having no debug logs and having all of them. This approach requires a logger that allows dynamic changes to the logging level and a middleware engine like middy.

Yan prefers to use a simple logger module, which offers structured logging with JSON, the ability to log at different levels, and control over the log level via environment variables. By using middy, a middleware can be created to dynamically update the log level to DEBUG for a certain percentage of invocations and then restore the previous log level at the end of the invocation.

In a microservices environment, it is crucial to ensure debug logs cover an entire call chain. To achieve this, the decision to turn on debug logging can be forwarded as a correlation ID, so the next function in the chain respects this decision and passes it on.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mk5jda0jljrzz18jqzpj.png)

### SNS vs SQS vs EventBridge vs Kinesis

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6juj6pdnk5w4oitlnuet.png)

But, at High throughput, Kinesis is much cost effective (as seen in Scalability section above).
As a general rule, services that pay by uptime are orders-of-magnitude cheaper when running at scale.

### API gateway service proxies (as a last resort)

As discussed in the Scalability chapter above, you should consider API gateway service proxies for performance and scalability reasons; when you are concerned about cold start overhead or burst limit (and you have already considered Provisioned Concurrency), or when you're running a very spiky workload.

What you lose with service proxies:

- Retry and exponential backoff
- Contextual logging
- Error handling
- fallbacks
- tracing
- Chaos tools

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/44hbndx27w5rc4wsm3st.png)

Click [here](https://lumigo.io/blog/the-why-when-and-how-of-api-gateway-service-proxies/) for my blog post on the why, when and how of API Gateway service proxies.

Click [here](https://github.com/horike37/serverless-apigateway-service-proxy) for the `serverless-apigateway-service-proxy` plugin for Serverless framework.

Click [here](https://aws.amazon.com/elasticloadbalancing/pricing) for ALB pricing. Click [here](https://aws.amazon.com/api-gateway/pricing) for API Gateway pricing.

### API Gateway: REST API vs HTTP API vs ALB (application load balancer)

Click [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) for a comparison of API Gateway REST APIs vs HTTP APIs

HTTP API is 70% cheaper and less powerful than REST API.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ccbwtsc7l1fkbf4yswk6.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pzh9q6zua2uym7wvmkw9.png)

### Use Batching to reduce cost

This is often related to the discussion of SNS, SQS and Kinesis, also it is only relevant at scale.

AWS Kinesis enables users to collect, process, and analyze large amounts of data in real-time, allowing for real-time analytics and decision making. Both Kinesis Data Stream and Kinesis Firehose help by processing messages in large batches. Bigger batches are more efficient but slower.

Kinesis Data Stream is better bet if you need close-to-real-time batching.
If you want to maximize savings and don't need close-to-real-time batching, Kinesis Firehose is a better choice.

Firehose is all managed for you, there's no need to manage the number of shards.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lx6104do3vbc3aqvteq7.png)

Click [here](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html) for the AWS documentation on how Lambda works with Kinesis.

Click [here](https://aws.amazon.com/kinesis/data-firehose/pricing) for Kinesis Firehose pricing.

Click [here](https://docs.aws.amazon.com/firehose/latest/dev/create-configure.html) for Kinesis Firehose configuration options.

Click [here](https://docs.aws.amazon.com/firehose/latest/dev/limits.html) for Kinesis Firehose limits.

### Provisioned Concurrency and Cost

Provisioned concurrency has an uptime cost, but the on demand cost is less. 60% is the break even point.

When there is sustained high throughput, PC can reduce lambda invocation cost.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k9wxhxwxipxvd9atisdw.png)
