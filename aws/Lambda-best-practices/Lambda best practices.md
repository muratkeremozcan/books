# Lambda best practices

## Performance

### Tuning function memory

https://aws.amazon.com/lambda/pricing/

Lambda memory allocation is the only way to control the performance and cost of our functions.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2kym4dcu40nbmjqi2kw3.png)

We do not want to do manual tuning, but take advantage of the below utils. Identify the sweet spot for you needs. It's a cost vs execution time decision.

1. [aws-lambda-power-tuning project](https://github.com/alexcasalboni/aws-lambda-power-tuning) - **KEY**

![image-20230413062546425](/Users/murat/Library/Application Support/typora-user-images/image-20230413062546425.png)

2. [Lumigo CLI](https://www.npmjs.com/package/lumigo-cli). Install via NPM by running "npm i -g lumigo-cli". Pick speed, balance or cost as strategy.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/08yu720zpsgnzv1sgqqj.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eqaoiwmmlyl4ts84153b.png)

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
const AWS = require('aws-sdk')
const DynamoDB = new AWS.DynamoDB()

// do
const DynamoDB = require('aws-sdk/clients/dynamodb')
const dynamoDB = new DynamoDB()
```

Sls-wepback plugin can help with tree shaking and minification. It also helps to not need the layer.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/llbph089ki0v8jwlhnaq.png)

### Provisioned Concurrency KEY

[Provisioned Concurrency - the end of cold starts](https://lumigo.io/blog/provisioned-concurrency-the-end-of-cold-starts/#:~:text=Once%20enabled%2C%20Provisioned%20Concurrency%20will,at%20lunch%20and%20dinner%20time.) : Once enabled, Provisioned Concurrency will keep your desired number of concurrent executions initialized and ready to respond to requests. This means an end to cold starts! 

Mind that when provisioned concurrency happens, the init duration does not seem to change. It still happens, but happens ahead of time; that's why it feels much faster but still reports a high duration.

**Difference between Provisioned Concurrency and warm starts**: It's about the instances. Warm start is 1 instance of the lambda, and the rest still cold start. P.C. can be set to scale

From Yan:
*The actual problem with them is that they don't scale beyond keeping a handful of instances of your functions warm because there's no way to direct an invocation to specific instances (ie. worker) of a function. So if you have a handful of functions and you just need to keep 1 instance of each warm for a low throughput API, then warmers are a good, cheap way to do it compared to using Provisioned Concurrency. But if you need an enterprise-scale solution that can keep 50, 100 instances of your functions warm, and auto-scale the no. of warm instances based on traffic patterns or based on a schedule, and you don't mind (potentially) paying extra for these, then use Provisioned Concurrency. I said potentially paying extra, because Provisioned Concurrency can actually work out cheaper than on-demand concurrency if you have good utilization of the Provisioned Concurrency you have (~60% is the break-even point).*

P.C. happens against a version - not sure why they have both alias and version there.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q025m29weskbfzithk44.png)

After invoking the function with Test, things can be verified in Cloudwatch metrics.
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qnqhvglv82rxhiiaviay.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3002eixqcf2o32krwj5u.png)

### When to use Provisioned Concurrency

Let's say you optimized your lambdas (requiring less, webpack...), and cannot optimize. 

Maybe you have so many services and cold starts add up.

You may be reaching the regional concurrency limit and get throttled (3000 US West, East, EU west, 1000 Asia, 500 other regions).

Provisioned concurrency can solve that problem
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8xc35tbqlsdehu5nteos.png)

#### Limitations

Cannot use $LATEST alias.

It consumes regional limit.

#### When to use

* Optimization can't help you reach performance target
* Cold starts would likely stack
* Traffic is spiky

### Enable HTTP keep-alive (node) - **KEY**

> If you use the AWS SDK v3, you don't need to do this anymore, it's enabled by default now.

[Blog post](https://theburningmonk.com/2019/02/lambda-optimization-tip-enable-http-keep-alive/).
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

We have a ventilator that splits a large task into smaller tasks and distributes them across a pool of workers.

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

Click [here](https://theburningmonk.com/2019/05/a-self-healing-kinesis-function-that-adapts-its-throughput-based-on-performance/) to see my article on self-healing Kinesis function.

Click [here](https://lumigo.io/blog/amazon-builders-library-in-focus-4-avoiding-insurmountable-queue-backlogs/) to see summary of "Avoiding insurmountable queue backlogs".

Click [here](https://lumigo.io/blog/amazon-builders-library-in-focus-2-using-load-shedding-to-avoid-overload/) to see summary of "Using load shedding to avoid overload".

### When to use API Gateway service proxies?

In AWS, an API Gateway proxy is a type of integration that allows you to create a single, unified interface for your backend resources, such as AWS Lambda functions, HTTP endpoints, or other AWS services. The proxy integration enables the API Gateway to forward incoming requests to the specified backend resource and return its response to the caller, without the need for extensive configuration or request/response mapping.

When using the proxy integration, the API Gateway acts as a "passthrough" for the request, meaning that it forwards the entire request and its headers, query parameters, and body to the backend resource. Similarly, it returns the backend's response without any modifications, unless you configure additional processing through middleware or other configurations.

When you are concerned about cold start overhead (and Provisioned concurrency is also considered) , or burst limit, consider API gateway service proxies.

What you lose:

* Retry and exponential backoff 
* Contextual logging from the function
* Error handling & Fallbacks
* Tracing 
* Chaos tools
* You might have to use VTL

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8wohhrnr1pvjompcrjuq.png)

Click [here](https://lumigo.io/blog/the-why-when-and-how-of-api-gateway-service-proxies/) for my blog post on the why, when and how of API Gateway service proxies.

Click [here](https://github.com/horike37/serverless-apigateway-service-proxy) for the serverless-apigateway-service-proxy plugin for the Serverless framework.

Click [here](https://github.com/ToQoz/api-gateway-mapping-template) for the api-gateway-mapping-template project.

### Load testing

Commonly perceived performance standard for web apps:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dusvoujiec2gowwb13aq.png)

When load testing, ensure to have a gradual increase because we may run into lambda throttling. Instead of unrealistic sharp spikes, simulate a gradual increase.

Test realistic user journeys, not individual functions. Otherwise all you are testing is AWS. Don't forget to load test the asynchronous parts of the system.

Click [here](https://docs.aws.amazon.com/lambda/latest/dg/scaling.html) for the official AWS documentation on Lambda's scaling behavior.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ypjneayqnjcq7q23g8zz.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9qdl4w7loazdkv485mgq.png)

## Security

### Principle of least privilege

Avoid *.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n1zci924pyvulh7ouha5.png)

Click [here](https://iam.cloudonaut.io/) for the Complete AWS IAM Reference.

Click [here](https://www.npmjs.com/package/serverless-iam-roles-per-function) for the serverless-iam-roles-per-function plugin on NPM.

### Secret management

Storing secrets: SSM Parameter Store vs Secrets Manager

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fvnwa5fnh8vjrw99tad6.png)

Click [here](https://aws.amazon.com/secrets-manager/pricing) for Secrets Manager pricing.

Click [here](https://aws.amazon.com/systems-manager/pricing/#Parameter_Store) for SSM Parameter Store pricing.

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

## Resilience

### Multi-region, active-active

API example; Route 53, API Gateway, Lambda, DDB:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gdr63ml9a093xsn7sox2.png)

Data processing pipeline example with [static availability zones](https://lumigo.io/blog/amazon-builders-library-in-focus-5-static-stability-using-availability-zones/) :

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fhdx3aivd965w6ht6vr3.png)

### Handling partial failures

With Kinesis -> Lambda, things retry until success. Make sure to take advantage of configurable fields here, so things do not get stuck retrying.

Click [here](https://lumigo.io/blog/amazon-builders-library-in-focus-4-avoiding-insurmountable-queue-backlogs) for my summary of the Amazon Builders' Library article on avoiding insurmountable queue backlogs.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/atw5dm1u6kboh5rfcs2f.png)

With SQS -> Lambda, the problem comes up when the lambda errors and some of the messages are not deleted successfully.

Click [here](https://lumigo.io/blog/sqs-and-lambda-the-missing-guide-on-failure-modes) for my post on the failure modes of SQS and Lambda.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8iy7px1bhkqrgvuu4189.png)

There are 3 ways to deal with it; 3rd one preferred.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jxlpfz9jvsjwx6dprc3a.png)

### Standardize error handling through middleware / wrappers

Wrap all this inside middleware, share it as a package and share it across the org.

![Screen Shot 2023-04-18 at 7.49.21 AM](/Users/murat/Desktop/Screen Shot 2023-04-18 at 7.49.21 AM.png)

### When to use Lambda Destinations

LD allows to configure a destination / target, so that when an even succeeds the target receives a notification.

Click [here](https://www.trek10.com/blog/lambda-destinations-what-we-learned-the-hard-way) for the Trek10 blog post on Lambda Destinations and some of its caveats.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3hutz57bkuqbl7i33u7e.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1k0zoojnodk1txhwiy6m.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b72oycbjajofswaa5v1p.png)

## Observability

### Alerts you can't do without

Use alarms to alert you that something is wrong, not necessarily what is wrong.

**ConcurrentExecutions**: set to 80% of the regional limit.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bpz9fowelkbfzev7aq3g.png)

**IteratorAge**: for lambda functions that process against Kinesis streams, you need an alarm for IteratorAge. Should be in milliseconds usually, but can fall behind.

**DeadLetterErrors**: for functions that are triggered by an async event source (SNS, EventBridge) you should have dead letter queues setup, and have an alarm against DeadLetterErrors, which indicates that lambda has trouble sending error events to DLQ. 

**Throttles**: for business critical functions you need an alarm that will fire as soon as the fn gets throttled. Maybe there's a rouge fn that's consuming the concurrency in the region, and causing business critical fns to get throttled.

**Error count & success rate %**: occurring to your SLA 

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i5jbkjmxgvzhb0atmjsp.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0vkj8by1thojr440r27t.png)

### Logging

Use Lambda's built-in log collection

Use structured logging with JSON. Click [here](https://www.loggly.com/blog/8-handy-tips-consider-logging-json/) for 8 handy tips to consider when logging in JSON.

Traditional loggers are too heavy for Lambda. Click [here](https://github.com/getndazn/dazn-lambda-powertools) for the DAZN Lambda powertools.

It's not easy to query logs in CloudWatch Logs. Many use 3rd party services. But all logging 3rd party logging consumes concurrency limit. You can either limit concurrency the log shipping function (and potentially lose logs due to throttling), or have CloudWatch Logs stream the logs to a Kinesis stream first, then process them via lambda.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hjvjpobr9llkea6c9k9t.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fevp6fs7m7ch1nj7yvhg.png)

Keep in mind that every time you create a new function, a new log group is created. You don't want to manually subscribe the log group to a function or kinesis stream. Instead use the auto-subscribe-log-group-to-arn SAR app [here](http://bit.ly/auto-subscribe-log-group-to-arn) .

### Distributed tracing

Imagine you have a non-trivial system. Something somewhere goes wrong, and it's hard to figure out where. Or you're not reaching your SLA, you need to optimize somewhere. DT helps with these.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q2926l4j9ycadvyhajak.png)

Click [here](https://github.com/theburningmonk/lambda-distributed-tracing-demo) for the demo project.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3gj3s6kp0c3wrdb8rzkn.png)

### Distributed tracing with X-ray

