# [AWS CDK in Practice](https://www.amazon.com/AWS-CDK-Practice-Streamline-applications/dp/180181239X/ref=sr_1_3?crid=EOP9UXZSSGRK&keywords=cdk+aws&qid=1692715247&sprefix=cdk+aws%2Caps%2C100&sr=8-3).

The original example is from the book AWS CDK in Practice. I trimmed the parts I
do not like, and added things I think are necessary. You can find the original
code in the chapters folder.

The repo showcases several AWS services working in tandem:

- The frontend gets deployed to an S3 bucket.
- Domain management is handled with Route 53, paired with ACM for SSL
  certificates.
- Data persistence is achieved with DynamoDB.
- The backend logic involves several Lambda functions.
- Step Functions orchestrate workflows.

The CDK code initializes various constructs like Route 53, ACM, and S3. The S3
construct, for instance, takes in ACM and Route 53 as dependencies to facilitate
web hosting with a custom domain and SSL. Similarly, the API Gateway construct
ties together Route 53, ACM, and DynamoDB.

The book considered only prod and dev environments. Instead, in the temp stack
approach, any hardcoded values in the CDK constructs are replaced with dynamic
values fetched from the environment configuration. The core of this setup lies
in a couple of utility functions that enable temporary stacks: one that fetches
the current branch name (either locally via Git or through GitHub Actions when
running in a CI environment) and another that retrieves environment-specific
configuration. Serverless Framework thinks of these and a lot of it is easier to
setup and use. With cdk, it needs some work but it’s not impossible.

## One time setup scripts:

These scripts are generally run once to set up or scaffold the necessary
environment:

```bash
cdk init app --language typescript # scaffold cdk
aws configure --profile cdk # configure the cdk profile
cdk bootstrap --profile cdk # configure cdk for that region

cd infrastructure
yarn build
yarn build:frontend # installs and builds the front-end so it can be deployed
```

## Deployment

### Temporary Branch Deployment

If you're working on a feature branch or any other temporary branch and you want
to deploy resources specific to that branch:

```bash
cd infrastructure
yarn cdk:branch deploy
yarn cdk:branch destroy
yarn cdk:synth-branch
```

### Dev Environment

```bash
cd infrastructure
yarn cdk:dev deploy
yarn cdk:dev destroy
yarn cdk:synth
```

### Stage Environment

```bash
cd infrastructure
yarn cdk:stage deploy
yarn cdk:stage destroy
yarn cdk:synth-stage
```

### Production Environment

```bash
cd infrastructure
yarn cdk:prod deploy
yarn cdk:prod destroy
yarn cdk:synth-prod
```

## Other scripts:

```bash
aws sts get-caller-identity --query Account --output text # retrieve your AWS account ID

cd infrastructure
yarn test # cdk tests with Jest
yarn cdk:reset # deletes cdk generated files, useful if synth fails
```

## Core enablers for temporary stacks

### `getEnvironmentConfig`

`getEnvironmentConfig` function at `./infrastructure/lib/get-env-config.ts` is
used in the API gateway and S3 constructs to identify the backend and frontend
sub domains. It retrieves the environment configuration based on the provided
environment name (which could be a predefined one like 'dev', 'stage', 'prod' or
a dynamic branch name for other cases). The acquisition of the branch name
addresses both CI (GITHUB.REF in Github Actions) and local concerns (using git
rev-parse). The returned configuration includes the backend and frontend
subdomains specific to that environment or branch.

```ts
// For a predefined environment:
getEnvironmentConfig('dev')
// Returns:
// {
//   backend_subdomain: "dev-backend-cdk-book",
//   frontend_subdomain: "dev-frontend-cdk-book",
//   deployment: "dev"
// }

// For a custom branch named 'feature-x':
getEnvironmentConfig('feature-x')

// {
//   backend_subdomain: "feature-x-backend-cdk-book",
//   frontend_subdomain: "feature-x-frontend-cdk-book",
//   deployment: "feature-x"
// }
```

### `NODE_ENV`

The `NODE_ENV` environment variable is utilized in every lambda and the
construct as a naming convention to distinguish in the fixed deployments (dev,
stage, prod) and the temporary stacks (named after the branch).

### `package.json` scripts

`NODE_ENV` is in turn used in the scripts to control what environment we are
working with.

```json
"cdk:dev": "cross-env NODE_ENV=dev DOTENV_CONFIG_PATH=./.env.development cdk --profile cdk",
"cdk:prod": "cross-env NODE_ENV=prod DOTENV_CONFIG_PATH=./.env.production cdk --profile cdk",
"cdk:stage": "cross-env NODE_ENV=stage DOTENV_CONFIG_PATH=./.env.stage cdk --profile cdk",
"cdk:synth": "yarn cdk:dev synth",
"cdk:deploy": "yarn cdk:dev deploy",
"cdk:destroy": "yarn cdk:dev destroy",
"cdk:synth-stage": "yarn cdk:stage synth",
"cdk:deploy-stage": "yarn cdk:stage deploy",
"cdk:destroy-stage": "yarn cdk:stage destroy",
"cdk:synth-prod": "yarn cdk:prod synth",
"cdk:deploy-prod": "yarn cdk:prod deploy",
"cdk:destroy-prod": "yarn cdk:prod destroy",
"get:branch": "git rev-parse --abbrev-ref HEAD",
"cdk:branch": "BRANCH=$(npm run get:branch | awk 'END{print}') && cross-env NODE_ENV=$BRANCH DOTENV_CONFIG_PATH=./.env.development cdk --profile cdk",
"cdk:synth-branch": "yarn cdk:branch synth",
"cdk:deploy-branch": "yarn cdk:branch deploy",
"cdk:destroy-branch": "yarn cdk:branch destroy",
```

> In comparison to serverless framework, we mostly had to worry about the
> `package.json` scripts
> ([example](https://github.com/muratkeremozcan/prod-ready-serverless/blob/main/package.json#L9))
> because stage parameter is built-in to the framework, abstracting away the
> need to get the environment config and utilize additional environment
> variables.
>
> ```json
> "get:branch": "git rev-parse --abbrev-ref HEAD",
> "sls": "sls",
> "deploy": "sls deploy",
> "deploy:branch": "BRANCH=$(npm run get:branch | awk 'END{print}') && sls deploy -s $BRANCH --param='ssmStage=dev'",
> "deploy:stage": "sls deploy -s stage --param='ssmStage=dev'",
> "export:env": "sls export-env --all",
> "export:env-branch": "BRANCH=$(npm run get:branch | awk 'END{print}') && npm run sls export-env -- -s $BRANCH --all --param='ssmStage=dev'",
> "export:env-stage": "sls export-env -s stage --all --param='ssmStage=dev'",
> "remove:branch": "BRANCH=$(npm run get:branch | awk 'END{print}') && npm run sls -- remove -s $BRANCH --param='ssmStage=dev'",
> ```

## CI with OpenID Connect (OIDC)

OIDC has been configured as shown
[here](https://github.com/muratkeremozcan/prod-ready-serverless/blob/main/notes.md#cicd-with-github-actions-using-an-iam-role-provided-through-an-oidc-openid-connect-provider).
The primary benefits are:

- No need to store long-term credentials and plan for their rotation
- Use your cloud provider’s native IAM tools to configure least-privilege access
  for your build jobs
- Even easier to automate with Infrastructure as Code (IaC)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8rogadu1fwfzjmqiojpj.png)
