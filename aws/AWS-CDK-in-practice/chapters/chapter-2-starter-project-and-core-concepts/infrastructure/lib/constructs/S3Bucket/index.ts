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
