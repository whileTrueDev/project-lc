import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';
import * as logs from '@aws-cdk/aws-logs';
import { constants } from '../../constants';

interface LCDevAppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  apiSecGrp: ec2.SecurityGroup;
  socketSecGrp: ec2.SecurityGroup;
}

const PREFIX = 'LC-DEV-APP';
export class LCDevAppStack extends cdk.Stack {
  DBURL_PARAMETER: ssm.IStringParameter;

  constructor(scope: cdk.Construct, id: string, props: LCDevAppStackProps) {
    super(scope, id, props);

    const { vpc, apiSecGrp, socketSecGrp } = props;

    // * ECS Cluster
    const cluster = new ecs.Cluster(this, `${PREFIX}EcsCluster`, {
      vpc,
      clusterName: constants.DEV.ECS_CLUSTER,
      containerInsights: true,
    });

    // * DBURL 파라미터
    this.DBURL_PARAMETER = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}DBUrlSecret`,
      {
        parameterName: constants.DEV.ECS_DATABASE_URL_KEY,
        version: 3,
      },
    );

    // * API server
    this.createApiAppService(cluster, apiSecGrp);
    // * socket server
    this.createSocketAppService(cluster, socketSecGrp);
  }

  private createApiAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const apiTaskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSTaskDef`, {
      family: constants.DEV.ECS_API_FAMILY_NAME,
    });
    apiTaskDef.addContainer(`${PREFIX}ECSContainer`, {
      containerName: 'project-lc-api-dev',
      portMappings: [{ containerPort: constants.DEV.ECS_API_PORT }],
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${constants.DEV.ECS_API_FAMILY_NAME}`),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: ecs.Secret.fromSsmParameter(this.DBURL_PARAMETER),
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
      securityGroup: secgrp,
      assignPublicIp: true,
    });
  }

  private createSocketAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const taskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSSocketTaskDef`, {
      family: constants.DEV.ECS_SOCKET_FAMILY_NAME,
    });
    taskDef.addContainer(`${PREFIX}ECSSocketContainer`, {
      containerName: 'project-lc-socket-dev',
      portMappings: [{ containerPort: constants.DEV.ECS_SOCKET_PORT }],
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${constants.DEV.ECS_SOCKET_FAMILY_NAME}`),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: ecs.Secret.fromSsmParameter(this.DBURL_PARAMETER),
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}SocketLogGroup`, {
          logGroupName: constants.DEV.ECS_SOCKET_LOG_GLOUP_NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    new ecs.FargateService(this, `${PREFIX}SocketService`, {
      serviceName: constants.DEV.ECS_SOCKET_SERVICE_NAME,
      cluster,
      taskDefinition: taskDef,
      vpcSubnets: {
        subnetGroupName: constants.DEV.INGRESS_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroup: secgrp,
      assignPublicIp: true,
    });
  }
}
