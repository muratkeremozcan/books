import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as rds from 'aws-cdk-lib/aws-rds'
import {CfnOutput, Duration, Token} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {RetentionDays} from 'aws-cdk-lib/aws-logs'
import {DockerImageCode} from 'aws-cdk-lib/aws-lambda'

import {CDKResourceInitializer} from './custom'

interface Props {
  vpc: ec2.Vpc
}

export class RDS extends Construct {
  public readonly instance: rds.DatabaseInstance

  public readonly credentials: rds.DatabaseSecret

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const instance_id = 'my-sql-instance'
    const credentials_secret_name = `chapter-4/rds/${instance_id}`

    // How do we go about generating a password for MySQL, while not having it in the Git history?
    // And how do we then share these secrets with relevant components securely?
    // The DatabaseSecret construct of the aws-rds library receives a secret name and a username as parameters
    //  and creates an, erm, secret in the AWS SecretsManager service.
    // in the next section, we assign this set of credentials to the RDS MySQL instance:
    this.credentials = new rds.DatabaseSecret(scope, 'MySQLCredentials', {
      secretName: credentials_secret_name,
      username: 'admin',
    })

    // SPINNING UP THE RDS INSTANCE
    // We are creating a MySQL RDS database instance with the MySQL engine version 8.0.28.
    // The name of the database will be todolist.
    // The database will be hosted by an EC2 machine of the T2 type with a Small instance size.
    // We are defining ports and their accessibility within the VPC.
    // We are using a VPC that is passed down higher on the stack and asking RDS to spin up the EC2 instance within a private subnet.
    this.instance = new rds.DatabaseInstance(scope, 'MySQL-RDS-Instance', {
      credentials: rds.Credentials.fromSecret(this.credentials),
      databaseName: 'todolist',
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_28,
      }),
      instanceIdentifier: instance_id,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.SMALL,
      ),
      port: 3306,
      publiclyAccessible: false,
      vpc: props.vpc,
      vpcSubnets: {
        onePerAz: true,
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    })

    // instantiating the CDKResourceInitilizer construct:
    // We create a CDKResourceInitilizer custom construct, which, in turn, spins up a Lambda function.
    // We define the log retention and length of the Lambda function’s execution timeout.
    // Since we only have one data point to inject, we don’t need anything longer than two minutes.
    // The Lambda function is backed by a custom Dockerfile we are passing to the custom construct.
    // We also pass the same VPC and subnet network details for our Lambda function to run.
    const initializer = new CDKResourceInitializer(scope, 'MyRdsInit', {
      // Here, we are passing down the secret name to CDKResourceInitilizer
      // so that we know where to get the secret from
      config: {
        credentials_secret_name,
      },
      function_log_retention: RetentionDays.FIVE_MONTHS,
      function_code: DockerImageCode.fromImageAsset(`${__dirname}/init`, {}),
      function_timeout: Duration.minutes(2),
      function_security_groups: [],
      vpc: props.vpc,
      subnets_selection: props.vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      }),
    })

    // we define the RDS instance as a dependency for this CustomResource.
    // This means RDS needs to be up and running before CustomResource is spun up:
    initializer.custom_resource.node.addDependency(this.instance)

    // We have to explicitly give these permissions to the initializer function:
    this.credentials.grantRead(initializer.function)

    this.instance.connections.allowFrom(
      initializer.function,
      ec2.Port.tcp(3306),
    )

    /* ----------
     * Returns the initializer function response,
     * to check if the SQL was successful or not
     * ---------- */
    new CfnOutput(scope, 'RdsInitFnResponse', {
      value: Token.asString(initializer.response),
    })
  }
}
