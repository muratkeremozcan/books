```bash
# needs node 14
nvm use
npm i # may need force

# configure credentials (needed for deploy and e2e tests)
npm run sls -- config credentials --provider aws --key <yourAWSAccessKeyId> --secret <AWSSecretKey> --overwrite

# deploy
npm run deploy

# invoke step function
npm run invoke:fn -- --name simple-math --data '{"x": 42, "y": 13}'
npm run invoke:fn -- --name parallel-example --data '{"x": 42, "y": 13}'
npm run invoke:fn -- --name modify-execution-state --data '{"x": 1, "y": 2}'
npm run invoke:fn -- --name map-example --data '[{"delay": 1}, {"delay": 3}, {"delay": 5}]'

```

[The state language spec](https://states-language.net/spec.html)

## Step functions 101

### When to use step functions

Pros:

- visual, error handling

- retries are included
  - Makes deciding on timeout setting for lambda function easier (no need to
    consider retry & exponential backoff)
  - Audit: you have the full history of what happened

Cons: 15x more expensive than lambda

When to use?

- Business critical workflows
  - When: stuff that makes money; payment & subscription flows
  - Why: more robust error handling worth the premium
- Complex workflows
  - What: workflows that involve many states, branching logic, etc.
  - Why: visual workflow is a powerful design and diagnostic tool
- Long running workflows
  - What: workflows that cannot complete in 15 minutes (lambda limit)
  - Why: AWS discourages recursive lambda functions, step functions gives you
    explicit branching checks and can timeout at workflow level

Example of when step functions is a better fit (don't do this, prefer step
function instead):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ew49wa8pa8v24ujbq3es.png)

### 7 types of states

#### Task

SM does some work, typically by invoking a lambda.

Default timeout is 60 seconds.

The Resource doesn't have to be lambda, can be a number of other AWS services.

```json
"TaskState":{
  "Type": "Task",
  "Resource": "arn:aws:lambda:us-east-....",
  "Next": "NextState",
  "TimeoutSeconds": 300
}
```

#### Pass

Passes input to output without doing any work

```json
"NoOp" : {
  "Types": "Pass",
  "Result": {
    "is": 42
  },
  "ResultPath": "$.the_answer_to_the_question",
  "Next": "NextState"
}
```

#### Wait

Hard wait. This is useful because hard waiting in lambda can hit the lambda
execution duration limit (15 minutes). With step fns, an execution can run up to
a year, without having to wait for idle time.

```json
"WaitTenSeconds": {
  "Type": "Wait",
  "Seconds": 10,
  "Next": "NextState"
}
```

#### Parallel

Tasks in parallel.

```json
"FunWithMath": {
  "Type": "Parallel",
  "Braches": [
    {
      "StartAt": "Add",
      "States": {
        "Add": {
          "Type": "Task",
          "Resource": "arn:aws:lambda:us-east..",
          "End": true
        }
      }
    },
    ... more (parallel) branches
  ],
  "Next": "NextState"
}
```

#### Choice

Branching logic.

```json
"ChoiceState": {
  "Type": "Choice",
  "Choices": {
    "Variable": "$.name",
    "StringEquals": "Neo",
    "Next": "RedPill"
  },
  "Default": "BluePill"
}
```

#### Succeed & Fail (for Choice)

Some of the state types let you end execution when they complete, but not the
Choice state. For Choice state you may need Succeed and Fail

```js
"SuccessState": {
  "Type": "Succeed"
}
```

```json
"FailState": {
  "Type": "Fail",
  "Error": "TypeA",
  "Cause": "Kaiju Attack",
}
```

### Managing execution state

`if ( x>= 42 && y < 42 )`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/arq8uq414uys0xd4gfg9.png)

You can bind the result to a path in the execution state.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mb8atghumm0vcxg8jahi.png)

When the lambda function for subtract is invoked, we get the current execution
state as input, and we can access the x and y attributes directly.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8htog9e6i47td8nqbiim.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4bhse4cv2j4k1m4l5dfy.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ank6eyh79cwax9ib6ufy.png)

Final execution state becomes 58.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n11j0mp2cwqfrqopxc9n.png)

### Error handling

Retry failed states & Catch (transition to a failure path).

Only applies to **Task** and **Parallel**.

The
[official documentation](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-errors.html#amazon-states-language-retrying-after-error)
on retry behaviour.

The
[official documentation](https://docs.aws.amazon.com/step-functions/latest/dg/limits.html)
on Step Functions service limits,

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/joly3tfekzitnewdiygb.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u8gggqfv90nfhchi483t.png)

### Monitoring & Debugging

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9e1k32dzhihv8g9f5cat.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7mhvj5zxr199r0wcly0u.png)

### Express workflows

[Standard vs Express workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kmcbjtsjqra2a3bbotnr.png)

## Building State Machines

```yml
service: hello-world

frameworkVersion: '3'

plugins:
  - serverless-step-functions

provider:
  name: aws
  runtime: nodejs14.x

functions:
  add:
    handler: handler.add
  double:
    handler: handler.double
  doubleBigNumber:
    handler: handler.doubleBigNumber

stepFunctions:
  stateMachines:
    simple-math: ${file(state_machines/simple-math.yml)}
    parallel-example: ${file(state_machines/parallel-example.yml)}
    modify-execution-state: ${file(state_machines/modify-execution-state.yml)}
```

```yml
# ./state_machines/simple-math.yml

name: simple-math
definition:
  Comment: example to demo function chaining
  StartAt: Add
  States:
    Add:
      Type: Task
      Resource: !GetAtt add.Arn
      Next: IsBigNumber

    IsBigNumber:
      Type: Choice # BRANCHING
      Choices:
        - Variable: $
          NumericGreaterThan: 50
          Next: DoubleBigNumber
      Default: Double

    Double:
      Type: Task
      Resource: !GetAtt double.Arn
      End: true
      Retry: # RETRY
        - ErrorEquals: [NumberIsTooBig]
          MaxAttempts: 0
        - ErrorEquals: [States.ALL]
          MaxAttempts: 3
      Catch: # CATCH
        - ErrorEquals: [NumberIsTooBig]
          Next: DoubleBigNumber # CHAINING

    DoubleBigNumber:
      Type: Task
      Resource: !GetAtt doubleBigNumber.Arn
      End: true
```

```yml
# ./state_machines/parallel-example.yml

name: parallel-example
definition:
  Comment: parallel example
  StartAt: GottaDoThemAll
  States:
    GottaDoThemAll:
      Type: Parallel # PARALLEL TASKS
      Branches:
        - StartAt: Add
          States:
            Add:
              Type: Task
              Resource: !GetAtt add.Arn
              Next: Double # CHAINING
            Double:
              Type: Task
              Resource: !GetAtt doubleBigNumber.Arn
              End: true

        - StartAt: Wait5Seconds
          States:
            Wait5Seconds:
              Type: Wait # WAITING
              Seconds: 5
              End: true

        - StartAt: PickX
          States:
            PickX:
              Type: Pass
              InputPath: $.x
              Next: Double2 # CHAINING
            Double2:
              Type: Task
              Resource: !GetAtt doubleBigNumber.Arn
              End: true
      End: true
```

Parallel states can be nested.

No duplicate state names.

Parallel state execution completes when all its branches have completed. Fails
if any branch fails.

```yml
# ./state_machines/modify-execution-state.yml

name: modify-execution-state
definition:
  Comment: example to demo how to modify execution state
  StartAt: ModifyExecutionState
  States:
    ModifyExecutionState:
      Type: Parallel
      Branches:
        - StartAt: AddZ
          States:
            AddZ:
              Type: Pass
              Result: 42 # Add the result 42
              ResultPath: $.z # attach it to z
              End: true

        - StartAt: OverrideX
          States:
            OverrideX:
              Type: Pass
              Result: 42 # add the result 42
              ResultPath: $.x # override x
              End: true

      Next: Head

    Head:
      Type: Pass
      InputPath: $[0] # array of 2 objects [{x: 1, y: 2, z: 42}, {x: 42, y: 4}], selects the first object
      End: true
```

## Triggers

### API Gateway

Post request to API gateway, triggers a step function, which triggers Tasks (lambdas). Mind that there is no response back.

>  The [official tutorial](https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-api-gateway.html) on triggering a state machine execution using API Gateway

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tlr4ej1kyb05nmy2dbmc.png)

`./Examples/Triggers/API Gateway/serverless.yml`

```yml
service: step-functions-guide

plugins:
  - serverless-step-functions

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev

functions:
  handler:
    handler: functions/handler.handler

stepFunctions:
  stateMachines:
    apiGatewayTrigger:
      name: api-gateway-trigger
      events:
        - http:
            path: /dosomething
            method: POST
      definition:
        Comment: Demonstrate how API Gateway integration works
        StartAt: DoSomething
        States:
          DoSomething:
            Type: Task
            Resource:
              Fn::GetAtt: [HandlerLambdaFunction, Arn]
            End: true
```

Make a post request to the endpoint.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t1fyrcag77zvgz05u31k.png)

The trigger happens:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i4k4u9npva0hrv13hwdk.png)



### Cloudwatch Event

We can do a schedule, or a cloud watch event. We can configure these from the aws console or in our yml.

`./Examples/Triggers/CloudWatch Event/serverless.yml`

> The [official tutorial](https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-cloudwatch-events-s3.html) on triggering a state machine execution using S3 event

```yml
service: step-functions-guide

plugins:
  - serverless-step-functions

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev

functions:
  handler:
    handler: functions/handler.handler

stepFunctions:
  stateMachines:
    cloudWatchEventTrigger:
      name: cloudwatch-event-trigger
      events:
        
        - schedule: 
            rate: rate(1 minute)
            input:
              foo: bar

        ## Or, we can
        # - cloudwatchEvent:
        #     event:
        #       source:
        #         - aws.s3
        #       detail-type:
        #         - AWS API Call via CloudTrail
        #       detail:
        #         eventSource:
        #           - s3.amazonaws.com
        #         eventName:
        #           - PutObject
        #         requestParameters:
        #           bucketName: 
        #             - bucket name goes here
      definition:
        Comment: Demonstrate how CloudWatch Event integration works
        StartAt: DoSomething
        States:
          DoSomething:
            Type: Task
            Resource: 
              Fn::GetAtt: [HandlerLambdaFunction, Arn]
            End: true
```



## Activities

State machine waits for activity to be complete. Once the activity is done, the state machine resumes execution.![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cii51apmpu9yl3ojeavf.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q8foh8uubu9kztiq4zc3.png)

Create the activity ahead of time and note down the arn.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zjlkc0wck6mt815m581d.png)

`./Examples/Activities/serverless.yml`

```yml
service: step-functions-guide

plugins:
  - serverless-step-functions
  - serverless-pseudo-parameters

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev

stepFunctions:
  stateMachines:
    activityExample:
      name: activities-example
      definition:
        Comment: Demonstrate how activity works
        StartAt: WaitForActivity
        States:
          WaitForActivity:
            Type: Task
            Resource: arn:aws:states:#{AWS::Region}:#{AWS::AccountId}:activity:myActivity
            End: true
  activities:
    - myActivity
```

We have a task that's waiting for an activity to complete.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/px4o36kz5unyovwm5byt.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qjfulsbox51syc118w83.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/39860calytnvfxnkei00.png)
