# How-to

## How to deploy this demo project

1. Make sure you have Node.js 14.x (or later) installed
2. Run `npm ci` at the root of this project folder
3. Deploy this project by running `npx sls deploy`

## How to run the end-to-end tests

1. Make sure you have deployed the project (see above)
1. Run `npm run test:e2e`

## How to run tests with StepFunctionsLocal

1. Run `npm run downloadSfnLocal` at the root of the project folder. This downloads the StepFunctionsLocal jar from `https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-jar.html`, into the `.step-functions-local` folder
2. Run `npm run startSfnLocal` to start Step Functions Local
3. Run tests with `npm run test:local`
