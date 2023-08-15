## ## [Ch1 Getting started with IaC and AWS CDK](https://www.youtube.com/watch?v=0iemvZUdX-Y&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=2)



### Install / update AWS CLI

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

### Configure CDK profile

`aws configure --profile cdk`

Need access key id, secret access key, region (us-east-1), and output as (json).

You essentially create a new named profile called `cdk`. This profile will have its own set of credentials (Access Key ID and Secret Access Key) and configuration settings (like the default region and output format).

Appending `--profile cdk` will specify to use this profile in the upcoming commands.

### Create CDK app

`cdk init app --language typescript`

### Creating a containerized web app

```ts
// ./lib/chapter-1-getting-started-with-iac-and-aws-cdk-stack.ts
import {Stack, StackProps} from 'aws-cdk-lib'
import {ContainerImage} from 'aws-cdk-lib/aws-ecs'
import {ApplicationLoadBalancedFargateService} from 'aws-cdk-lib/aws-ecs-patterns'
import {Construct} from 'constructs'

export class Chapter1GettingStartedWithIacAndAwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new ApplicationLoadBalancedFargateService(this, 'MyWebServer', {
      taskImageOptions: {
        image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      publicLoadBalancer: true,
    })
  }
}
```

```ts
// ./bin/chapter-1-getting-started-with-iac-and-aws-cdk.ts
#!/usr/bin/env node
import 'source-map-support/register'
import {App} from 'aws-cdk-lib'
import {Chapter1GettingStartedWithIacAndAwsCdkStack} from '../lib/chapter-1-getting-started-with-iac-and-aws-cdk-stack'

const app = new App()
new Chapter1GettingStartedWithIacAndAwsCdkStack(
  app,
  'Chapter1GettingStartedWithIacAndAwsCdkStack',
  {},
)
```

Bootstrap the AWS environment, meaning create all the necessary AWS resources on the cloud to make CDK work properly. This has to be done once, for the region.

`cdk bootstrap --profile cdk`

Deploy the stack.

`cdk deploy --profile cdk`

To remove the stack:

`cdk destroy --profile cdk`

You can use `synth` to compile/translate the TS code into a CloudFormation stack, useful to check if the TS code produces valid IaC.

`cdk synth`

You can have cdk log more for debugging:

-v: Verbose -vv: Very verbose -vvv: Extremely verbose For instance, when deploying using cdk deploy, you can see a lot more information about the status of the deployment if you pass in one of the aforementioned flags, like so: `cdk deploy --profile cdk -vv`

## [Ch2: A starter project and core concepts](https://www.youtube.com/watch?v=ChUPD-MAjoA&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=2)

Goal: Learn about the relationship between stack, construct, and how to instantiate the cdk app.



Create some folders; web, infrastructure. Init cdk on infrastructure directory.

Stack > Construct. Stack is your everything (CloudFormation stack). Construct is any AWS resource, or a combination of them.

> ```bash
> tree -I node_modules  # full tree
> ```

The convention is that there is a bin folder for the instantiation of the stack.
And there is a lib folder for the constructs and the stack

```bash
bin # instantiation of the stack
└── infrastructure.ts
lib # stack & constructs
├── constructs # all the constructs
│   └── S3Bucket
│       └── index.ts
└── index.ts # the stack
```

The S3 construct:

```ts
// ./infrastructure/lib/constructs/S3Bucket/index.ts
import {RemovalPolicy} from 'aws-cdk-lib'
import {Bucket} from 'aws-cdk-lib/aws-s3'
import {Construct} from 'constructs'

// This is an interface we use to pass the environment as a variable to the construct
interface Props {
  environment: string
}

export class S3Bucket extends Construct {
  // the bucket property is defined outside the constructor
  // because it is meant to be part of every instance of the class,
  // holding a value that persists for the lifetime of the object.
  // Its purpose is to hold state that other methods in the class
  //  might need to access or modify.
  public readonly bucket: Bucket

  // on the other hand, scope, id, and props are only needed temporarily
  // to set up the new instance
  // Every construct needs to implement a constructor
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const removalPolicy =
      props.environment === 'prod'
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY

    this.bucket = new Bucket(scope, 'Bucket-S3', {
      // in non-prod when the stack is deleted, the bucket should be destroyed
      removalPolicy,
    })
  }
}
```

The stack:

```ts
// ./infrastructure/lib/index.ts

import {Stack} from 'aws-cdk-lib'
import type {StackProps} from 'aws-cdk-lib'
import type {Construct} from 'constructs'
import {S3Bucket} from './constructs/S3Bucket'

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // the constructs that defines your stack goes here

    // does not matter whether there is an assignment to a variable or not
    // the instantiation causes the construct to be created
    new S3Bucket(this, 'MyRemovableBucket', {
      environment: 'development',
    })
  }
}
```

The instantiation of the stack:

```ts
// ./infrastructure/bin/infrastructure.ts

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebStack } from "../lib";

const app = new cdk.App();
new WebStack(app, "WebStack", {});
```

Test by deploying and destroying
```bash
cdk deploy --profile cdk
cdk destroy --profile cdk
```

https://constructs.dev/  package manager for cdk

## [Ch3: Practical Cloud Development with AWS CDK](https://www.youtube.com/watch?v=9c6lQ-nklrs&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=3)

Goal:

* Set up DynamoDB tables.
* Serve static HTML files and SPAs via S3 buckets.
* Deploy Docker-based image on ECS.



In the server folder, set `AWS_PROFILE` and `PORT` as environment variables. 

Our backend will need to connect to DynamoDB, and we are going to be giving it access via the AWS AccessKeyID and SecretAccessKey that you provisioned for yourself. By exporting the AWS profile, you give CDK the directions to search for the credentials without having to create an .env file.

```bash
export AWS_PROFILE=cdk
export PORT=3001

yarn install
yarn dev
```

Create an infrastructure directory and initialize cdk app. 

> ```bash
> nvm alias default 18 # to set default node version for CLI
> ```

```bash
cdk init app --language typescript
```

Build the web, server, infrastructure as shown in the code. 

One of the key points is the stack file, which has 3 constructs; DDB, ECS (Elastic Container Service) to host the backend, S3 to hold frontend files.

```ts
// ./infrastructure/lib/chapter-3-stack.ts

import {Stack, StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'

import {Dynamodb} from './constructs/Dynamodb'
import {ECS} from './constructs/ECS'
import {S3} from './constructs/S3'

export class Chapter3Stack extends Stack {
  public readonly dynamodb: Dynamodb
  public readonly s3: S3
  public readonly ecs: ECS

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // the 3 constructs
    this.dynamodb = new Dynamodb(this, 'Dynamodb') 
    this.s3 = new S3(this, 'S3') // for frontend files
    this.ecs = new ECS(this, 'ECS', { // to host the backend
      dynamodb: this.dynamodb,
    })
  }
}
```

To spin up a DDB table, we just instantiate the `Table` class from `aws-cdk-lib/aws-dynamodb`.

```ts
// ./infrastructure/lib/constructs/Dynamodb.ts
import {Construct} from 'constructs'
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb'
import {RemovalPolicy} from 'aws-cdk-lib'

export class Dynamodb extends Construct {
  public readonly main_table: Table

  constructor(scope: Construct, id: string) {
    super(scope, id)

    // instantiate the Table class from aws-cdk-lib/aws-dynamodb
    this.main_table = new Table(scope, 'MainTable', {
      partitionKey: {
        name: 'partition_key',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sort_key',
        type: AttributeType.STRING,
      },
      tableName: 'main_table',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}
```

S3 has the capability to act as a content server for our files, and our front end app is a single page app.

```ts
// ./infrastructure/lib/constructs/S3.ts

import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from 'aws-cdk-lib/aws-s3'
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment'
import {Construct} from 'constructs'
import {resolve} from 'path'
import {CfnOutput, RemovalPolicy} from 'aws-cdk-lib'
import {v4 as uuidv4} from 'uuid'

export class S3 extends Construct {
  public readonly web_bucket: Bucket
  public readonly web_bucket_deployment: BucketDeployment

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.web_bucket = new Bucket(scope, 'WebBucket', {
      bucketName: `chapter-3-web-bucket-${uuidv4()}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // so that the bucket is deleted when the stack is destroyed, even tho not empty
    })
    // we specify where to get the build folder from
    this.web_bucket_deployment = new BucketDeployment(
      scope,
      'WebBucketDeployment',
      {
        sources: [
          Source.asset(resolve(__dirname, '..', '..', '..', 'web', 'build')),
        ],
        destinationBucket: this.web_bucket,
      },
    )
    // so that we output the url after the deploy is finished
    new CfnOutput(scope, 'FrontendURL', {
      value: this.web_bucket.bucketWebsiteUrl,
    })
  }
}
```

Comments included below for what the code does:
```ts
// ./infrastructure/lib/constructs/ECS.ts

import {CfnOutput, Duration} from 'aws-cdk-lib'
import {InstanceType, Vpc} from 'aws-cdk-lib/aws-ec2'
import {Construct} from 'constructs'
import {
  Cluster,
  ContainerDefinition,
  ContainerImage,
  Protocol,
  LogDriver,
  FargateService,
  FargateTaskDefinition,
} from 'aws-cdk-lib/aws-ecs'
import {
  ApplicationListener,
  ApplicationLoadBalancer,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import {Dynamodb} from './Dynamodb'
import {resolve} from 'path'

interface Props {
  dynamodb: Dynamodb
}

export class ECS extends Construct {
  public readonly vpc: Vpc
  public readonly cluster: Cluster
  public readonly task_definition: FargateTaskDefinition
  public readonly container: ContainerDefinition
  public readonly service: FargateService
  public readonly load_balancer: ApplicationLoadBalancer
  public readonly listener: ApplicationListener

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    // Fargate will be spinning up EC2 machines that run our ECS containers
    // Therefore we need a virtually isolated private cloud; VPC
    // VPC is an environment with a network isolated from the rest of the customers of AWS
    // to safely set up virtual machines or do all kinds of networking magic.
    this.vpc = new Vpc(scope, 'Vpc', {maxAzs: 2})
    // next we setup an ECS cluster that holds a group of ECS services (one for now)
    this.cluster = new Cluster(scope, 'EcsCluster', {vpc: this.vpc})
    this.cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new InstanceType('t2.micro'),
    })

    // This section creates the ECS task definition.
    // A task definition contains information about what the ECS service needs to run.
    this.task_definition = new FargateTaskDefinition(scope, 'TaskDefinition')
    // In this example, we are pointing to the Dockerfile located at ./server/Dockerfile.
    // Define how much memory should be assigned to the task
    // and also ask AWS to kindly keep hold of the logs of the application.
    // As seen during the deployment, CDK builds the image on your behalf
    // and deals with all the necessary steps to upload the image to ECR
    // and make it available for the ECS task definition
    this.container = this.task_definition.addContainer('Express', {
      image: ContainerImage.fromAsset(
        resolve(__dirname, '..', '..', '..', 'server'),
      ),
      memoryLimitMiB: 256,
      logging: LogDriver.awsLogs({streamPrefix: 'chapter3'}),
    })

    // This part sets up all the port mapping and the load balancer for our backend.
    // It tells the load balancer that it should forward any traffic it receives on port 80
    // and hand it over to our ECS service.
    // It also indicates to the load balancer that it can check whether the service is up
    // by periodically calling the /healthcheck endpoint of our backend application.
    this.container.addPortMappings({
      containerPort: 80,
      protocol: Protocol.TCP,
    })
    this.service = new FargateService(scope, 'Service', {
      cluster: this.cluster,
      taskDefinition: this.task_definition,
    })
    this.load_balancer = new ApplicationLoadBalancer(scope, 'LB', {
      vpc: this.vpc,
      internetFacing: true,
    })
    this.listener = this.load_balancer.addListener('PublicListener', {
      port: 80,
      open: true,
    })
    this.listener.addTargets('ECS', {
      port: 80,
      targets: [
        this.service.loadBalancerTarget({
          containerName: 'Express',
          containerPort: 80,
        }),
      ],
      healthCheck: {
        interval: Duration.seconds(60),
        path: '/healthcheck',
        timeout: Duration.seconds(5),
      },
    })

    // granting all the necessary permissions so that the API can perform 
    // the desired actions on DynamoDB, in this case, read and write permissions:
    props.dynamodb.main_table.grantReadWriteData(this.task_definition.taskRole)

    // so that we output the url after the deploy is finished
    new CfnOutput(scope, 'BackendURL', {
      value: this.load_balancer.loadBalancerDnsName,
    })
  }
}
```



Check infrastructure with `cdk synth`. I will try to build the UI app, and the infrastructure, then check with cdk.

Start docker on your laptop, and deploy them all with 

```bash
cdk deploy --profile cdk
```

> I had to modify ./server/Dockerfile to use node 16 and the npm registry
>
> ```dockerfile
> FROM amd64/node:16
> 
> WORKDIR /server
> 
> COPY . .
> 
> RUN npm install --registry https://registry.npmjs.org && npm run build
> 
> EXPOSE 80
> 
> ENTRYPOINT ["npm", "run", "start"]
> ```

After 10 mins, we get backend and frontend url outputs. Copy the backend url to the web/src/components/Main/index.ts.

```bash
Chapter3Stack.BackendURL = Chapt-LB8A1-2V5FSD3MIQEJ-1453091419.us-east-1.elb.amazonaws.com
Chapter3Stack.FrontendURL = http://chapter-3-web-bucket-a9b56e63-4748-4151-ab72-7f014b5a4147.s3-website-us-east-1.amazonaws.com
```

`yarn build`, go to the infrastructure folder and deploy again.

Check the urls.
Remove with `cdk destroy --profile cd`

## [Ch4: Complete the web app deployment with AWS CDK](https://www.youtube.com/watch?v=zyzZcgsIFmc&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=4)

* Set up DNS for both frontend and backend URLs using Route 53 

* Secure these endpoints with AWS ACM-provided TLS certificates (transport layer security, successor to SSL; secure socket layer)

* Setting up a CloudFront distribution for our frontend assets

* Create an AWS RDS-backed MySQL database with CDK and seed data 

  

At AWS console > Route 53 > Registered domains > click Register domains. Use a .click domain extension for cheapest.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vnbhukgq83f80n8l9kk9.png)

Create a `config.json` file at the folder root with the content:
```json
{
  "domain_name": "cdkbookmurat.click",
  "backend_subdomain": "backend-cdk-book",
  "frontend_subdomain": "frontend-cdk-book"
}
```

Create a TLS certificate to secure the communication between the web app and user browsers. (This part is codified later)

* Go to Certificate Manager in the top AWS console search box. 

* Click on Request, select Request a public certificate, and click Next.

* In Fully qualified domain name, enter your domain `cdkbookmurat.click`

* Add another name to this certificate and enter `*cdkbookmurat.click`. Request the certs

  > This did not work. Had to enter `backend-cdk-book.cdkbookmurat.click` and `frontend-cdk-book.cdkbookmurat.click`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x7uz2utntyex7pm1cymq.png)

* Leave the above tab open. Go to Route53 > Hosted zones > click on your hosted zone name `cdkbookmurat.click` 

* Copy the name and values into Create record. Select CNAME for record type, and for record name it comes with the `.cdkbookmurat.click`  so do not copy that part over (yes, terrible devex Amazon as usual). Have to create 3 records for 3 certs.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g79xqat2nrlap4xqm65c.png)

At the end things should look like this:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7edk114trcpejr0yg7cn.png)

The above can be codified:

```ts
// ./infrastructure/lib/constructs/ACM/index.ts
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import {IHostedZone} from 'aws-cdk-lib/aws-route53'
import {Construct} from 'constructs'

import {domain_name} from '../../../../config.json'

interface Props {
  hosted_zone: IHostedZone
}

export class ACM extends Construct {
  public readonly certificate: Certificate

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    // I owe you an apology. At the beginning of this chapter, we made you buy a domain
    // and then validate the domain to be able to issue the ACM TLS certificate.
    // The domain buying bit you had to do, but the ACM certificate verification part you didn’t.
    //  Curse me as you wish, but we wanted to show you how much time and effort you could save
    // if you switched to AWS CDK. Let me show you what we mean.
    // This whole drama is automatically achieved by the following single block of code,
    this.certificate = new Certificate(scope, 'Certificate', {
      domainName: domain_name,
      validation: CertificateValidation.fromDns(props.hosted_zone),
      subjectAlternativeNames: [`*.${domain_name}`],
    })
  }
}

```

Here I copied off web and server folders again from the source code - so many changes overlooked in the book and it's not worth transforming ch3 to ch4 for web and server folders. 

> Had to update the Dockerfile at server with npm registry
>
> ```dockerfile
> FROM node:lts-alpine@sha256:9a2db0008b592cfde1b98aa8972a8051ccb80bb51dde8b06c3a2e3762794e89c
> 
> RUN apk add dumb-init
> 
> WORKDIR /
> 
> COPY --chown=node:node . .
> 
> RUN npm install --registry https://registry.npmjs.org
> 
> ENV NODE_ENV production
> 
> RUN npm run build
> 
> EXPOSE 80
> 
> USER node
> 
> ENTRYPOINT ["dumb-init", "--"]
> 
> CMD ["npm", "run", "forever"]
> ```

Install at web and server folders. `build` at web folder.

I did not copy over the infrastructure folder, because that's where the juice is. But, changed every occurrence of `chapter-3` to `chapter-4`  there. 

Start docker. Deploy at infrastructure folder. Make sure you `cdk destroy --profile cdk` at Chapter 3 Infrastructure folder

```bash
cdk deploy --profile cdk
```

### MySQL powered by AWS RDS

The author wants to simulate a scenario where we might have a SQL db and we want to migrate it to AWS RDS. 

1. Create the RDS MySQL instance using AWS CDK.
2. Once created, tie in the CloudFormation step completion of the database to a custom resource. 
3. This custom resource, in turn, triggers a custom Docker image AWS Lambda function. 
4. The Lambda function connects to the database and populates it using the script.sql file.

```ts
// ./infrastructure/lib/constructs/RDS/index.ts

import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as rds from 'aws-cdk-lib/aws-rds'
import {CfnOutput, Duration, Token} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {RetentionDays} from 'aws-cdk-lib/aws-logs'
import {DockerImageCode} from 'aws-cdk-lib/aws-lambda'

import {CDKResourceInitializer} from './custom'

interface Props {
  vpc: ec2.Vpc
}

export class RDS extends Construct {
  public readonly instance: rds.DatabaseInstance

  public readonly credentials: rds.DatabaseSecret

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const instance_id = 'my-sql-instance'
    const credentials_secret_name = `chapter-4/rds/${instance_id}`

    // How do we go about generating a password for MySQL, while not having it in the Git history?
    // And how do we then share these secrets with relevant components securely?
    // The DatabaseSecret construct of the aws-rds library receives a secret name and a username as parameters
    //  and creates an, erm, secret in the AWS SecretsManager service.
    // in the next section, we assign this set of credentials to the RDS MySQL instance:
    this.credentials = new rds.DatabaseSecret(scope, 'MySQLCredentials', {
      secretName: credentials_secret_name,
      username: 'admin',
    })

    // SPINNING UP THE RDS INSTANCE
    // We are creating a MySQL RDS database instance with the MySQL engine version 8.0.28.
    // The name of the database will be todolist.
    // The database will be hosted by an EC2 machine of the T2 type with a Small instance size.
    // We are defining ports and their accessibility within the VPC.
    // We are using a VPC that is passed down higher on the stack and asking RDS to spin up the EC2 instance within a private subnet.
    this.instance = new rds.DatabaseInstance(scope, 'MySQL-RDS-Instance', {
      credentials: rds.Credentials.fromSecret(this.credentials),
      databaseName: 'todolist',
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_28,
      }),
      instanceIdentifier: instance_id,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.SMALL,
      ),
      port: 3306,
      publiclyAccessible: false,
      vpc: props.vpc,
      vpcSubnets: {
        onePerAz: true,
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    })

    // instantiating the CDKResourceInitilizer construct:
    // We create a CDKResourceInitilizer custom construct, which, in turn, spins up a Lambda function.
    // We define the log retention and length of the Lambda function’s execution timeout.
    // Since we only have one data point to inject, we don’t need anything longer than two minutes.
    // The Lambda function is backed by a custom Dockerfile we are passing to the custom construct.
    // We also pass the same VPC and subnet network details for our Lambda function to run.
    const initializer = new CDKResourceInitializer(scope, 'MyRdsInit', {
      // Here, we are passing down the secret name to CDKResourceInitilizer
      // so that we know where to get the secret from
      config: {
        credentials_secret_name,
      },
      function_log_retention: RetentionDays.FIVE_MONTHS,
      function_code: DockerImageCode.fromImageAsset(`${__dirname}/init`, {}),
      function_timeout: Duration.minutes(2),
      function_security_groups: [],
      vpc: props.vpc,
      subnets_selection: props.vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      }),
    })

    // we define the RDS instance as a dependency for this CustomResource.
    // This means RDS needs to be up and running before CustomResource is spun up:
    initializer.custom_resource.node.addDependency(this.instance)

    // We have to explicitly give these permissions to the initializer function:
    this.credentials.grantRead(initializer.function)

    this.instance.connections.allowFrom(
      initializer.function,
      ec2.Port.tcp(3306),
    )

    /* ----------
     * Returns the initializer function response,
     * to check if the SQL was successful or not
     * ---------- */
    new CfnOutput(scope, 'RdsInitFnResponse', {
      value: Token.asString(initializer.response),
    })
  }
}
```



> Changed the docker file at `.infrastructure/lib/constructs/RDS/init/Dockerfile` with node 16 and npm registry.
>
> ```dockerfile
> FROM amazon/aws-lambda-nodejs:16
> WORKDIR ${LAMBDA_TASK_ROOT}
> 
> COPY package.json ./
> RUN npm install --only=production --registry https://registry.npmjs.org
> COPY index.js ./
> COPY script.sql ./
> 
> CMD [ "index.handler" ]
> ```

```ts
// ./infrastructure/lib/chapter-4-stack.ts

import {Stack, StackProps} from 'aws-cdk-lib'
import {Port, SubnetType, Vpc} from 'aws-cdk-lib/aws-ec2'
import {PolicyStatement} from 'aws-cdk-lib/aws-iam'
import {Construct} from 'constructs'

import {ECS} from './constructs/ECS'
import {RDS} from './constructs/RDS'
import {S3} from './constructs/S3'
import {Route53} from './constructs/Route53'
import {ACM} from './constructs/ACM'

export class Chapter3Stack extends Stack {
  public readonly acm: ACM

  public readonly ecs: ECS

  public readonly rds: RDS

  public readonly route53: Route53

  public readonly s3: S3

  public readonly vpc: Vpc

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Here, we are referencing the hosted zone that was created alongside the domain you purchased,
    this.route53 = new Route53(this, 'Route53')
    // as well as initializing the ACM level 3 construct and passing the hosted zone as a parameter
    this.acm = new ACM(this, 'ACM', {
      hosted_zone: this.route53.hosted_zone,
    })

    // Next, we are creating an AWS VPC to host the ECS application container and RDS database,
    // and for the data-seeding Lambda:
    // We have created an isolated private subnet to house the MySQL instance
    // since isolated subnets don’t have NAT gateways that route traffic to the internet, adding another layer of security.
    this.vpc = new Vpc(this, 'MyVPC', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'compute',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })

    // initialize S3
    this.s3 = new S3(this, 'S3', {
      acm: this.acm,
      route53: this.route53,
    })
    // initialize RDS
    this.rds = new RDS(this, 'RDS', {
      vpc: this.vpc,
    })
    // initialize ECS
    this.ecs = new ECS(this, 'ECS', {
      rds: this.rds,
      vpc: this.vpc,
      acm: this.acm,
      route53: this.route53,
    })
    // allow connections from the ECS container to the RDS database:
    this.rds.instance.connections.allowFrom(this.ecs.cluster, Port.tcp(3306))

    this.ecs.task_definition.taskRole.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [this.rds.credentials.secretArn],
      }),
    )
    // Finally, we want to make sure the RDS database is up and running before kicking off the application container.
    // So, we have to declare the RDS instance as a dependency.
    this.ecs.node.addDependency(this.rds)
  }
}
```

## [Ch5: CI with CDK](https://www.youtube.com/watch?v=KqmjUiIgNX0&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=5)

TL, DR; Pretty much forget about this chapter if you don't care about CodePipeline.

We need a way for Codepipeline to access our GitHub repo and know about the changes. CodePipeline has a Source step which needs a Github personal access token.

Profile > Settings > Developer Settings > Personal access tokens > Fine grained tokens

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4luljbe4ymih7ae0jkpl.png)'



![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lfx5rmkw8qwhhdlgdefh.png)



![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/no4yatay64ja8ks7weij.png)

At the top right, click the Generate new token button.

Fill in the token name, naming it aws-cdk-book or any other name to your liking. 

Set the expiry as 30 days. 

Under the Repository access section, pick Only select repositories. From the drop-down list, pick the repository. 

Under Permissions, click Repository. Here, we have to give CodeBuild the correct access so that it’s able to be notified of code changes. From the list, pick the following items and give CodeBuild read and write access: Commit statuses, Metadata, Contents, and Webhooks. 

Click Generate token. On the next page, you will receive a token starting with github_pat_ followed by some random alphanumerical values. Copy it and keep it handy and safe.

Create 2 files `.env.production` `.env.development`, paste the token.

```
GITHUB_TOKEN=***
NODE_ENV=Production # and another for Development
```

Make sure to update the values for the owner and repo properties to match your own before deploying the pipeline.

Deploy with:

`yarn cdk:pipeline deploy --profile cdk`

This file is a real piece of work and makes cdk deploy and destroy work via env vars
If you don't setup the env var , you will get `This app contains no stacks` error.

If you want to make work cdk deploy or destroy work regularly, comment out the conditional parts.


```ts
// ./infrastructure/bin/chapter-5.ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { config } from 'dotenv';

import { Chapter5Stack } from '../lib/chapter-5-stack';
import { Chapter5PipelineStack } from '../lib/chapter-5-pipeline-stack';

config({ path: '.env.production' });

const app = new cdk.App();

if (['ONLY_DEV'].includes(process.env.CDK_MODE || '')) {
  new Chapter5Stack(app, `Chapter5Stack-${process.env.NODE_ENV || ''}`, {
    env: {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    },
  });
}

if (['ONLY_PROD'].includes(process.env.CDK_MODE || '')) {
  new Chapter5Stack(app, `Chapter5Stack-${process.env.NODE_ENV || ''}`, {
    env: {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    },
  });
}

if (['ONLY_PIPELINE'].includes(process.env.CDK_MODE || '')) {
  new Chapter5PipelineStack(app, 'Chapter5PipelineStack', {
    env: {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    },
  });
}

```

```ts
// ./infrastructure/lib/chapter-5-pipeline-stack.ts
/* ---------- External libraries ---------- */
import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { IBaseService } from 'aws-cdk-lib/aws-ecs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/* ---------- Constructs ---------- */
import { PipelineStack } from './constructs/Pipeline/index';

interface PipelineProps extends StackProps {
  bucket?: IBucket;
  repository?: IRepository;
  expressAppService?: IBaseService;
}

export class Chapter5PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    /* ---------- Constructs ---------- */
    new PipelineStack(this, 'Chapter5-Pipeline-Prod', {
      environment: 'Production',
    });

    new PipelineStack(this, 'Chapter5-Pipeline-Dev', {
      environment: 'Development',
    });

    /* ---------- Tags ---------- */
    Tags.of(scope).add('Project', 'Chapter5-Pipeline');
  }
}

```

There is a horrid file at `./infrastructure/lib/constructs/Pipeline/index.ts` which explains the CodePipeline. Seriously, use GitHub Actions... Here's the GHA version of the same thing.

```yml
name: Chapter5 CI/CD Pipeline

on:
  push:
    branches:
      - [your-branch-name] # Replace with the name of your branch

jobs:
  backend-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd server/
          yarn install

      - name: Test Backend
        run: |
          cd server/
          yarn test

  frontend-test:
    needs: backend-test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd web/
          yarn install

      - name: Test Frontend
        run: |
          cd web/
          yarn test

  build-and-deploy:
    needs: frontend-test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd web/
          yarn install
          cd ../server/
          yarn install
          cd ../infrastructure/
          yarn install

      - name: Build Web and Infrastructure
        run: |
          cd web/
          [your-build-command] # Replace with your actual build command for the frontend
          cd ../infrastructure/
          [your-deploy-command] # Replace with your actual deploy command for the infrastructure
```



## [Ch6: Testing & Troubleshooting AWS CDK Apps](https://www.youtube.com/watch?v=mWI8IYmnxZQ&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=7)

Create a file `.env.testing` under infrastructure.

CDK needs these environment variables to fill up certain values in the CloudFormation output. These same values could be fed into the stack with a --profile flag when deploying the stack, but since we are running tests using the jest and yarn commands here, we need to pass them in using environment variables.

`aws sts get-caller-identity --query Account --output text` will get you the account id.

```
CDK_DEFAULT_ACCOUNT=****
CDK_DEFAULT_REGION=us-east-1
GITHUB_TOKEN=****
```

Install the web folder, and this time use `yarn build:dev`

Install the server folder.

Run `cdk synth` in infrastructure folder to generate the CF template (`yarn cdk:synth` script for repo specific modifiers).

The author states about cdk testing:

* Fine-grained assertions: These types of tests are similar to unit testing and are performed to detect regressions. They are conducted with the AWS CDK assertions module (found at https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html), which integrates with common testing frameworks such as Jest (https://jestjs.io/) and essentially tests that certain modules in our CDK app have certain properties – for example, a certain EC2 instance will have a specific AMI.
*  Snapshot tests: Closer to integration testing, snapshot tests don’t care how you wire up your CDK application. They compare the output of a synthesized CDK stack to a previous state after changes have been applied. Snapshot tests are a great way to refactor your CDK application while making sure the outputs are the same (another way to deal with regression issues).

There is a long file at `./mycode/chapter-6-testing-and-troubleshooting-cdk-applications/infrastructure/test/chapter-6-stack.test.ts`.  It is important to ask: What are we truly validating? **Are we inspecting our own business logic, or are we, in essence, evaluating the CDK's foundational ability to perform its basic function of generating a CloudFormation template**? It's analogous to buying a calculator and then continually testing if it can add two numbers correctly. Unless you're using the calculator in complex, unconventional ways (akin to introducing business logic in CDK), such tests seem superfluous.

I think the only reason to unit test your CDK code (as opposed to the application) is if you have some complex business logic that requires testing - ie. there are logic involved, as opposed to just declaration which Serverless Framework and SAM doesn't really allow, except for when you use plugins with SLS.

CDK brings with it the full expressive power of a programming language, so you can add all kinds of logic to your infra-as-code, although you shouldn't, but people do, because they can and when they do, and they aren't sure what their CDK code would create, then testing become necessary.

**Troubleshooting cdk problems:**

Use `-v` or `-vv`  (verbose, very verbose)
`cdk deploy --profile cdk -vv`

AWS CloudFormation has a hard limit of 500 resources per stack. Going over this limit will result in an error when creating the stack. Reduce the number of resources.

Non-deleted resources: some resources that can hold user data are kept.

To avoid this, you can set the removal policy of resources such as S3 buckets and DynamoDB tables to destroy so that they are automatically deleted when the stack is deleted: 

```ts
new s3.Bucket(this, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
})
```

## [Ch7: Serverless Development with AWS CDK](https://www.youtube.com/watch?v=WyrXCXdfZqs&list=PLeLcvrwLe187CchI_3zTtZCAh3TSkXx1I&index=8)

In every chapter, copy over the 3 .env files, install infrastructure, web and server folders. At infrastructure, `yarn build:frontend`

Goal:

* Ditch RDS and ECS for API Gateway and AWS Lambda
* Creating and setting up an API gateway using CDK 
* Creating and setting up some Lambda functions and how to connect them to the API gateway 
* Creating a step function state machine linked to AWS SES 
* Creating and setting up a DynamoDB table and how to automatically populate it during stack deployment


Integrating a lambda with API gateways takes a few steps.

1. Create the handler function

2. Configuring the lambda
   ```ts
   // ./infrastructure/lib/constructs/Lambda/healthcheck/index.ts
   /* ---------- External Libraries ---------- */
   import * as path from 'path';
   import { Construct } from 'constructs';
   import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
   import { Runtime } from 'aws-cdk-lib/aws-lambda';
   import { Duration, aws_logs as logs } from 'aws-cdk-lib';
   
   // creates the lambda function
   export class HealthCheckLambda extends Construct {
     public readonly func: NodejsFunction;
   
     constructor(scope: Construct, id: string, props: any) {
       super(scope, id);
   
       this.func = new NodejsFunction(scope, 'health-check-lambda', {
         runtime: Runtime.NODEJS_16_X,
         entry: path.resolve(__dirname, 'code', 'index.ts'),
         handler: 'handler',
         timeout: Duration.seconds(30),
         environment: {},
         logRetention: logs.RetentionDays.TWO_WEEKS,
       });
     }
   }
   ```

   ```ts
   // ./infrastructure/lib/constructs/Lambda/get/index.ts
   /* ---------- External Libraries ---------- */
   import * as path from 'path';
   import { Construct } from 'constructs';
   import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
   import { Runtime } from 'aws-cdk-lib/aws-lambda';
   import { Duration, aws_logs as logs } from 'aws-cdk-lib';
   import { Vpc } from 'aws-cdk-lib/aws-ec2';
   import { Table } from 'aws-cdk-lib/aws-dynamodb';
   import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
   
   interface IProps {
     vpc?: Vpc;
     dynamoTable: Table;
     stateMachine: StateMachine;
   }
   
   export class DynamoGet extends Construct {
     public readonly func: NodejsFunction;
   
     constructor(scope: Construct, id: string, props: IProps) {
       super(scope, id);
   
       const { dynamoTable, stateMachine } = props;
   
       this.func = new NodejsFunction(scope, 'dynamo-get', {
         runtime: Runtime.NODEJS_16_X,
         entry: path.resolve(__dirname, 'code', 'index.ts'),
         handler: 'handler',
         timeout: Duration.seconds(30),
         environment: {
           NODE_ENV: process.env.NODE_ENV as string,
           TABLE_NAME: dynamoTable.tableName,
           REGION: process.env.CDK_DEFAULT_REGION as string,
           STATE_MACHINE_ARN: stateMachine.stateMachineArn,
         },
         logRetention: logs.RetentionDays.TWO_WEEKS,
       });
   
       dynamoTable.grantReadData(this.func);
       stateMachine.grantStartExecution(this.func);
     }
   }
   ```

   ```ts
   // ./infrastructure/lib/constructs/Lambda/post/index.ts
   /* ---------- External Libraries ---------- */
   import * as path from 'path';
   import { Construct } from 'constructs';
   import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
   import { Runtime } from 'aws-cdk-lib/aws-lambda';
   import { Duration, aws_logs as logs } from 'aws-cdk-lib';
   import { Vpc } from 'aws-cdk-lib/aws-ec2';
   import { Table } from 'aws-cdk-lib/aws-dynamodb';
   import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
   
   interface IProps {
     vpc?: Vpc;
     dynamoTable: Table;
     stateMachine: StateMachine;
   }
   
   export class DynamoPost extends Construct {
     public readonly func: NodejsFunction;
   
     constructor(scope: Construct, id: string, props: IProps) {
       super(scope, id);
   
       const { dynamoTable, stateMachine } = props;
   
       this.func = new NodejsFunction(scope, 'dynamo-post', {
         runtime: Runtime.NODEJS_16_X,
         entry: path.resolve(__dirname, 'code', 'index.ts'),
         handler: 'handler',
         timeout: Duration.seconds(30),
         environment: {
           NODE_ENV: process.env.NODE_ENV as string,
           TABLE_NAME: dynamoTable.tableName,
           REGION: process.env.CDK_DEFAULT_REGION as string,
           STATE_MACHINE_ARN: stateMachine.stateMachineArn,
         },
         logRetention: logs.RetentionDays.TWO_WEEKS,
       });
   
       dynamoTable.grantWriteData(this.func);
       stateMachine.grantStartExecution(this.func);
     }
   }
   ```

   

3. At the API gateaway, instantiating and integrating the lambda
   ```ts
   // ./infrastructure/lib/constructs/API-GW/index.ts
   import { Construct } from 'constructs';
   import {
     EndpointType,
     LambdaIntegration,
     RestApi,
     SecurityPolicy,
   } from 'aws-cdk-lib/aws-apigateway';
   import * as targets from 'aws-cdk-lib/aws-route53-targets';
   import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
   import { Table } from 'aws-cdk-lib/aws-dynamodb';
   import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
   import { ACM } from '../ACM';
   import { Route53 } from '../Route53';
   
   import config from '../../../../config.json';
   import { HealthCheckLambda } from '../Lambda/healthcheck';
   import { DynamoPost } from '../Lambda/post';
   import { DynamoGet } from '../Lambda/get';
   
   interface Props {
     acm: ACM;
     route53: Route53;
     dynamoTable: Table;
     stateMachine: StateMachine;
   }
   
   export class ApiGateway extends Construct {
     constructor(scope: Construct, id: string, props: Props) {
       super(scope, id);
   
       const { acm, route53, dynamoTable, stateMachine } = props;
   
       const backEndSubDomain =
         process.env.NODE_ENV === 'Production'
           ? config.backend_subdomain
           : config.backend_dev_subdomain;
   
       // generates a RESTful API using a construct from API Gateway.
       // we are configuring the API to utilize the certificate and domain name we created earlier
       // and establishing a stage name in alignment with the deployed environment.
       const restApi = new RestApi(this, 'chapter-7-rest-api', {
         restApiName: `chapter-7-rest-api-${process.env.NODE_ENV || ''}`,
         description: 'serverless api using lambda functions',
         domainName: {
           certificate: acm.certificate,
           domainName: `${backEndSubDomain}.${config.domain_name}`,
           endpointType: EndpointType.REGIONAL,
           securityPolicy: SecurityPolicy.TLS_1_2,
         },
         deployOptions: {
           stageName: process.env.NODE_ENV === 'Production' ? 'prod' : 'dev',
         },
       });
   
       // Lambdas:
       // we are creating an instance of the Lambda function within the API Gateway’s index.ts file
       // and using the LambdaIntegration() method to enable our Lambda to be integrated with API Gateway.
       const healthCheckLambda = new HealthCheckLambda(
         this,
         'health-check-lambda-api-endpoint',
         {},
       );
   
       const dynamoPost = new DynamoPost(this, 'dynamo-post-lambda', {
         dynamoTable,
         stateMachine,
       });
   
       const dynamoGet = new DynamoGet(this, 'dynamo-get-lambda', {
         dynamoTable,
         stateMachine,
       });
   
       // Integrations:
       const healthCheckLambdaIntegration = new LambdaIntegration(
         healthCheckLambda.func,
       );
   
       const dynamoPostIntegration = new LambdaIntegration(dynamoPost.func);
   
       const dynamoGetIntegration = new LambdaIntegration(dynamoGet.func);
   
       // creating a health check path in the REST API.
       // The addResource() function creates the path in the API
       // Resources (Path)
       const healthcheck = restApi.root.addResource('healthcheck');
       const rootResource = restApi.root;
       // Methods
       healthcheck.addMethod('GET', healthCheckLambdaIntegration);
       healthcheck.addCorsPreflight({
         allowOrigins: ['*'],
         allowHeaders: ['*'],
         allowMethods: ['*'],
         statusCode: 204,
       });
   
       rootResource.addMethod('POST', dynamoPostIntegration);
       rootResource.addMethod('GET', dynamoGetIntegration);
       rootResource.addCorsPreflight({
         allowOrigins: ['*'],
         allowHeaders: ['*'],
         allowMethods: ['*'],
         statusCode: 204,
       });
   
       // this allows us to use a customized backend subdomain as a DNS alias for the API Gateway URL,
       //  as we did with ECS and its load balancer.
       new ARecord(this, 'BackendAliasRecord', {
         zone: route53.hosted_zone,
         target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
         recordName: `${backEndSubDomain}.${config.domain_name}`,
       });
     }
   }
   ```

   In SLS, you don't need step3, and your config in step2 would be in serverless.yml.

Next the highlight is creating and configuring the DDB instance. DDBSeeder is a third party construct. You specify the table and the data you want to insert into the seeds property. You can use a seed from a JSON file, a S3 bucket, or, as in this case, an inline array of objects.

```ts
// ./infrastructure/lib/constructs/DynamoDB/index.ts
/* ---------- External Libraries ---------- */
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoDBSeeder, Seeds } from '@cloudcomponents/cdk-dynamodb-seeder';
import { v4 as uuidv4 } from 'uuid';

export class DynamoDB extends Construct {
  readonly table: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(this, `Dynamo-Table-${process.env.NODE_ENV || ''}`, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      tableName: `todolist-${process.env.NODE_ENV?.toLowerCase() || ''}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new DynamoDBSeeder(
      this,
      `Dynamo-InlineSeeder-${process.env.NODE_ENV || ''}`,
      {
        table: this.table,
        seeds: Seeds.fromInline([
          {
            id: uuidv4(),
            todo_name: 'First todo',
            todo_description: "That's a todo for demonstration purposes",
            todo_completed: true,
          },
        ]),
      },
    );
  }
}
```

Next is configuring the step function:
```ts
// ./infrastructure/lib/constructs/Step-Function/index.ts
import { Construct } from 'constructs';
import { JsonPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Duration, Stack } from 'aws-cdk-lib';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Route53 } from '../Route53';

export class StepFunction extends Construct {
  readonly stateMachine: StateMachine;

  constructor(scope: Construct, id: string, _props: Record<string, never>) {
    super(scope, id);

    // In this part of the code, we set up the SES email identity.
    // Keep in mind that you’ll need to add an email address to the .env file you’re using.
    // This step is crucial so that SES can send an email using the designated email address.
    // Once you deploy the stack, you’ll receive a verification email from Amazon.
    const emailAddress = process.env.EMAIL_ADDRESS;

    const resourceArn = `arn:aws:ses:${Stack.of(this).region}:${
      Stack.of(this).account
    }:identity/${emailAddress}`;

    const verifyEmailIdentityPolicy = AwsCustomResourcePolicy.fromStatements([
      new PolicyStatement({
        actions: ['ses:VerifyEmailIdentity', 'ses:DeleteIdentity'],
        effect: Effect.ALLOW,
        resources: ['*'],
      }),
    ]);

    // Create a new SES Email Identity
    new AwsCustomResource(
      this,
      `Verify-Email-Identity-${process.env.NODE_ENV || ''}`,
      {
        onCreate: {
          service: 'SES',
          action: 'verifyEmailIdentity',
          parameters: {
            EmailAddress: emailAddress,
          },
          physicalResourceId: PhysicalResourceId.of(`verify-${emailAddress}`),
          region: Stack.of(this).region,
        },
        onDelete: {
          service: 'SES',
          action: 'deleteIdentity',
          parameters: {
            Identity: emailAddress,
          },
          region: Stack.of(this).region,
        },
        policy: verifyEmailIdentityPolicy,
        logRetention: 7,
      },
    );

    // This step will directly link to SES using its ARN.
    // The body must be a string in HTML format,
    // and the curly brackets indicate that we expect a dynamic value at that position,
    //  specified in the JsonPath.stringAt('$.message') function.
    // When the state machine is triggered, we pass an object
    // containing a property named message with whatever message we want,
    // in this case indicating where the step function was triggered from.
    const emailBody =
      '<h2>Chapter 7 Step Function.</h2><p>This step function was triggered by: <strong>{}</strong>.';

    const sendEmail = new CallAwsService(
      this,
      `Send-Email-${process.env.NODE_ENV || ''}`,
      {
        service: 'sesv2',
        action: 'sendEmail',
        parameters: {
          Destination: {
            ToAddresses: [emailAddress],
          },
          FromEmailAddress: emailAddress,
          Content: {
            Simple: {
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: JsonPath.format(
                    emailBody,
                    JsonPath.stringAt('$.message'),
                  ),
                },
              },
              Subject: {
                Charset: 'UTF-8',
                Data: 'Chapter 7 Step Function',
              },
            },
          },
        },
        iamResources: [resourceArn],
      },
    );

    // configure the state machine
    const stateMachine = new StateMachine(this, 'State-Machine', {
      definition: sendEmail,
      timeout: Duration.minutes(5),
    });

    stateMachine.role.attachInlinePolicy(
      new Policy(this, `SESPermissions-${process.env.NODE_ENV || ''}`, {
        statements: [
          new PolicyStatement({
            actions: ['ses:SendEmail'],
            resources: [resourceArn],
          }),
        ],
      }),
    );

    this.stateMachine = stateMachine;
  }
}

```

Instantiating all the resources 

```ts
// ./infrastructure/lib/chapter-7-stack.ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { S3 } from './constructs/S3';
import { Route53 } from './constructs/Route53';
import { ACM } from './constructs/ACM';
import { ApiGateway } from './constructs/API-GW';
import { DynamoDB } from './constructs/DynamoDB';
import { StepFunction } from './constructs/Step-Function';

export class Chapter7Stack extends Stack {
  public readonly acm: ACM;

  public readonly route53: Route53;

  public readonly s3: S3;

  public readonly vpc: Vpc;

  public readonly dynamo: DynamoDB;

  public readonly stepFunction: StepFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.route53 = new Route53(this, `Route53-${process.env.NODE_ENV || ''}`);

    this.acm = new ACM(this, `ACM-${process.env.NODE_ENV || ''}`, {
      hosted_zone: this.route53.hosted_zone,
    });

    this.s3 = new S3(this, `S3-${process.env.NODE_ENV || ''}`, {
      acm: this.acm,
      route53: this.route53,
    });

    this.dynamo = new DynamoDB(this, `Dynamo-${process.env.NODE_ENV || ''}`);

    this.stepFunction = new StepFunction(
      this,
      `Step-Function-${process.env.NODE_ENV || ''}`,
      {},
    );

    new ApiGateway(this, `Api-Gateway-${process.env.NODE_ENV || ''}`, {
      route53: this.route53,
      acm: this.acm,
      dynamoTable: this.dynamo.table,
      stateMachine: this.stepFunction.stateMachine,
    });
  }
}
```

## Ch8: Streamlined serverless development (Localstack)

Here, the author repurposing the lambda handlers to run both in the AWS environment and the local Express server. This approach aims to improve the local development experience. This is uncommon for many developers and may not scale well in larger, more complex projects.

```ts
// ./server/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { handler as PostHandler } from '../../infrastructure/lib/constructs/Lambda/post/lambda';
import { handler as GetHandler } from '../../infrastructure/lib/constructs/Lambda/get/lambda';

const { parsed } = dotenv.config();

const port = parsed?.PORT || 80;

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.post('/', async (req, res) => {
    const event = {
      body: JSON.stringify(req.body),
    };

    const { statusCode, body } = await PostHandler(event);

    return res.status(statusCode).send(body);
  });

  app.get('/', async (_req, res) => {
    const { statusCode, body } = await GetHandler();

    return res.status(statusCode).send(body);
  });

  app.get('/healthcheck', async (_req, res) => {
    return res.status(200).send(JSON.stringify('OK'));
  });

  return app;
};

const app = createApp();

const server = app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
});

server.keepAliveTimeout = 60;
server.headersTimeout = 60;

createApp();

export default createApp;
```



LocalStack allows us to mimic the functionality of AWS services, such as DynamoDB and S3, on our own machine. This way, we can test and develop our cloud and serverless apps offline. 

Need Python and pip installed for localstack. Need to installed `aws-cdk-local`

```bash
python3 -m pip install localstack
localstack start
npm install -g aws-cdk-local 
```

Within the `Chapter8Stack` class, logic has been added to conditionally deploy resources based on whether it's running locally or in the real AWS environment.

If the environment variable `NODE_ENV` is set to 'CDKLocal', it means the stack is running locally. In this case, only a DynamoDB table is instantiated. Otherwise, other resources such as Route53, ACM, S3, and ApiGateway are deployed.

```ts
// ./infrastructure/lib/chapter-8-stack.ts

constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const isCDKLocal = process.env.NODE_ENV === 'CDKLocal';

    this.dynamo = new DynamoDB(this, `Dynamo-${process.env.NODE_ENV || ''}`);

    if (isCDKLocal) return;
```

**Deployment to Local AWS Environment**:

- By running `yarn cdklocal bootstrap`, you set up the necessary environment on your local cloud.
- Subsequently, `yarn cdklocal deploy` deploys the stack to this local cloud.
- any resources set up within LocalStack are ephemeral. If you stop LocalStack, you lose those resources.

```bash
yarn cdklocal bootstrap
yarn cdklocal deploy
```

**Configuring DynamoDB to Work with LocalStack**:

- By default, LocalStack's DynamoDB service runs on port 4588. To ensure that your local server communicates with this local instance instead of the actual AWS DynamoDB service, you need to set a custom endpoint.
- In the lambda functions for both POST and GET methods, the endpoint for the DynamoDB client (`DocumentClient()`) is conditionally set based on the presence of an environment variable `DYNAMODB_ENDPOINT`. If this environment variable exists, it will use that (which in the local context points to LocalStack). Otherwise, it defaults to the real AWS DynamoDB endpoint.

```ts
// ./infrastructure/lib/constructs/Lambda/post/lambda/index.ts
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PostEvent, Todo } from 'customTypes/index';
import { httpResponse } from '../../handlers/httpResponse';

export const handler = async (event: PostEvent) => {
  try {
    const { todo_name, todo_description, todo_completed } = JSON.parse(
      event.body,
    ).todo;
    const tableName = process.env.TABLE_NAME as string;
    const awsRegion = process.env.REGION || 'us-east-1';

    // By default, LocalStack's DynamoDB service runs on port 4588.
    // To ensure that your local server communicates with this local instance instead of the actual AWS DynamoDB service,
    //  you need to set a custom endpoint.
    // In the lambda functions for both POST and GET methods,
    //  the endpoint for the DynamoDB client (`DocumentClient()`) is conditionally
    // set based on the presence of an environment variable `DYNAMODB_ENDPOINT`.
    // If this environment variable exists, it will use that (which in the local context points to LocalStack).
    // Otherwise, it defaults to the real AWS DynamoDB endpoint.
    const dynamoDB = new DynamoDB.DocumentClient({
      region: awsRegion,
      endpoint:
        process.env.DYNAMODB_ENDPOINT ||
        `https://dynamodb.${awsRegion}.amazonaws.com`,
    });

    const todo: Todo = {
      id: uuidv4(),
      todo_completed,
      todo_description,
      todo_name,
    };

    await dynamoDB.put({ TableName: tableName, Item: todo }).promise();

    return httpResponse(200, JSON.stringify({ todo }));
  } catch (error: any) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};
```

**Setting Up Environment Variables for Local Server**:

- An environment file (`.env`) should be created in the `server/` directory. This file contains key environment variables like `PORT`, `REGION`, `TABLE_NAME`, and importantly, `DYNAMODB_ENDPOINT` which is set to LocalStack's endpoint for DynamoDB (usually `http://localhost:4566`).

  ```
  PORT=3000
  REGION=us-east-1
  TABLE_NAME=todolist-cdklocal
  DYNAMODB_ENDPOINT=http://localhost:4566
  AWS_PROFILE=cdk
  ```

- Even though you don't need real AWS access keys to run LocalStack, it requires some string values for the `access key ID` and `secret access key` properties to simulate AWS calls.
- You have two options to provide these credentials:
  1. Include them in your `.env` file.
  2. Export your AWS profile, like in previous steps.
- Without one of these options, LocalStack might throw an error: `Missing credentials in config`.

**Running the Local Development Server:**

- In the `server/` directory, you run the command: `$ yarn dev`. (Uses `ts-node-dev` for serving and updating the server upon file changes)
- This starts the local development server.
- Once the server is up and running, a message is displayed indicating its operational status

**Testing the Local Server:**

- With the local server operational, you can make test requests to `localhost:3000`.
  1. Sending a request to `/healthcheck` checks if the server is functioning correctly (reference: `Figure 8.7`).
  2. Using a `POST` request to the root `/` endpoint will create a table item (reference: `Figure 8.8`).
  3. Sending a `GET` request to the root `/` endpoint will retrieve all items from the table (reference: `Figure 8.9`).

The cons of localstack:

* AWS resources may not fully be replicated 1:1, and some are not covered
* Can hide common failure modes such as **misconfigured permissions and  resource policies**.
* **Maintenance Overhead**: Keeping LocalStack updated and ensuring it remains compatible with the latest AWS service changes or new services can be an ongoing task.
* Setting up LocalStack can be intricate, especially for complex architectures. The need to modify endpoints in the codebase (e.g., pointing to a local DynamoDB endpoint instead of the real AWS one) can be burdensome.

TL, DR; more work than it is worth.

## Ch9:
