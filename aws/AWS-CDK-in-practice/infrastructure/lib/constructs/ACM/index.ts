import {DnsValidatedCertificate} from 'aws-cdk-lib/aws-certificatemanager'
import {IHostedZone} from 'aws-cdk-lib/aws-route53'
import {Construct} from 'constructs'

import config from '../../../../config.json'

interface Props {
  hosted_zone: IHostedZone
}

// DNS-validated SSL/TLS certificate using AWS Certificate Manager (ACM)
// The class creates a DNS-validated certificate for the domain.
// A DNS-validated certificate requires adding certain DNS records to the Route 53 hosted zone
// (as validation) to prove ownership of the domain.
// Since the Route53 class provides access to the hosted zone,
// it makes it easier to automate this validation step.
// This certificate can then be used to secure traffic (HTTPS) to and from the domain.
export class ACM extends Construct {
  public readonly certificate: DnsValidatedCertificate

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    this.certificate = new DnsValidatedCertificate(scope, 'Certificate', {
      domainName: config.domain_name,
      region: 'us-east-1', // <-- This needs to be 'us-east-1' for CloudFront
      // The Route 53 hosted zone that will be used to perform the DNS validation
      hostedZone: props.hosted_zone,
      // This is an array of alternative domain names that the certificate will also cover.
      // In this case, it's set to a wildcard for the domain,
      // meaning the certificate will be valid for any subdomain of the main domain
      subjectAlternativeNames: [`*.${config.domain_name}`],
    })
  }
}
