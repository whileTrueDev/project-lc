import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as logs from '@aws-cdk/aws-logs';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { constants } from '../../constants';

interface LCDevAppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  apiSecGrp: ec2.SecurityGroup;
  overlaySecGrp: ec2.SecurityGroup;
  albSecGrp: ec2.SecurityGroup;
}

const PREFIX = 'LC-DEV-APP';
const DOMAIN = 'andad.io';
// const API_DOMAIN = `${DOMAIN}`;
// const OVERLAY_DOMAIN = `${DOMAIN}`;

export class LCDevAppStack extends cdk.Stack {
  DBURL_PARAMETER: ssm.IStringParameter;
  FIRSTMALL_DATABASE_URL: ssm.IStringParameter;

  constructor(scope: cdk.Construct, id: string, props: LCDevAppStackProps) {
    super(scope, id, props);

    const { vpc, apiSecGrp, overlaySecGrp, albSecGrp } = props;

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
        version: 4,
      },
    );

    this.FIRSTMALL_DATABASE_URL = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}FirstmallDBUrlSecret`,
      {
        parameterName: constants.DEV.FIRSTMALL_DATABASE_URL_KEY,
        version: 1,
      },
    );

    // * API server
    const apiService = this.createApiAppService(cluster, apiSecGrp);
    // * overlay server
    const overlayService = this.createOverlayAppService(cluster, overlaySecGrp);

    this.createALB(vpc, apiService, overlayService, albSecGrp);
    // this.createRoute53ARecord(alb);
  }

  /** API 서버 ECS Fargate Service 생성 메서드 */
  private createApiAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const apiTaskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSTaskDef`, {
      family: constants.DEV.ECS_API_FAMILY_NAME,
    });
    apiTaskDef.addContainer(`${PREFIX}ECSContainer`, {
      containerName: 'project-lc-api-dev',
      portMappings: [{ containerPort: constants.DEV.ECS_API_PORT }],
      image: ecs.ContainerImage.fromRegistry(
        `hwasurr/${constants.DEV.ECS_API_FAMILY_NAME}`,
      ),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: ecs.Secret.fromSsmParameter(this.DBURL_PARAMETER),
        FIRSTMALL_DATABASE_URL: ecs.Secret.fromSsmParameter(this.FIRSTMALL_DATABASE_URL),
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}LogGroup`, {
          logGroupName: constants.DEV.ECS_API_LOG_GLOUP_NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    return new ecs.FargateService(this, `${PREFIX}ApiService`, {
      serviceName: constants.DEV.ECS_API_SERVICE_NAME,
      cluster,
      taskDefinition: apiTaskDef,
      vpcSubnets: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroup: secgrp,
      assignPublicIp: false,
    });
  }

  /** 라-커 화면 Overlay 서버 ECS Fargate Service 생성 메서드 */
  private createOverlayAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const taskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSOverlayTaskDef`, {
      family: constants.DEV.ECS_OVERLAY_FAMILY_NAME,
    });
    taskDef.addContainer(`${PREFIX}ECSOverlayContainer`, {
      containerName: 'project-lc-overlay-dev',
      portMappings: [{ containerPort: constants.DEV.ECS_OVERLAY_PORT }],
      image: ecs.ContainerImage.fromRegistry(
        `hwasurr/${constants.DEV.ECS_OVERLAY_FAMILY_NAME}`,
      ),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: ecs.Secret.fromSsmParameter(this.DBURL_PARAMETER),
        FIRSTMALL_DATABASE_URL: ecs.Secret.fromSsmParameter(this.FIRSTMALL_DATABASE_URL),
        GOOGLE_CREDENTIALS_EMAIL: ecs.Secret.fromSsmParameter(
          ssm.StringParameter.fromSecureStringParameterAttributes(
            this,
            `${PREFIX}GoogleTTSEmailSecret`,
            {
              parameterName: constants.DEV.GOOGLE_CREDENTIALS_EMAIL_KEY,
              version: 1,
            },
          ),
        ),
        GOOGLE_CREDENTIALS_PRIVATE_KEY: ecs.Secret.fromSsmParameter(
          ssm.StringParameter.fromSecureStringParameterAttributes(
            this,
            `${PREFIX}GoogleTTSKeySecret`,
            {
              parameterName: constants.DEV.GOOGLE_CREDENTIALS_PRIVATE_KEY_KEY,
              version: 1,
            },
          ),
        ),
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}OverlayLogGroup`, {
          logGroupName: constants.DEV.ECS_OVERLAY_LOG_GLOUP_NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    return new ecs.FargateService(this, `${PREFIX}OverlayService`, {
      serviceName: constants.DEV.ECS_OVERLAY_SERVICE_NAME,
      cluster,
      taskDefinition: taskDef,
      vpcSubnets: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroup: secgrp,
      assignPublicIp: false,
    });
  }

  private createALB(
    vpc: ec2.Vpc,
    apiService: ecs.FargateService,
    overlayAppService: ecs.FargateService,
    sg: ec2.SecurityGroup,
  ) {
    // * ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, `${PREFIX}ALB`, {
      vpc,
      internetFacing: true,
      loadBalancerName: `${PREFIX}ALB`,
      vpcSubnets: {
        subnetGroupName: constants.DEV.INGRESS_SUBNET_GROUP_NAME,
      },
      securityGroup: sg,
    });

    // If you do not provide any options for this method, it redirects HTTP port 80 to HTTPS port 443
    // alb.addRedirect();

    // ALB 타겟 그룹으로 생성
    const apiTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      `${PREFIX}ApiTargetGroup`,
      {
        vpc,
        targetGroupName: `APITargetGroup`,
        port: constants.DEV.ECS_API_PORT,
        protocol: elbv2.ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: '/',
          interval: cdk.Duration.minutes(1),
        },
        targets: [apiService],
      },
    );

    // ALB에 HTTP 리스너 추가
    const truepointHttpListener = alb.addListener(`${PREFIX}ALBHttpListener`, {
      port: 80,
      defaultTargetGroups: [apiTargetGroup],
    });
    truepointHttpListener.connections.allowDefaultPortFromAnyIpv4(
      'https ALB open to world',
    );

    const overlayTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      `${PREFIX}OverlayTargetGroup`,
      {
        vpc,
        targetGroupName: 'OverlayTargetGroup',
        port: constants.DEV.ECS_OVERLAY_PORT,
        protocol: elbv2.ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: '/',
          interval: cdk.Duration.minutes(1),
        },
        targets: [overlayAppService],
      },
    );

    // HTTP 리스너에 Overlay 서버 타겟그룹 추가
    truepointHttpListener.addTargetGroups(`${PREFIX}HTTPSApiTargetGroup`, {
      priority: 1,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/livecommerce'])],
      targetGroups: [overlayTargetGroup],
    });

    return alb;
  }

  private createRoute53ARecord(alb: elbv2.ApplicationLoadBalancer) {
    // Find Route53 Hosted zone
    const truepointHostzone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      `find${DOMAIN}Zone`,
      {
        zoneName: DOMAIN,
        hostedZoneId: 'Z03356691DEYSJEBYTKT3',
      },
    );

    // Route53 로드밸런서 타겟 생성
    new route53.ARecord(this, 'LoadbalancerARecord', {
      zone: truepointHostzone,
      recordName: ``,
      target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(alb)),
    });
  }
}
