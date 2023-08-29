import {HostedZone, IHostedZone} from 'aws-cdk-lib/aws-route53'
import {Construct} from 'constructs'

import config from '../../../../config.json'

// note: previously at AWS console we Set up DNS for both frontend and backend URLs using Route 53

// looks up an existing hosted zone based on the domain name provided in the configuration.
// Once the hosted zone is retrieved, it can be used in other constructs
// used when setting up an SSL/TLS certificate or configuring DNS records.
export class Route53 extends Construct {
  public readonly hosted_zone: IHostedZone

  constructor(scope: Construct, id: string) {
    super(scope, id)

    // fromLookup queries and retrieves an existing Route 53 hosted zone
    // in your AWS environment by its domain name
    this.hosted_zone = HostedZone.fromLookup(scope, 'HostedZone', {
      domainName: config.domain_name,
    })
  }
}
