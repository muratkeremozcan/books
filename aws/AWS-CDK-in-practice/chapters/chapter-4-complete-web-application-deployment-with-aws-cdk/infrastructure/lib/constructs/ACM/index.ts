import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import {IHostedZone} from 'aws-cdk-lib/aws-route53'
import {Construct} from 'constructs'

import {domain_name} from '../../../../config.json'

interface Props {
  hosted_zone: IHostedZone
}

export class ACM extends Construct {
  public readonly certificate: Certificate

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    // I owe you an apology. At the beginning of this chapter, we made you buy a domain
    // and then validate the domain to be able to issue the ACM TLS certificate.
    // The domain buying bit you had to do, but the ACM certificate verification part you didn’t.
    //  Curse me as you wish, but we wanted to show you how much time and effort you could save
    // if you switched to AWS CDK. Let me show you what we mean.
    // This whole drama is automatically achieved by the following single block of code,
    this.certificate = new Certificate(scope, 'Certificate', {
      domainName: domain_name,
      validation: CertificateValidation.fromDns(props.hosted_zone),
      subjectAlternativeNames: [`*.${domain_name}`],
    })
  }
}
