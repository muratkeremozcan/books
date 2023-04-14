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
