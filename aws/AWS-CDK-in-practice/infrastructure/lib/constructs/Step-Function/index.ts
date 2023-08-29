import {Construct} from 'constructs'
import {JsonPath, StateMachine} from 'aws-cdk-lib/aws-stepfunctions'
import {CallAwsService} from 'aws-cdk-lib/aws-stepfunctions-tasks'
import {Duration, Stack} from 'aws-cdk-lib'
import {Effect, Policy, PolicyStatement} from 'aws-cdk-lib/aws-iam'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'

export class StepFunction extends Construct {
  readonly stateMachine: StateMachine

  constructor(scope: Construct, id: string, _props: Record<string, never>) {
    super(scope, id)

    // In this part of the code, we set up the SES email identity.
    // Keep in mind that you’ll need to add an email address to the .env file you’re using.
    // This step is crucial so that SES can send an email using the designated email address.
    // Once you deploy the stack, you’ll receive a verification email from Amazon.
    const emailAddress = process.env.EMAIL_ADDRESS

    const resourceArn = `arn:aws:ses:${Stack.of(this).region}:${
      Stack.of(this).account
    }:identity/${emailAddress}`

    const verifyEmailIdentityPolicy = AwsCustomResourcePolicy.fromStatements([
      new PolicyStatement({
        actions: ['ses:VerifyEmailIdentity', 'ses:DeleteIdentity'],
        effect: Effect.ALLOW,
        resources: ['*'],
      }),
    ])

    // Create a new SES Email Identity
    new AwsCustomResource(
      this,
      `Verify-Email-Identity-${process.env.NODE_ENV || ''}`,
      {
        onCreate: {
          service: 'SES',
          action: 'verifyEmailIdentity',
          parameters: {
            EmailAddress: emailAddress,
          },
          physicalResourceId: PhysicalResourceId.of(`verify-${emailAddress}`),
          region: Stack.of(this).region,
        },
        onDelete: {
          service: 'SES',
          action: 'deleteIdentity',
          parameters: {
            Identity: emailAddress,
          },
          region: Stack.of(this).region,
        },
        policy: verifyEmailIdentityPolicy,
        logRetention: 7,
      },
    )

    // This step will directly link to SES using its ARN.
    // The body must be a string in HTML format,
    // and the curly brackets indicate that we expect a dynamic value at that position,
    //  specified in the JsonPath.stringAt('$.message') function.
    // When the state machine is triggered, we pass an object
    // containing a property named message with whatever message we want,
    // in this case indicating where the step function was triggered from.
    const emailBody =
      '<h2>Chapter 7 Step Function.</h2><p>This step function was triggered by: <strong>{}</strong>.'

    const sendEmail = new CallAwsService(
      this,
      `Send-Email-${process.env.NODE_ENV || ''}`,
      {
        service: 'sesv2',
        action: 'sendEmail',
        parameters: {
          Destination: {
            ToAddresses: [emailAddress],
          },
          FromEmailAddress: emailAddress,
          Content: {
            Simple: {
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: JsonPath.format(
                    emailBody,
                    JsonPath.stringAt('$.message'),
                  ),
                },
              },
              Subject: {
                Charset: 'UTF-8',
                Data: 'Chapter 7 Step Function',
              },
            },
          },
        },
        iamResources: [resourceArn],
      },
    )

    // configure the state machine
    const stateMachine = new StateMachine(this, 'State-Machine', {
      definition: sendEmail,
      timeout: Duration.minutes(5),
    })

    stateMachine.role.attachInlinePolicy(
      new Policy(this, `SESPermissions-${process.env.NODE_ENV || ''}`, {
        statements: [
          new PolicyStatement({
            actions: ['ses:SendEmail'],
            resources: [resourceArn],
          }),
        ],
      }),
    )

    this.stateMachine = stateMachine
  }
}
