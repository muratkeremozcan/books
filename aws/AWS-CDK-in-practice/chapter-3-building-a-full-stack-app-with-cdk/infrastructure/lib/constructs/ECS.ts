import {CfnOutput, Duration} from 'aws-cdk-lib'
import {InstanceType, Vpc} from 'aws-cdk-lib/aws-ec2'
import {Construct} from 'constructs'
import {
  Cluster,
  ContainerDefinition,
  ContainerImage,
  Protocol,
  LogDriver,
  FargateService,
  FargateTaskDefinition,
} from 'aws-cdk-lib/aws-ecs'
import {
  ApplicationListener,
  ApplicationLoadBalancer,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import {Dynamodb} from './Dynamodb'
import {resolve} from 'path'

interface Props {
  dynamodb: Dynamodb
}

export class ECS extends Construct {
  public readonly vpc: Vpc
  public readonly cluster: Cluster
  public readonly task_definition: FargateTaskDefinition
  public readonly container: ContainerDefinition
  public readonly service: FargateService
  public readonly load_balancer: ApplicationLoadBalancer
  public readonly listener: ApplicationListener

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    // Fargate will be spinning up EC2 machines that run our ECS containers
    // Therefore we need a virtually isolated private cloud; VPC
    // VPC is an environment with a network isolated from the rest of the customers of AWS
    // to safely set up virtual machines or do all kinds of networking magic.
    this.vpc = new Vpc(scope, 'Vpc', {maxAzs: 2})
    // next we setup an ECS cluster that holds a group of ECS services (one for now)
    this.cluster = new Cluster(scope, 'EcsCluster', {vpc: this.vpc})
    this.cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new InstanceType('t2.micro'),
    })

    // This section creates the ECS task definition.
    // A task definition contains information about what the ECS service needs to run.
    this.task_definition = new FargateTaskDefinition(scope, 'TaskDefinition')
    // In this example, we are pointing to the Dockerfile located at ./server/Dockerfile.
    // Define how much memory should be assigned to the task
    // and also ask AWS to kindly keep hold of the logs of the application.
    // As seen during the deployment, CDK builds the image on your behalf
    // and deals with all the necessary steps to upload the image to ECR
    // and make it available for the ECS task definition
    this.container = this.task_definition.addContainer('Express', {
      image: ContainerImage.fromAsset(
        resolve(__dirname, '..', '..', '..', 'server'),
      ),
      memoryLimitMiB: 256,
      logging: LogDriver.awsLogs({streamPrefix: 'chapter3'}),
    })

    // This part sets up all the port mapping and the load balancer for our backend.
    // It tells the load balancer that it should forward any traffic it receives on port 80
    // and hand it over to our ECS service.
    // It also indicates to the load balancer that it can check whether the service is up
    // by periodically calling the /healthcheck endpoint of our backend application.
    this.container.addPortMappings({
      containerPort: 80,
      protocol: Protocol.TCP,
    })
    this.service = new FargateService(scope, 'Service', {
      cluster: this.cluster,
      taskDefinition: this.task_definition,
    })
    this.load_balancer = new ApplicationLoadBalancer(scope, 'LB', {
      vpc: this.vpc,
      internetFacing: true,
    })
    this.listener = this.load_balancer.addListener('PublicListener', {
      port: 80,
      open: true,
    })
    this.listener.addTargets('ECS', {
      port: 80,
      targets: [
        this.service.loadBalancerTarget({
          containerName: 'Express',
          containerPort: 80,
        }),
      ],
      healthCheck: {
        interval: Duration.seconds(60),
        path: '/healthcheck',
        timeout: Duration.seconds(5),
      },
    })

    // granting all the necessary permissions so that the API can perform
    // the desired actions on DynamoDB, in this case, read and write permissions:
    props.dynamodb.main_table.grantReadWriteData(this.task_definition.taskRole)

    // so that we output the url after the deploy is finished
    new CfnOutput(scope, 'BackendURL', {
      value: this.load_balancer.loadBalancerDnsName,
    })
  }
}
