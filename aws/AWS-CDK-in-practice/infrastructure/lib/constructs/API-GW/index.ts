import {Construct} from 'constructs'
import {
  EndpointType,
  LambdaIntegration,
  RestApi,
  SecurityPolicy,
} from 'aws-cdk-lib/aws-apigateway'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import {ARecord, RecordTarget} from 'aws-cdk-lib/aws-route53'
import {Table} from 'aws-cdk-lib/aws-dynamodb'
import {DynamoDelete} from '../../../Lambda/delete'
import {DynamoPut} from '../../../Lambda/put'
import {ACM} from '../ACM'
import {Route53} from '../Route53'

import config from '../../../../config.json'
import {HealthCheckLambda} from '../../../Lambda/healthcheck'
import {DynamoPost} from '../../../Lambda/post'
import {DynamoGet} from '../../../Lambda/get'
import {getEnvironmentConfig} from '../../get-env-config'

// Integrating a lambda with API gateways takes a few steps.
// 1. Create the handler function
// 2. Configuring the lambda
// 3. At the API gateway, instantiating and integrating the lambda
// In SLS, you don't need step3, and your config in step2 would be in serverless.yml, instead of a separate file

interface Props {
  acm: ACM
  route53: Route53
  dynamoTable: Table
}

/**
 * Represents an API Gateway construct.
 * This construct integrates Lambdas with API tGateway for deployment.
 */
export class ApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const {acm, route53, dynamoTable} = props

    // support for temp branches
    const {backend_subdomain: backEndSubDomain, deployment} =
      getEnvironmentConfig(process.env.NODE_ENV || 'dev')

    const restApi = new RestApi(this, 'finalstack-rest-api', {
      restApiName: `finalstack-rest-api-${process.env.NODE_ENV || ''}`,
      description: 'serverless api using lambda functions',
      domainName: {
        certificate: acm.certificate,
        domainName: `${backEndSubDomain}.${config.domain_name}`,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      deployOptions: {
        stageName: deployment,
      },
    })

    // Lambdas:
    const healthCheckLambda = new HealthCheckLambda(
      this,
      'health-check-lambda-api-endpoint',
      {},
    )

    const dynamoPost = new DynamoPost(this, 'dynamo-post-lambda', {
      dynamoTable,
    })

    const dynamoGet = new DynamoGet(this, 'dynamo-get-lambda', {
      dynamoTable,
    })

    const dynamoDelete = new DynamoDelete(this, 'dynamo-delete-lambda', {
      dynamoTable,
    })

    const dynamoPut = new DynamoPut(this, 'dynamo-put-lambda', {
      dynamoTable,
    })

    // Integrations:
    const healthCheckLambdaIntegration = new LambdaIntegration(
      healthCheckLambda.func,
    )

    const dynamoPostIntegration = new LambdaIntegration(dynamoPost.func)

    const dynamoGetIntegration = new LambdaIntegration(dynamoGet.func)

    const dynamoDeleteIntegration = new LambdaIntegration(dynamoDelete.func)

    const dynamoPutIntegration = new LambdaIntegration(dynamoPut.func)

    // Resources (Path)
    const healthcheck = restApi.root.addResource('healthcheck')
    const rootResource = restApi.root
    const itemResource = rootResource.addResource('{id}')

    // Methods
    healthcheck.addMethod('GET', healthCheckLambdaIntegration)
    healthcheck.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    })

    rootResource.addMethod('POST', dynamoPostIntegration)
    rootResource.addMethod('GET', dynamoGetIntegration)
    rootResource.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    })

    itemResource.addMethod('DELETE', dynamoDeleteIntegration)
    itemResource.addMethod('PUT', dynamoPutIntegration)
    itemResource.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
    })

    // ARecord:
    new ARecord(this, 'BackendAliasRecord', {
      zone: route53.hosted_zone,
      target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
      recordName: `${backEndSubDomain}.${config.domain_name}`,
    })
  }
}
