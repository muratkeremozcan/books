import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from 'aws-cdk-lib/aws-s3'
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment'
import {Construct} from 'constructs'
import {resolve} from 'path'
import {CfnOutput, RemovalPolicy} from 'aws-cdk-lib'
import {Distribution, ViewerProtocolPolicy} from 'aws-cdk-lib/aws-cloudfront'
import {S3Origin} from 'aws-cdk-lib/aws-cloudfront-origins'
import {ARecord, RecordTarget} from 'aws-cdk-lib/aws-route53'
import {CloudFrontTarget} from 'aws-cdk-lib/aws-route53-targets'
import crypto from 'crypto'
import {Route53} from '../Route53'
import {ACM} from '../ACM'
import {getEnvironmentConfig} from '../../get-env-config'
import config from '../../../../config.json'

const hashFn = (input: string) =>
  crypto.createHash('sha256').update(input).digest('hex').slice(0, 8)

interface Props {
  acm: ACM
  route53: Route53
}

// Sets up an S3 bucket to host a static website
// It also creates a CloudFront distribution for this S3 bucket
// and ensures that the site can be accessed using HTTPS by associating it with the ACM certificate.
// Furthermore, a DNS A record is added to the Route 53 hosted zone,
// pointing the domain (or subdomain) to the CloudFront distribution.

export class S3 extends Construct {
  // the bucket property is defined outside the constructor
  // because it is meant to be part of every instance of the class,
  // holding a value that persists for the lifetime of the object.
  // Its purpose is to hold state that other methods in the class
  public readonly web_bucket: Bucket

  public readonly web_bucket_deployment: BucketDeployment

  public readonly distribution: Distribution

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const unique_id = 'akemxdjqkl666'
    const deployment = process.env.NODE_ENV || 'dev' // dev is our default
    const predefinedDeployments = Object.keys(config.environments)

    const bucketSuffix = predefinedDeployments.includes(deployment)
      ? deployment
      : `${deployment}-${hashFn(deployment)}`

    this.web_bucket = new Bucket(scope, `web-bucket-${bucketSuffix}`, {
      bucketName: `web-bucket-${unique_id}-${bucketSuffix}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // we specify where to get the build folder from
    this.web_bucket_deployment = new BucketDeployment(
      scope,
      'WebSiteBucketDeployment',
      {
        sources: [
          Source.asset(
            resolve(__dirname, '..', '..', '..', '..', 'web', 'build'),
          ),
        ],
        destinationBucket: this.web_bucket,
      },
    )

    const {frontend_subdomain: frontEndSubDomain} =
      getEnvironmentConfig(deployment)

    // CloudFront Distribution:
    // A CloudFront distribution (distribution property) is created
    // to serve the content from the S3 bucket with better performance and reduced latency.
    // The CloudFront distribution is set to use HTTPS (with a provided ACM certificate),
    // and any HTTP request will be redirected to HTTPS.
    // It uses the domain/subdomain specified in the config.json file
    // and differentiates between production and development environments based on the NODE_ENV environment variable.
    this.distribution = new Distribution(
      scope,
      `Frontend-Distribution-${process.env.NODE_ENV || ''}`,
      {
        certificate: props.acm.certificate,
        domainNames: [`${frontEndSubDomain}.${config.domain_name}`],
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new S3Origin(this.web_bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    )

    // Route53 DNS Record:
    // An alias record (ARecord) is created in AWS Route53.
    // This will point the subdomain (like www.yourdomain.com) to the CloudFront distribution.
    // This ensures that when someone visits your subdomain, they are served content from CloudFront,
    // which in turn fetches it from the S3 bucket.
    new ARecord(scope, `FrontendAliasRecord-${process.env.NODE_ENV || ''}`, {
      zone: props.route53.hosted_zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
      recordName: `${frontEndSubDomain}.${config.domain_name}`,
    })

    // so that we output the url after the deploy is finished
    new CfnOutput(scope, 'FrontendUrl', {
      value: this.web_bucket.bucketWebsiteUrl,
    })
  }
}
