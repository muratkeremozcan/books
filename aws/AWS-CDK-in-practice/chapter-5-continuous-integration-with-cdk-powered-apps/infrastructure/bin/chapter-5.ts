#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { config } from 'dotenv';

import { Chapter5Stack } from '../lib/chapter-5-stack';
import { Chapter5PipelineStack } from '../lib/chapter-5-pipeline-stack';

config({ path: '.env.production' });

const app = new cdk.App();

// Here, we see that there are three main stacks defined:
// the almighty Chapter5PipelineStack, and the two other main stacks for the Development and Production environments.
// Each of these stacks is only spun up if the CDK_MODE environment values are either ONLY_DEV, ONLY_PROD, or ONLY_PIPELINE.

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
