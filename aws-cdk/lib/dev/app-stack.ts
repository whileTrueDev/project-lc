import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';
import * as logs from '@aws-cdk/aws-logs';
import { constants } from '../../constants';

interface LCDevAppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  apiSecGrp: ec2.SecurityGroup;
}

const PREFIX = 'LC-DEV-APP';
export class LCDevAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LCDevAppStackProps) {
    super(scope, id, props);

    const { vpc, apiSecGrp } = props;

    // ECS Cluster
    const cluster = new ecs.Cluster(this, `${PREFIX}EcsCluster`, {
      vpc,
      clusterName: constants.DEV.ECS_CLUSTER,
    });

    const apiTaskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSTaskDef`, {
      family: constants.DEV.ECS_API_FAMILY_NAME,
    });
    apiTaskDef.addContainer(`${PREFIX}ECSContainer`, {
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${constants.DEV.ECS_API_FAMILY_NAME}`),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: ecs.Secret.fromSsmParameter(
          ssm.StringParameter.fromSecureStringParameterAttributes(this, `${PREFIX}DBUrlSecret`, {
            parameterName: constants.DEV.ECS_API_DATABASE_URL_KEY,
            version: 3,
          }),
        ),
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}LogGroup`, {
          logGroupName: constants.DEV.ECS_API_LOG_GLOUP_NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    new ecs.FargateService(this, `${PREFIX}ApiService`, {
      serviceName: constants.DEV.ECS_API_SERVICE_NAME,
      cluster,
      taskDefinition: apiTaskDef,
      vpcSubnets: {
        subnetGroupName: constants.DEV.INGRESS_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroup: apiSecGrp,
      assignPublicIp: true,
    });
  }
}
