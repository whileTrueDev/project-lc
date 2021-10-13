/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
  private DBURL_PARAMETER: ssm.IStringParameter;
  private FIRSTMALL_DATABASE_URL: ssm.IStringParameter;
  private GOOGLE_CLIENT_ID: ssm.IStringParameter;
  private GOOGLE_CLIENT_SECRET: ssm.IStringParameter;
  private NAVER_CLIENT_ID: ssm.IStringParameter;
  private NAVER_CLIENT_SECRET: ssm.IStringParameter;
  private KAKAO_CLIENT_ID: ssm.IStringParameter;
  private MAILER_USER: ssm.IStringParameter;
  private MAILER_PASS: ssm.IStringParameter;
  private GOOGLE_CREDENTIALS_EMAIL: ssm.IStringParameter;
  private GOOGLE_CREDENTIALS_PRIVATE_KEY: ssm.IStringParameter;
  private JWT_SECRET: ssm.IStringParameter;
  private CIPHER_HASH: ssm.IStringParameter;
  private CIPHER_PASSWORD: ssm.IStringParameter;
  private CIPHER_SALT: ssm.IStringParameter;
  private S3_ACCESS_KEY_ID: ssm.IStringParameter;
  private S3_ACCESS_KEY_SECRET: ssm.IStringParameter;

  constructor(scope: cdk.Construct, id: string, props: LCDevAppStackProps) {
    super(scope, id, props);

    const { vpc, apiSecGrp, overlaySecGrp, albSecGrp } = props;

    // * ECS Cluster
    const cluster = new ecs.Cluster(this, `${PREFIX}EcsCluster`, {
      vpc,
      clusterName: constants.DEV.ECS_CLUSTER,
      containerInsights: true,
    });

    // * 환경변수 주입을 위한 파라미터 로딩
    this.loadSsmParameters();

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
        GOOGLE_CLIENT_ID: ecs.Secret.fromSsmParameter(this.GOOGLE_CLIENT_ID),
        GOOGLE_CLIENT_SECRET: ecs.Secret.fromSsmParameter(this.GOOGLE_CLIENT_SECRET),
        NAVER_CLIENT_ID: ecs.Secret.fromSsmParameter(this.NAVER_CLIENT_ID),
        NAVER_CLIENT_SECRET: ecs.Secret.fromSsmParameter(this.NAVER_CLIENT_SECRET),
        KAKAO_CLIENT_ID: ecs.Secret.fromSsmParameter(this.KAKAO_CLIENT_ID),
        MAILER_USER: ecs.Secret.fromSsmParameter(this.MAILER_USER),
        MAILER_PASS: ecs.Secret.fromSsmParameter(this.MAILER_PASS),
        JWT_SECRET: ecs.Secret.fromSsmParameter(this.JWT_SECRET),
        CIPHER_HASH: ecs.Secret.fromSsmParameter(this.CIPHER_HASH),
        CIPHER_PASSWORD: ecs.Secret.fromSsmParameter(this.CIPHER_PASSWORD),
        CIPHER_SALT: ecs.Secret.fromSsmParameter(this.CIPHER_SALT),
        AWS_S3_ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(this.S3_ACCESS_KEY_ID),
        AWS_S3_ACCESS_KEY_SECRET: ecs.Secret.fromSsmParameter(this.S3_ACCESS_KEY_SECRET),
      },
      environment: {
        S3_BUCKET_NAME: 'lc-project',
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
          this.GOOGLE_CREDENTIALS_EMAIL,
        ),
        GOOGLE_CREDENTIALS_PRIVATE_KEY: ecs.Secret.fromSsmParameter(
          this.GOOGLE_CREDENTIALS_PRIVATE_KEY,
        ),
        JWT_SECRET: ecs.Secret.fromSsmParameter(this.JWT_SECRET),
        CIPHER_HASH: ecs.Secret.fromSsmParameter(this.CIPHER_HASH),
        CIPHER_PASSWORD: ecs.Secret.fromSsmParameter(this.CIPHER_PASSWORD),
        CIPHER_SALT: ecs.Secret.fromSsmParameter(this.CIPHER_SALT),
        AWS_S3_ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(this.S3_ACCESS_KEY_ID),
        AWS_S3_ACCESS_KEY_SECRET: ecs.Secret.fromSsmParameter(this.S3_ACCESS_KEY_SECRET),
      },
      environment: {
        S3_BUCKET_NAME: 'lc-project',
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
      conditions: [elbv2.ListenerCondition.hostHeaders(['preview-livecommerce.onad.io'])],
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

  private loadSsmParameters() {
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

    this.GOOGLE_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}GOOGLE_CLIENT_ID`,
      {
        version: 1,
        parameterName: constants.DEV.GOOGLE_CLIENT_ID,
      },
    );
    this.GOOGLE_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}GOOGLE_CLIENT_SECRET`,
      {
        version: 1,
        parameterName: constants.DEV.GOOGLE_CLIENT_SECRET,
      },
    );
    this.NAVER_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}NAVER_CLIENT_ID`,
      {
        version: 1,
        parameterName: constants.DEV.NAVER_CLIENT_ID,
      },
    );
    this.NAVER_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}NAVER_CLIENT_SECRET`,
      {
        version: 1,
        parameterName: constants.DEV.NAVER_CLIENT_SECRET,
      },
    );
    this.KAKAO_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}KAKAO_CLIENT_ID`,
      {
        version: 1,
        parameterName: constants.DEV.KAKAO_CLIENT_ID,
      },
    );
    this.MAILER_USER = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}MAILER_USER`,
      {
        version: 1,
        parameterName: constants.DEV.MAILER_USER,
      },
    );
    this.MAILER_PASS = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}MAILER_PASS`,
      {
        version: 1,
        parameterName: constants.DEV.MAILER_PASS,
      },
    );

    this.GOOGLE_CREDENTIALS_EMAIL =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        `${PREFIX}GOOGLE_CREDENTIALS_EMAIL`,
        {
          version: 2,
          parameterName: constants.DEV.GOOGLE_CREDENTIALS_EMAIL_KEY,
        },
      );
    this.GOOGLE_CREDENTIALS_PRIVATE_KEY =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        `${PREFIX}GOOGLE_CREDENTIALS_PRIVATE_KEY`,
        {
          version: 2,
          parameterName: constants.DEV.GOOGLE_CREDENTIALS_PRIVATE_KEY_KEY,
        },
      );

    this.JWT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}JWT_SECRET`,
      {
        version: 1,
        parameterName: constants.DEV.JWT_SECRET,
      },
    );

    this.CIPHER_HASH = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}CIPHER_HASH`,
      {
        version: 1,
        parameterName: constants.DEV.CIPHER_HASH,
      },
    );

    this.CIPHER_PASSWORD = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}CIPHER_PASSWORD`,
      {
        version: 1,
        parameterName: constants.DEV.CIPHER_PASSWORD,
      },
    );

    this.CIPHER_SALT = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}CIPHER_SALT`,
      {
        version: 1,
        parameterName: constants.DEV.CIPHER_SALT,
      },
    );

    this.S3_ACCESS_KEY_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}S3_ACCESS_KEY_ID`,
      {
        version: 2,
        parameterName: constants.DEV.S3_ACCESS_KEY_ID,
      },
    );

    this.S3_ACCESS_KEY_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}S3_ACCESS_KEY_SECRET`,
      {
        version: 2,
        parameterName: constants.DEV.S3_ACCESS_KEY_SECRET,
      },
    );

    return {
      DATABASE_URL: this.DBURL_PARAMETER,
      FIRSTMALL_DATABASE_URL: this.FIRSTMALL_DATABASE_URL,
      GOOGLE_CLIENT_ID: this.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: this.GOOGLE_CLIENT_SECRET,
      NAVER_CLIENT_ID: this.NAVER_CLIENT_ID,
      NAVER_CLIENT_SECRET: this.NAVER_CLIENT_SECRET,
      KAKAO_CLIENT_ID: this.KAKAO_CLIENT_ID,
      MAILER_USER: this.MAILER_USER,
      MAILER_PASS: this.MAILER_PASS,
      GOOGLE_CREDENTIALS_EMAIL: this.GOOGLE_CREDENTIALS_EMAIL,
      GOOGLE_CREDENTIALS_PRIVATE_KEY: this.GOOGLE_CREDENTIALS_PRIVATE_KEY,
      JWT_SECRET: this.JWT_SECRET,
      CIPHER_HASH: this.CIPHER_HASH,
      CIPHER_PASSWORD: this.CIPHER_PASSWORD,
      CIPHER_SALT: this.CIPHER_SALT,
      S3_ACCESS_KEY_ID: this.S3_ACCESS_KEY_ID,
      S3_ACCESS_KEY_SECRET: this.S3_ACCESS_KEY_SECRET,
    };
  }
}
