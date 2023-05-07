[The state language spec](https://states-language.net/spec.html)

## Step functions 101

### When to use step functions

Pros: 

	* visual, error handling 
 * retries are included
   * Makes deciding on timeout setting for lambda function easier (no need to consider retry & exponential backoff)
	* Audit: you have the full history of what happened

Cons: 15x more expensive than lambda

When to use?

* Business critical workflows
  * When: stuff that makes money; payment & subscription flows
  * Why: more robust error handling worth the premium
* Complex workflows
  * What: workflows that involve many states, branching logic, etc.
  * Why: visual workflow is a powerful design and diagnostic tool
* Long running workflows
  * What: workflows that cannot complete in 15 minutes (lambda limit)
  * Why: AWS discourages recursive lambda functions, step functions gives you explicit branching checks and can timeout at workflow level

Example of when step functions is a better fit (don't do this, prefer step function instead):

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

Hard wait. This is useful because hard waiting in lambda can hit the lambda execution duration limit (15 minutes). With step fns, an execution can run up to a year, without having to wait for idle time.

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

Some of the state types let you end execution when they complete, but not the Choice state. For Choice state you may need Succeed and Fail

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

When the lambda function for subtract is invoked, we get the current execution state as input, and we can access the x and y attributes directly.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8htog9e6i47td8nqbiim.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4bhse4cv2j4k1m4l5dfy.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ank6eyh79cwax9ib6ufy.png)

Final execution state becomes 58.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n11j0mp2cwqfrqopxc9n.png)

### Error handling

Retry failed states & Catch (transition to a failure path).

Only applies to **Task** and **Parallel**.

The [official documentation](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-errors.html#amazon-states-language-retrying-after-error) on retry behaviour

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/joly3tfekzitnewdiygb.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u8gggqfv90nfhchi483t.png)