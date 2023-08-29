#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import {FinalStack} from '../lib/final-stack'

const app = new cdk.App()

const branchName = process.env.NODE_ENV || 'dev'

new FinalStack(app, `FinalStack-${branchName}`, {
  env: {region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT},
})
