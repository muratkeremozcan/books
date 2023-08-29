import {Stack, StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {S3} from './constructs/S3'
import {Route53} from './constructs/Route53'
import {ACM} from './constructs/ACM'
import {ApiGateway} from './constructs/API-GW'
import {DynamoDB} from './constructs/DynamoDB'
import {StepFunction} from './constructs/Step-Function'

export class FinalStack extends Stack {
  public readonly acm: ACM

  public readonly route53: Route53

  public readonly s3: S3

  public readonly dynamo: DynamoDB

  public readonly stepFunction: StepFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.dynamo = new DynamoDB(this, `Dynamo-${process.env.NODE_ENV || ''}`)

    // the constructs that defines your stack goes here
    this.route53 = new Route53(this, 'Route53')
    // as well as initializing the ACM level 3 construct
    // and passing the hosted zone as a parameter
    this.acm = new ACM(this, 'ACM', {
      hosted_zone: this.route53.hosted_zone,
    })

    // does not matter whether there is an assignment to a variable or not
    // the instantiation causes the construct to be created
    this.s3 = new S3(this, 'S3', {
      acm: this.acm,
      route53: this.route53,
    })

    new ApiGateway(this, `Api-Gateway-${process.env.NODE_ENV || ''}`, {
      route53: this.route53,
      acm: this.acm,
      dynamoTable: this.dynamo.table,
    })
  }
}
