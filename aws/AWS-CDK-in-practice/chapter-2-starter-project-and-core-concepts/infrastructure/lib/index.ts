import {Stack} from 'aws-cdk-lib'
import type {StackProps} from 'aws-cdk-lib'
import type {Construct} from 'constructs'
import {S3Bucket} from './constructs/S3Bucket'

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // the constructs that defines your stack goes here

    // does not mattwhether there is an assignment to a variable or not
    // the instantiation causes the construct to be created
    new S3Bucket(this, 'MyRemovableBucket', {
      environment: 'development',
    })
  }
}
