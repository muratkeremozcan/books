```bash
# needs node 14
nvm use
npm i # may need force

# configure credentials (needed for deploy and e2e tests)
npm run sls -- config credentials --provider aws --key <yourAWSAccessKeyId> --secret <AWSSecretKey> --overwrite

# deploy
npm run deploy

```

### To test the function

1. Go to the S3 console.
2. Click into your upload bucket and then select Upload to open the Upload page
3. Click Add Files, select a video file from your computer, and click the Upload
   button. All other settings can be left as is. If you don’t have any video
   files to test, go to https://sample-videos.com and grab one of the MP4
   videos.
4. After a time, you should see three new videos in your transcoded video
   bucket.

### What happens?

1. Upload new video file to upload-video-bucket-mko
2. `transcode-video` lambda gets triggered, and creates a transcode job
3. The output of the transcode job is uploaded to the transcode-bucket-mko

---

## Testing & misc

- To get the full benefit of a serverless architecture, you need small,
  autonomous teams who are capable of making their own architectural decisions.
  Developers should be responsible for more than just the code and empowered to
  own their system. As Amazon’s motto goes, “You build it, you test it, you run
  it.”
- DevOps is simpler with serverless. You get a lot of automation out of the box,
  and tools such as Serverless Framework takes care of the rest. You still need
  to know what metrics to pay attention to and what alerts to add, however, as
  operational experience of running a production system is still valuable.
- Unit tests have a low return on investment when it comes to serverless
  architectures. Most functions are simple and often integrate with other
  services such as Amazon’s DynamoDB and Simple Queuing Service (SQS). Unit
  tests that mock these integration points do not test those service
  interactions and give you a false sense of security.
- Prefer integration tests that exercise the real AWS services for the happy
  paths and use mocks only for failure cases that are difficult to simulate
  otherwise. For example, execute the function code locally but have it talk to
  the real DynamoDB tables. Then use mocks when you need to test your error
  handling for DynamoDB’s throughput exceeded errors.
- Services often have to call each other in a microservices architecture. For
  internal APIs that are more prone to breaking in the development environments
  (compared to AWS services), use mocks to isolate the failures. The last thing
  you want is for an error in one service to fail the tests for all other
  services that depend on it.
- Simulating AWS services (for example, DynamoDB, SNS, SQS) locally is not worth
  the effort. It’s easier and quicker to deploy a temporary stack, than using
  local simulation tools.
- When dealing with batched event sources like Kinesis and SQS, you need to
  think about how to handle partial failures. You either have to make sure that
  the operations are idempotent and can be retried without problem, or you need
  to ensure that successfully processed items in a failed batch are not
  processed again when the batch is retried.

## Patterns (todo: cross link to Yan's blog posts)

- service-oriented architecture (SOA) is a well-known buzzword. SOA encourages
  an architectural approach in which developers create autonomous services that
  communicate via message passing and often have a schema or a contract that
  defines how messages are created or exchanged. The modern incarnation of the
  service-oriented approach is often referred to as microservices architecture.

- Certain patterns and approaches like GraphQL are well suited to serverless
  architectures because AWS services such as AppSync are on hand and can
  integrate nicely with the rest of your architecture. GraphQL is a type of
  composite pattern that lets you aggregate data from multiple places. Reading
  and hydrating data from multiple data sources is common in web applications
  and especially so in those that adopt the microservices approach. There are
  other benefits too, including smaller payloads, avoiding the need to rebuild
  the data model, and no more versioned APIs (as compared to REST).

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pc091gmbi8wtfhm7l5tc.png)

- Classic software engineering patterns like messaging patterns work
  exceptionally well with serverless architectures and AWS products such as SQS.
  Messaging patterns (figure 3.6) are popular in distributed systems because
  they allow developers to build scalable and robust systems by decoupling
  functions and services from direct dependence on one another and allowing
  storage of events/records/ requests in a queue. The reliability comes from the
  fact that if the consuming service goes offline, the queue retains messages
  (for some period), which can still be processed at a later time. This pattern
  features a message queue with a sender that can post to the queue and a
  receiver that can retrieve messages from the queue. In terms of implementation
  in AWS, you can build this pattern on top of the SQS. The messaging pattern
  handles workloads and data processing. The queue serves as a buffer, so if the
  consuming service crashes, data isn’t lost. It remains in the queue until the
  service can restart and begin processing it again.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bn4o0isobwo8en7kat8r.png)

- The fan-out pattern is one of the more common patterns. Knowing how to set it
  up using Amazon SNS is important to be effective with AWS. Generally, the
  fan-out pattern pushes a message to all listening/subscribed clients of a
  particular queue or a message pipeline. In AWS, this pattern is usually
  implemented using SNS topics that allow multiple subscribers to be invoked
  when a new message is added to a topic. The fan-out pattern is useful because
  many AWS services (such as S3) can’t invoke more than one Lambda function at a
  time when an event takes place. SNS topics are communications or messaging
  channels that can have multiple publishers and subscribers (including Lambda
  functions). When a new message is added to a topic, it forces invocation of
  all the subscribers in parallel, thus causing the event to fan out. This
  pattern is useful if you need to invoke multiple Lambda functions at the same
  time. An SNS topic will retry, invoking your Lambda functions, if it fails to
  deliver the message or if the function fails to execute (see
  https://go.aws/3DTdCEK). Furthermore, the fan-out pattern can be used for more
  than just invocation of multiple Lambda functions.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pxsw0otnu731r63ruwgr.png)

SNS topics support other subscribers such as email and SQS queues. Adding a new
message to a topic can invoke Lambda functions, send an email, or push a message
on to an SQS queue, all at the same time. Using a combination of SNS and SQS is
popular for building event buses. An SNS topic that is piped into separate SQS
queues - in general, there is one for each event type. Subscribers, usually in
the form of Lambda functions, are delivered messages via the queue(s) they
subscribe to. Events are actually SNS messages that include meta-data (such as
the event type) and a payload. Within a microservice, each subscribed event will
have a corresponding SQS handler (a lambda) whose job it is to handle all events
of that type as they are published.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2jx526h1nhbnhsizl168.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xvfb1ec9ytd7mthl4f9y.png)

## Use cases

- Fargate, also an AWS service, lets you run containers without having to worry
  about underlying virtual machines. It’s part of an emerging trend for
  serverless containers, where you use containers as a utility service.
- With API Gateway and Lambda, you pay for individual API requests. Fargate, on
  the other hand, charges a per-hour amount based on the vCPU, memory, and
  storage resources that your containers use. You incur costs for as long as the
  containers run, even if they don’t serve any user traffic. Paying for up time
  can be inefficient for APIs that don’t receive a lot of requests. For example,
  an API that receives a few thousand requests a day would cost significantly
  less using API Gateway and Lambda. This is especially true when you consider
  that you need some redundancy to ensure that your API stays up and running
  even if a container fails or if one of the AWS availability zones (AZs)
  hosting your containers experiences an outage. However, for high throughput
  APIs like the Yle API, which handles hundreds of millions of requests per day,
  running the API in Fargate can be more economical than using API Gateway and
  Lambda.
- An emerging trend is that of serverless containers; that is, leveraging
  containers instead of functions to implement the custom logic and using the
  container as a utility service and incurring costs only when the container
  runs. Services like AWS Fargate or Google Cloud Run offer this capability. The
  difference between the two (functions vs. containers) is just the degree to
  which developers want to shift the boundaries of shared responsibilities.
  Containers give you a bit more control over user space libraries and network
  capabilities. Containers are an evolution of the existing server-based/VM
  model, offering an easy packaging and deployment model for your application
  stack. You are still required to define your operating system’s requirements,
  your desired language stack, and dependencies to deploy code, which means you
  continue to carry some of the infrastructure complexity. For
- Because of these scaling limits, AWS API Gateway and Lambda are not a good fit
  for APIs with extremely spiky traffic. It’s the main reason why the Yle team
  opted to build their API with Fargate, and that was a sensible decision.
- In general, AWS services that charge you based on up time tend to be orders of
  magnitude cheaper when running at scale, compared with those that charge based
  on request count. And the bigger the scale, the more you need to batch events
  for cost and efficiency. After all, processing 1,000 events with a single
  Lambda invocation is far cheaper and more efficient than processing those with
  1,000 Lambda invocations.Ingestion of data such as logs, system events,
  transactions, or user clicks can be accomplished using services such as Amazon
  Kinesis Data Streams and Amazon Kinesis Firehose. Kinesis Data Streams and
  Lambda functions are a good fit for applications that generate a lot of data
  that needs to be analyzed, aggregated, and stored. When it comes to Kinesis,
  the number of functions spawned to process messages from a stream is the same
  as the number of shards (therefore, there’s one Lambda function per shard
- Amazon Kinesis Firehose is another Kinesis service designed to ingest
  gigabytes of streaming data and then push it into other services like S3,
  RedShift, or Elasticsearch for further analytics. Firehose is a true
  serverless service because it is fully managed, it scales automatically
  depending on the volume of data coming in, and there’s no need to think about
  sharding as is the case with Kinesis Data Streams.
- Kinesis Firehose provides a way to capture and stream data into Elasticsearch,
  Redshift, and S3. AWS says that it’s the “. . . easiest way to reliably load
  streaming data into data lakes, data stores, and analytics services”
  (https://aws.amazon.com/kinesis/data-firehose/), which sounds perfect for our
  use case. Kinesis Firehose, unlike other Kinesis services, is serverless,
  meaning that you don’t need to worry about scaling partitions or sharding as
  is the case with, say, Kinesis Data Stream. It is all done for you
  automatically.

- Management: Kinesis Data Streams requires manual management of data consumers,
  whereas Kinesis Firehose is fully managed and automatically scales.

- Functionality: Kinesis Data Streams simply captures and stores data, leaving
  the processing and analysis to other tools. In contrast, Kinesis Firehose not
  only captures and stores data, but also can batch, compress, transform, and
  encrypt the data before delivering it to specified destinations.

- To understand which service limits affect your application, look at every
  service along the way and build a projection of how throughput changes with
  user traffic. Take Yle’s case: as the number of concurrent users goes up,
  there’s more traffic going through the ingestion API running in Fargate.

  - How does this increase affect the throughput that needs to be processed by
    Kinesis and, therefore, the number of shards that need to be provisioned?
  - Based on the current BatchSize and ParallelizationFactor configurations, how
    many concurrent Lambda executions would be required to process the events at
    peak load?
  - Given that many concurrent Lambda executions, how many events would be sent
    to each Kinesis Firehose stream?
  - Does your current throughput limit for Kinesis Data Firehose support that
    many events per second?

- As you introduce more moving parts into your architecture and process more
  throughput, you should also pay more attention to your timeout and retry
  configurations. There are two problems that often plague applications that
  operate at scale:

  - Thundering herd —A large number of processes waiting for an event are awaken
    at the same time, but there aren’t enough resources to handle the requests
    from all these newly awaken processes. This creates a lot of resource
    contention, potentially causing the system to grind to a halt or fail over.
  - Retry storm—An anti-pattern in client-server communications. When a server
    becomes unhealthy, the client retries aggressively, which multiplies the
    volume of requests to the remaining healthy servers and, in turn, causes
    them to timeout or fail. This triggers even more retries and exacerbates the
    problem even further. Retries are a simple and effective way to handle most
    intermittent problems, but setting these needs to be done with care. A good
    practice is to use exponential backoff between retry attempts and the
    circuit breaker pattern to mitigate the risk of retry storms
    (https://martinfowler.com/bliki/CircuitBreaker.html).

- The cost of Lambda is usually a small part of the overall cost of a serverless
  application. In fact, in most production systems, the cost of Lambda often
  pales in comparison with the cost of CloudWatch metrics, logs, and alarms.

## Practicum - things to consider when building your serverless architecture

In this chapter, we analyzed five different ways to implement a service for
executing ad hoc tasks, and we judged these solutions on the nonfunctional
requirements we set out at the start of the chapter. Throughout the chapter we
asked you to think critically about how well each solution would perform for
these nonfunctional requirements and asked you to rate them. And we shared our
scores with you and our rationale for these scores. We hope through these
exercises you have gained some insights into how we approach problem solving and
the considerations that goes into evaluating a potential solution:

- What are the relevant service limits and how do they affect the scalability
  requirements of the application?
- What are the performance characteristics of the services in question and do
  they match up with the application’s needs?
- How are the services charged? Project the cost of the application by thinking
  through how the application would need to use these AWS services and applying
  the services’ billing model to that usage pattern.

## Parallel Computing

- MapReduce can work really well with a serverless approach. Lambda invites you
  to think about parallelization from the start so take advantage of that.
- You can solve a lot of problems in Lambda and process vast amounts of data by
  splitting it up into smaller chunks and parallelizing the operations.
- Step Functions is an excellent service for defining workflows. It allows you
  to fan-out and fan-in operations.
- EFS for Lambda is an endless local disk—it grows as much as you need. You can
  run applications with EFS and Lambda that you couldn’t have run before. Having
  said that, S3 is still likely to be cheaper so make sure to do your
  calculations and analysis before choosing EFS.
- You can solve problems in different ways: You don’t have to use Step Functions
  because you can use SNS (although Step Functions adds an additional level of
  robustness and visibility). You don’t need to use EFS because you can use S3.
  When coming up with an architecture for your system, explore the available
  options because there will be different alternatives with different tradeoffs.

## Code scoring service example

- As a rule of thumb, you should use multiple Lambda functions when you are
  dealing with different concerns rather than having everything lumped into one.
  Hence, this is the reason we created two functions and introduced a message
  queue between them.

- Another question you may have is why we used SQS rather than have functions
  call one another directly. Our recommendation is never to have functions call
  each other directly unless you are using a feature called Lambda Destinations
  (which adds a hidden queue between two functions anyway). Lambda Destinations,
  however, only works for asynchronous invocations, so it wouldn’t have been
  possible in our case. The reason for having a queue between two functions is
  to reduce coupling (e.g., the two functions have no direct knowledge of one
  another) and to have an easier time handling errors and retries.

- Amazon EventBridge is a serverless event bus that can connect different AWS
  (and non-AWS) services. It has a few great features that services like SQS,
  SNS, and Kinesis do not possess. Chief among them is the ability to use more
  than 90 AWS services as event sources and 17 services as targets, automated
  scaling, content-based filtering, schema discovery, and input transformation.
  But like any other technology, it has certain deficiencies like no guarantee
  on ordering of events or buffering. As always, what you end up choosing should
  depend on your requirements and the capabilities of the product you are using.

- AWS Glue is a serverless ETL (extract, transform, and load) service that can
  scour an S3 bucket with a crawler and update a central metadata repository
  called the Glue Data Catalog. You and other services can then use this
  metadata repository to quickly search for relevant information among the
  records scattered in S3. Glue never actually moves or copies any data. The
  tables with metadata it creates in the Glue Data Catalog point to the data in
  S3 (or other sources like Amazon Redshift or RDS). This means that the Data
  Catalog can be recreated from the original data if necessary.

- Amazon Athena is a serverless query service that can analyze data in S3 using
  standard SQL. If you haven’t tried Athena, you have to give it a go. You
  simply point it to S3, define the schema, and begin querying using SQL. What’s
  even nicer is that it integrates closely with Glue and its Data Catalog (which
  takes care of the schema). Once you have AWS Glue configured and the Data
  Catalog created, you can begin querying Athena immediately.

- Amazon QuickSight is AWS’s Business Intelligence (BI) service in the vein of
  Tableau.

- Amazon Redshift is primarily used for data analytics. Here are some specific
  applications:

  1. **Data Warehousing**: Amazon Redshift is designed to handle large volumes
     of data, from a few hundred gigabytes to a petabyte or more. This makes it
     suitable for collecting and analyzing data from a variety of sources, such
     as transactional data, log files, and more.
  2. **Business Intelligence (BI)**: With its ability to run complex queries
     quickly, Redshift is a good fit for BI workloads. It can power dashboards,
     deliver fast reporting, and provide the analytics that businesses need to
     make informed decisions.
  3. **Data Lake Analysis**: Redshift can query data directly from Amazon S3
     data lakes using Redshift Spectrum, allowing users to analyze large amounts
     of unstructured and semi-structured data alongside their structured data.
  4. **Predictive Analysis**: Redshift can integrate with various machine
     learning and predictive analytics tools. This allows businesses to use
     their data to predict future trends, customer behaviors, etc.
  5. **ETL (Extract, Transform, Load) Jobs**: Redshift is often used as part of
     ETL jobs to transform and load data into a format suitable for analysis.

  In essence, any task that involves analyzing large volumes of data - whether
  for reporting, decision-making, trend analysis, or prediction - can
  potentially leverage Amazon Redshift.

- In summary, to build an Analytics Service, AWS services such as Kinesis
  Firehose, Athena, and Glue can be what you need. These are serverless
  services, meaning that you don’t have to think about scaling or managing them
  the same way that you’d need to think about Amazon Redshift. Nevertheless, if
  you decide to embark on a serverless journey with these services make sure to
  do your evaluation first. Are they capable of meeting all of your
  requirements? Is there a situation where, in your case, Amazon Redshift may be
  better?

- Athena’s charges are based on the amount of data scanned in each query;
  Redshift is priced based on the size of the instance. There could be
  circumstances where Athena is cheaper, but Redshift is faster, so you should
  spend a little bit of time with Excel projecting cost. Nevertheless, in many
  cases, especially for smaller data sets, the combination of Athena and Glue is
  more than enough for most needs. S

- Capturing, processing, and reporting on data using services such as
  EventBridge, DynamoDB, Amazon Glue, Amazon Athena, and Amazon QuickSight to
  build a web application with three microservices leaves us with a few
  takeaways, including the following:

  - Amazon QuickSight is slow (and it can be expensive). If you need to show
    leaderboards, cache them in something like DynamoDB for quick retrieval.
  - Glue and Athena are fantastic tools. Glue can index the data stored in S3,
    and Athena can search across it using standard SQL. The result is less
    “lifting” and coding for you.
  - Kinesis Firehose has a fantastic feature that allows you to modify records
    before they get to whatever destination they are going to. This is a
    fantastic feature that’s worth the price of admission.
  - Do not have Lambda functions call each directly unless you are using Lambda
    Destinations. Always use a queue like SQS or EventBridge if Lambda
    Destinations is not available.
  - EventBridge is an excellent message bus for use within AWS. Apart from not
    having FIFO functionality (this could change by the time you read this), it
    has a ton of excellent features, and we highly recommended it.

## Lambda best practices

- As a reminder, you incur the cold start penalty only in two situations. First,
  you’ll see cold starts if your function has never been invoked before or is
  being invoked after an extended period (such that all cached execution
  environments are removed). Second, you’ll see cold starts if there is an
  increase in the incoming request rate such that AWS Lambda needs to spawn new
  execution environments because all available ones are servicing requests.

- We see that increasing the memory in this case keeps the cost relatively flat,
  while increasing the performance ~10x. You’ll typically see these kind of
  gains for CPU-bound functions like image processing; more resources can help
  the function run faster without changing the costs. For I/O-bound operations
  (such as those waiting for a downstream service to respond), you’ll see no
  benefit in increasing the resource allocation. For lightweight run times like
  Node.js and Go, you may be able to reduce the setting to the lowest (128 MB);
  for run times like Java and C#, going lower than 256 MB can have detrimental
  effects to how the run time loads your function code.

- Finding the right resource allocation for your function requires some
  experimentation. The easiest path is to start with a high setting and reduce
  it until you see a change in performance characteristics. You can use the
  popular tuning tool at
  https://github.com/alexcasalboni/aws-lambda-power-tuning to help estimate your
  function’s resource usage.

- AWS Lambda bills your usage based on the time your function starts executing
  to the time it stops executing, not by CPU cycles spent or any other
  time-based metrics. This implies that what your function does during that time
  is important. Consider the image-resizer-service function. When you are
  downloading the S3 object, your code is simply waiting for S3 service to
  respond, and you are paying for that wait time. In this function’s case, the
  time spent is negligible, but this wait time can get excessive for services
  that have long response times (for example, waiting on an EC2 instance being
  provisioned) or wait times (such as downloading a very large file). There are
  two options to minimize this idle time: Minimize orchestration in code—Instead
  of waiting on an operation inside your function, use AWS Step functions to
  separate the “before” and “after” logic as two separate functions. For
  example, if you have logic that needs to run before and after an API call is
  made, sequence them as two separate functions and use an AWS Step function to
  orchestrate between them.

- You can estimate the concurrency of your function at any time with the
  following formula: `Concurrency = Requests per second * Function duration` .
  The connection between function duration and concurrency lies in the idea that
  the longer a function runs, the more likely it is to overlap with other
  function invocations, thus increasing concurrency.

  To illustrate this with a simple example, let's say you have a function that
  takes one second to execute (function duration = 1 second) and it's called 100
  times per second (requests per second = 100). Using the given formula, your
  concurrency would be
  `Concurrency = Requests per second * Function duration = 100 * 1 = 100`.

  Now, if the same function instead took two seconds to execute (function
  duration = 2 seconds), but it's still called 100 times per second, your
  concurrency would then be
  `Concurrency = Requests per second * Function duration = 100 * 2 = 200`.

- You can monitor the concurrency for any given function (and for the overall
  account) using the ConcurrentExecutions CloudWatch metric. AWS Lambda enforces
  two limits to the concurrency of a function

  - There is an account-wide soft limit on the total concurrent executions of
    all functions within the account. This is set by default to 1,000 at the
    time of writing, and it can be raised to desired values through a support
    case. You can view the account-level setting by using the GetAccountSettings
    API and viewing the AccountLimit object.
  - There is also an account-wide limit on the rate at which you can scale up
    your concurrent executions. In larger AWS regions, you are allowed to scale
    instantly to 3,000 concurrent and then add 500 concurrent executions every
    subsequent minute; this limit is lower in smaller regions. These limits may
    change, so be sure to refer to the latest values listed in
    http://mng.bz/80PZ. This makes it important to always estimate what your
    peak and average concurrency needs will be, how quickly you’ll need to ramp
    up, and to file a request to raise limits as needed.

- AWS offers two settings for managing concurrency. The first one is the account
  level concurrency limit that is enforced on the total concurrency across all
  functions within your account. This limit is set to 1,000 by default and can
  be raised through a service limit increase ticket: you cannot “self-service”
  this increase at the time of writing. The second is a per function concurrency
  control, which you can use to control the concurrency of an individual
  function. You only use the per function concurrency control if you have a
  function that you want to “reserve” concurrency for or a function that needs
  to be limited in its concurrency (because of a downstream resource). For
  example, you may want to restrict how high a Lambda function scales because it
  calls an API that can only handle a certain load. If this was left unchecked,
  then your function could cause the downstream API to be overloaded, causing an
  availability for your overall application.

- Serverless applications do not require conventional application performance
  monitoring steps.

- Instead, optimizing the performance of your function code gives you the most
  gain. Use the toolsets (like X-Ray) and configurations (like the memory
  setting) to easily locate and optimize performance.

- Concurrency for Lambda functions can affect your function latency (and vice
  versa), so ensure you monitor and manage it for your critical functions.

## Emerging practices

- Every AWS employee you speak to nowadays will tell you that you should have
  multiple AWS accounts and manage them with AWS Organizations
  (https://aws.amazon.com/organizations). At the minimum, you should have at
  least one AWS account per environment. For larger organizations, you should go
  further and have at least one AWS account per team per environment. There are
  many reasons why this is considered a best practice—regardless of whether
  you’re working with serverless technologies—including those discussed in the
  following sections.

  - Isolate security breaches
  - Eliminate contention for shared service limits
  - Better cost monitoring
  - Using temporary stacks
  - Handle sensitive data securely

- Sensitive data should be encrypted both in transit and at rest. This means it
  should be stored in an encrypted form; within AWS, you can use both the SSM
  Parameter Store and the Secrets Manager to store it. Both services support
  encryption at rest, integrate directly with AWS Key Management Service (KMS),
  and allow you to use Customer Managed Keys (CMKs). The same encrypted at-rest
  principle should be applied to how sensitive data is stored in your
  application. There are multiple ways to achieve this; for example:

  - Store the sensitive data in encrypted form in environment variables and
    decrypt it using KMS during cold start.
  - Keep the sensitive data in SSM Parameter Store or Secrets Manager, and
    during the Lambda function cold start, fetch it from SSM Parameter
    Store/Secrets Manager.

- Use EventBridge in event-driven architectures. Amazon SNS and SQS have long
  been the go-to option for AWS developers when it comes to service integration.
  However, since its rebranding, Amazon EventBridge (formerly Amazon CloudWatch
  Events) has become a popular alternative, and I would argue that it’s actually
  a much better option as the event bus in an event-driven architecture.

  - SNS lets you filter messages via filtering policies. But you can’t filter
    messages by their content, you can only filter by message attributes, and
    you can only have up to 10 attributes per message. If you require
    content-based filtering, then it has to be done in code. EventBridge, on the
    other hand, supports content-based filtering and lets you pattern match
    against an event’s content. With content-based filtering, it’s possible to
    have a centralized event bus in EventBridge. Subscribers can freely
    subscribe to the exact events they want without having to negotiate with the
    event publishers on what attributes to include.

  - Schema discovery: a common challenge with event-driven architectures is
    identifying and versioning event schemas. EventBridge deals with this
    challenge with its schema registry and provides a built-in mechanism for
    schema discovery.

  - Archive and replay events: another common requirement for event-driven
    architectures is to be able to archive the ingested events and replay them
    later. The archive requirement is often part of a larger set of audit or
    compliance requirements and is therefore a must-have in many systems.
    Luckily, EventBridge offers archive and replay capabilities out of the box.
    When you create an archive, you can configure the retention period, which
    can be set to indefinite. You can optionally configure a filter so that only
    matching events are included in the archive.

  - More targets: whereas SNS supports a handful of targets (such as HTTP,
    Email, SQS, Lambda, and SMS), EventBridge supports more than 15 AWS services
    (including SNS, SQS, Kinesis, and Lambda), and you can forward events to
    another EventBridge bus in another account. This extensive reach helps to
    remove a lot of unnecessary glue code. For example, to start a Step
    Functions state machine, you would have needed a Lambda function between SNS
    and Step Functions. With EventBridge, you can connect the rule to the state
    machine directly.

## Well known services

### API Gateway

The Amazon API Gateway is a service that you can use to create an API layer
between the frontend and backend services. The lifecycle management of the API
Gateway allows multiple versions of the API to be run at the same time, and it
supports multiple release stages such as development, staging, and production.
API Gateway also comes with useful features like caching and throttling
requests. The API is defined around resources and methods. A resource is a
logical entity such as a user or product. A method is a combination of an HTTP
verb (such as GET, POST, PUT, or DELETE) and the resource path.

### Appsync

AppSync is a managed GraphQL endpoint provided by AWS.

### Simple Notification Service (SNS)

Amazon Simple Notification Service (SNS) is a scalable pub/sub service designed
to deliver messages. Producers or publishers create and send messages to a
topic. Subscribers or consumers subscribe to a topic and receive messages over
one of the supported protocols. SNS stores messages across multiple servers and
data centers for redundancy and guarantees at-least-once delivery. At-least-once
delivery stipulates that a message will be delivered at least once to a
subscriber, but on rare occasions, due to the distributed nature of SNS, it may
be delivered multiple times.

### Simple Queue Service (SQS)

Simple Queue Service (SQS) is Amazon’s distributed and fault-tolerant queuing
service. It ensures at-least-once delivery of messages similar to SNS and
supports message payloads of up to 256 KB. SQS allows multiple publishers and
consumers to interact with the same queue, and it has a built-in message
lifecycle that automatically expires and deletes messages after a preset
retention period.

### DynamoDB

DynamoDB is Amazon’s NoSQL database. Tables, items, and attributes are Dynamo’s
main concepts. A table stores a collection of items. An item is made up of a
collection of attributes. Each attribute is a simple piece of data such as a
person’s name or phone number. Every

### Relational Database Service (RDS)

Amazon Relational Database Service (RDS) is a web service that helps with the
setup and operation of a relational database in the AWS infrastructure. RDS
supports the Amazon Aurora, MySQL, MariaDB, Oracle, MS-SQL, and PostgreSQL
database engines. It takes care of routine tasks such as provisioning, backup,
patching, recovery, repair, and failure detection. Monitoring and metrics,
database snapshots, and multiple availability zone (AZ) support are provided out
of the box. RDS uses SNS to deliver notifications when an event occurs.

### Media Services

AWS Media Services is a new product designed for developers to build video
workflows. Media Services consist of the following products: MediaConvert is
designed to transcode between different video formats at scale. MediaLive is a
live video-processing service. It takes a live video source and compresses it
into smaller versions for distribution. MediaPackage enables developers to
implement video features such as pause and rewind. It can also be used to add
Digital Right Management (DRM) to content. MediaStore is a storage service
optimized for media. Its aim is to provide a low-latency storage system for live
and on-demand video content. MediaTailor enables developers to insert
individually targeted ads in to the video stream.

### Kinesis Streams

Kinesis Streams is a service for real-time processing of streaming big data.
It’s typically used for quick log and data intake, metrics, analytics, and
reporting. It’s different from SQS in that Amazon recommends that Kinesis
Streams be used primarily for streaming big data, whereas SQS is used as a
reliable hosted queue, especially if more fine-grained control over messages
such as visibility timeouts or individual delays is required. In Kinesis
Streams, shards specify the throughput capacity of a stream. The number of
shards needs to be stipulated when the stream is created, but resharding is
possible if throughput needs to be increased or reduced. In comparison, SQS
makes scaling much more transparent.

### Athena

AWS bills Athena as a serverless interactive query service. Essentially, this
service allows you to query data placed into S3 using standard SQL.

### Cognito

Amazon Cognito is an identity management service. It integrates with public
identity providers such as Google, Facebook, Twitter, and Amazon or with your
own system. Cognito supports user pools, which allow you to create your own user
directory. This lets you register and authenticate users without having to run a
separate user database and authentication service.

### Algolia

Algolia is a (non-AWS) managed search engine API. It can search through
semi-structured data and has APIs to allow developers to integrate search
directly into their websites and mobile applications. One of Algolia’s
outstanding capabilities is its speed. Algolia can distribute and synchronize
data across 15 regions around the world and direct queries to the closest data
center. (AWS CloudSearch alternative)

### Auth0

Auth0 (recently acquired by Okta) is a non-AWS identity management product that
has a few features that Cognito doesn’t. Auth0 integrates with more than 30
identity providers including Google, Facebook, Twitter, Amazon, LinkedIn, and
Windows Live. It provides a way to register new users through the use of its own
user database, without having to integrate with an identity provider.

### Serverless Framework

The Serverless Framework packages your code, uploads it to S3, and provisions
the resources specified in the serverless.yml through CloudFormation.

Through the `serverless-webpack plugin` (https://bit.ly/sls-webpack), you can
also incorporate webpack into the packaging process to tree shake and bundle
JavaScript functions. Doing so can produce much smaller artifacts, which helps
with both deployment time as well as cold-start performance.

> Yan says: I don't do bundling anymore, run into a few problems and it's
> changed my mind about bundling. Problem is with the source maps, for
> non-trivial projects, they get really big (affects cold start) and unhandled
> exceptions add quite a bit of latency (took seconds to get a 502 back in one
> API)

The invoke local command is useful for quickly testing a function locally. It
gives you fast feedback without having to deploy the function to AWS first. You
can also attach a debugger and step through the code line by line (for more
information, see this post http://bit.ly/sls-debug-vscode for how to do it with
VS Code).

> Yan says: I do invoke Lambda functions locally quite a bit for testing, other
> than that, I don't do it often, but I do occasionally use `sls invoke local`
> and attach a JS debugger so I can step through my code, and it's useful for
> debugging problems in more complex biz logic

But what if you want to emulate API Gateway locally? The
`serverless-offline plugin` (http://bit.ly/sls-offline) lets you do exactly that
and emulates API Gateway on a localhost post.

> Yan says: I don't use the serverless-offline plugin, the only time I find it
> useful is when I do SSR - for API endpoints returning JSON, I can eyeball the
> JSON response, and I can get local simulation with just `sls invoke local`.
>
> But for SSR, I need to see the HTML in a browser, and so serverless-offline is
> useful because it gives me a localhost endpoint that I can point to from
> browser

## SAM (Serverless application model )

The main difference between the two is that the Serverless Framework has a
flexible plugin system and a rich ecosystem of existing plugins that can extend
the framework’s capabilities. Whereas with SAM, you’re limited by what it
supports, and there is also no easy way to change the framework’s default
behavior beyond the available configurations.

## CDK (Cloud Development Kit)

General-purpose programming languages give you much more expressive power
compared with configuration files like YAML. This makes CDK a fantastic choice
when it comes to templating some complex AWS environments. CloudFormation offers
a range of templating options with its intrinsic functions and conditionals, but
these are limited and often require complex YAML code to achieve basic branching
logic or mapping input values against a dictionary. CDK makes these child’s play
and can easily express them in a few lines of code in TypeScript or Python.
Being able to use general-purpose programming languages like TypeScript and
Python also means having access to the package managers for those languages.
This means you can take common architectural patterns and create reusable
constructs and share them as packages. The CDK Patterns
(https://cdkpatterns.com) project is a great example of this. Instead of
everyone taking the same recipe and implementing these common patterns from
scratch, you can download the relevant package from NPM and simply customize it.
This is a great way to perpetuate and spread best practices within a large
organization. It makes it easy for teams to discover and share constructs that
have those best practices and organizational norms baked in.

CDK lets you use general-purpose programming languages to describe the resources
you want to provision. It’s a double-edged sword, which offers the full
flexibility that a general-purpose programming language offers as well as the
package management system that comes with that language. It lets developers use
their favorite programming language for both their application code as well as
their infrastructure code and can easily share reusable patterns as packages.

- However, it can also be problematic in organizations where teams use different
  programming languages in their application code. This limits the ability to
  share CDK constructs because the creators of these constructs have to support
  multiple languages.
- Letting developers add business logic to their infrastructure code opens the
  door for extensive customization for complex AWS environments, but it also
  makes infrastructure code harder to comprehend and govern by infrastructure
  teams.

> About unit testing CDK, Yan says: I think the only reason to unit test your
> CDK code (as opposed to the application) is if you have some complex business
> logic that requires testing - ie. there are logic involved, as opposed to just
> declaration which Serverless Framework and SAM doesn't really allow, except
> for when you use funky plugins with SLS.
>
> Terraform does allow some limited logic like loops, etc. but it's so limited I
> don't think you can do anything complicated enough that would necessitate
> focused testing.
>
> CDK brings with it the full expressive power of a programming language, so you
> can add all kinds of logic to your infra-as-code, although you shouldn't, but
> people do, because they can and when they do, and they aren't sure what their
> CDK code would create, then testing become necessary. I'd argue that is a big
> thing to have, and I personally prefer declarative IaC tools that doesn't give
> you that much power.
>
> There are use cases for CDK where that expressive power is necessary, but
> honestly I don't think it applies to most, but the draw of using python/TS and
> not having to learn YML is a big draw for devs

### No, you don't need to test every line of your CDK application

Yan suggests that tests are crucial for reducing defects and improving software
quality but they require time to create and maintain, hence should deliver
value. For Infrastructure as Code (IaC) tools that are declarative, like
Serverless Framework, SAM, or Terraform, unit testing is less critical because
these tools lack business logic that needs validation and AWS CloudFormation
already checks for syntax correctness.

However, this doesn't guarantee that the IaC is semantically correct (meaning
resources are correctly configured), which is why Yan suggests unit testing
might not be effective here due to lack of knowledge about what needs to be
tested.

For CDK, Yan points out that most applications don't require significant
business logic and behave much like declarative configurations. In these cases,
there might not be much value in testing such code, especially when it involves
validating the synthesized CloudFormation template. Doing so often leads to
duplicating work with little return.

When developers create custom constructs or embed business logic into their CDK
application, testing becomes necessary. But when there are rules related to
security and compliance that affect configuration of resources, it's better to
implement these as guardrails baked into the AWS environments using tools like
AWS Config, AWS Organizations, or Security Hub, rather than include these in CDK
tests.

### Pros and Cons of CDK

This is nalysis of the Cloud Development Kit (CDK) for Infrastructure as Code
(IaC). Yan explores the strengths and weaknesses of the CDK in various contexts,
primarily focusing on its use within the enterprise environment.

Strengths of CDK:

Yan notes that CDK allows developers to write infrastructure in their preferred
programming language, which is particularly beneficial in an enterprise setting.
Despite initial concerns about the diversity of languages used across different
teams, this flexibility has not proven to be an issue. CDK offers flexibility
and versatility. It is not focused solely on serverless architecture and allows
developers to manage a variety of infrastructures, such as VPCs and serverful
resources. The ability to create and share custom CDK constructs enables the
enforcement of security best practices and compliance measures across an
organization. Weaknesses of CDK:

CDK is a development kit, not an application development framework. Unlike other
IaC tools like the Serverless framework or SAM, CDK doesn't provide a standard
structure for applications, which can lead to difficulties with onboarding new
team members, inter-team transfers, and the early creation of abstractions and
reusable components. This lack of standard structure could lead to a high
dependency on external agencies that structure and deploy the entire
infrastructure, creating a tighter coupling and making a transition to another
agency potentially challenging.

Yan points out that CDK lacks some features found in other frameworks, such as
the ability to locally invoke Lambda functions, tail Lambda function logs, or
simulate API Gateway. This can lead to extra work for developers as they search
for solutions to these missing features. In conclusion, while Yan doesn't
personally prefer CDK, they recognize its potential in the right context. They
speculate that the problems with CDK may become more apparent in later project
lifecycles, similar to the effects of excessive sugar consumption, but conclude
that only time will tell.

## Amplify CLI

With Amplify CLI, you’re not configuring AWS resources so much as saying what
capabilities you need in your application. Amplify CLI makes the magic happen
and configures the necessary AWS resources with sensible defaults based on your
input. It’s a super-productive tool and can help you build a fully working
application in no time. But it’s also a black box and has no escape hatch that
lets you transition away from it when you reach the limit of what it can do.
This puts you in a precarious position, where you face the real possibility of
having to rebuild the application from the ground up if you ever hit a snag with
Amplify CLI.

## Terraform

Terraform is a popular IaC tool and used by many infrastructure teams. We
explained the problems with using Terraform in serverless applications and why
we strongly recommend against it. It’s an unproductive tool when it comes to
building serverless applications.
