/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Construct } from 'constructs';
import {
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  aws_ec2 as ec2,
  aws_ssm as ssm,
  aws_elasticloadbalancingv2 as elbv2,
  aws_ecs as ecs,
  aws_ecr as ecr,
  aws_logs as logs,
  aws_certificatemanager as acm,
} from 'aws-cdk-lib';
import { constants } from '../../constants';
import { loadSsmParam } from '../../util/loadSsmParam';

interface LCDevAppStackProps extends StackProps {
  vpc: ec2.Vpc;
  apiSecGrp: ec2.SecurityGroup;
  overlaySecGrp: ec2.SecurityGroup;
  albSecGrp: ec2.SecurityGroup;
  overlayControllerSecGrp: ec2.SecurityGroup;
  realtimeApiSecGrp: ec2.SecurityGroup;
}

const PREFIX = 'LC-DEV-APP';

export class LCDevAppStack extends Stack {
  private readonly ACM_ARN = process.env.ACM_CERTIFICATE_ARN!;

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
  private WHILETRUE_IP_ADDRESS: ssm.IStringParameter;
  private REDIS_URL: ssm.IStringParameter;
  private CACHE_REDIS_URL: ssm.IStringParameter;
  private MQ_REDIS_URL: ssm.IStringParameter;
  private TOSS_PAYMENTS_SECRET_KEY: ssm.IStringParameter;

  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly cluster: ecs.Cluster;

  constructor(scope: Construct, id: string, props: LCDevAppStackProps) {
    super(scope, id, props);

    const {
      vpc,
      apiSecGrp,
      overlaySecGrp,
      albSecGrp,
      overlayControllerSecGrp,
      realtimeApiSecGrp,
    } = props;

    // * ECS Cluster
    const cluster = new ecs.Cluster(this, `${PREFIX}EcsCluster`, {
      vpc,
      clusterName: constants.DEV.ECS_CLUSTER,
      containerInsights: true,
    });
    this.cluster = cluster;

    // * 환경변수 주입을 위한 파라미터 로딩
    this.loadSsmParameters();

    // * API server
    const apiService = this.createApiAppService(cluster, apiSecGrp);
    // * overlay server
    const overlayService = this.createOverlayAppService(cluster, overlaySecGrp);
    // * overlay-controller server
    const overlayControllerService = this.createOverlayControllerAppService(
      cluster,
      overlayControllerSecGrp,
    );
    // * realtime API server
    const realtimeApiService = this.createRealtimeApiAppService(
      cluster,
      realtimeApiSecGrp,
    );

    this.alb = this.createPublicALB({
      vpc,
      apiService,
      overlayService,
      sg: albSecGrp,
      overlayControllerService,
      realtimeApiService,
    });
  }

  /** API 서버 ECS Fargate Service 생성 메서드 */
  private createApiAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const repo = new ecr.Repository(this, `${PREFIX}ApiRepo`, {
      repositoryName: constants.DEV.ECS_API_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: ecr.TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: ecr.TagStatus.UNTAGGED,
        },
      ],
    });
    const apiTaskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSTaskDef`, {
      family: constants.DEV.ECS_API_FAMILY_NAME,
    });
    apiTaskDef.addContainer(`${PREFIX}ECSContainer`, {
      containerName: 'project-lc-api-dev',
      portMappings: [{ containerPort: constants.DEV.ECS_API_PORT }],
      image: ecs.ContainerImage.fromEcrRepository(repo),
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
        WHILETRUE_IP_ADDRESS: ecs.Secret.fromSsmParameter(this.WHILETRUE_IP_ADDRESS),
        CACHE_REDIS_URL: ecs.Secret.fromSsmParameter(this.CACHE_REDIS_URL),
        MQ_REDIS_URL: ecs.Secret.fromSsmParameter(this.MQ_REDIS_URL),
        TOSS_PAYMENTS_SECRET_KEY: ecs.Secret.fromSsmParameter(
          this.TOSS_PAYMENTS_SECRET_KEY,
        ),
      },
      environment: {
        S3_BUCKET_NAME: 'project-lc-dev-test',
        API_HOST: `https://dev-api.${constants.PUNYCODE_DOMAIN}`,
        SELLER_WEB_HOST: `https://dev-seller.${constants.PUNYCODE_DOMAIN}`,
        BROADCASTER_WEB_HOST: `https://dev-broadcaster.${constants.PUNYCODE_DOMAIN}`,
        KKSHOW_WEB_HOST: `https://dev.${constants.PUNYCODE_DOMAIN}`,
        NODE_ENV: 'test',
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}LogGroup`, {
          logGroupName: constants.DEV.ECS_API_LOG_GLOUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
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
      securityGroups: [secgrp],
      assignPublicIp: false,
    });
  }

  /** 라-커 화면 Overlay 서버 ECS Fargate Service 생성 메서드 */
  private createOverlayAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const repo = new ecr.Repository(this, `${PREFIX}OverlayRepo`, {
      repositoryName: constants.DEV.ECS_OVERLAY_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: ecr.TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: ecr.TagStatus.UNTAGGED,
        },
      ],
    });
    const taskDef = new ecs.FargateTaskDefinition(this, `${PREFIX}ECSOverlayTaskDef`, {
      family: constants.DEV.ECS_OVERLAY_FAMILY_NAME,
    });
    taskDef.addContainer(`${PREFIX}ECSOverlayContainer`, {
      containerName: 'project-lc-overlay-dev',
      portMappings: [{ containerPort: constants.DEV.ECS_OVERLAY_PORT }],
      image: ecs.ContainerImage.fromEcrRepository(repo),
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
        CACHE_REDIS_URL: ecs.Secret.fromSsmParameter(this.CACHE_REDIS_URL),
        MQ_REDIS_URL: ecs.Secret.fromSsmParameter(this.MQ_REDIS_URL),
      },
      environment: {
        S3_BUCKET_NAME: 'project-lc-dev-test',
        NODE_ENV: 'test',
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}OverlayLogGroup`, {
          logGroupName: constants.DEV.ECS_OVERLAY_LOG_GLOUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
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
      securityGroups: [secgrp],
      assignPublicIp: false,
    });
  }

  /** 라-커 화면제어 OverlayController 서버 ECS Fargate Service 생성 메서드 */
  private createOverlayControllerAppService(
    cluster: ecs.Cluster,
    secgrp: ec2.SecurityGroup,
  ) {
    const repo = new ecr.Repository(this, `${PREFIX}OverlayControllerRepo`, {
      repositoryName: constants.DEV.ECS_OVERLAY_CONTROLLER_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: ecr.TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: ecr.TagStatus.UNTAGGED,
        },
      ],
    });
    const taskDef = new ecs.FargateTaskDefinition(
      this,
      `${PREFIX}ECSOverlayControllerTaskDef`,
      {
        family: constants.DEV.ECS_OVERLAY_CONTROLLER_FAMILY_NAME,
      },
    );
    taskDef.addContainer(`${PREFIX}ECSOverlayControllerContainer`, {
      containerName: constants.DEV.ECS_OVERLAY_CONTROLLER_FAMILY_NAME,
      portMappings: [{ containerPort: constants.DEV.ECS_OVERLAY_CONTROLLER_PORT }],
      image: ecs.ContainerImage.fromEcrRepository(repo),
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
        CACHE_REDIS_URL: ecs.Secret.fromSsmParameter(this.CACHE_REDIS_URL),
      },
      environment: {
        S3_BUCKET_NAME: 'project-lc-dev-test',
        OVERLAY_HOST: `https://dev-live.${constants.PUNYCODE_DOMAIN}`,
        OVERLAY_CONTROLLER_HOST: `https://dev-overlay-controller.${constants.PUNYCODE_DOMAIN}`,
        REALTIME_API_HOST: `https://dev-realtime.${constants.PUNYCODE_DOMAIN}`,
        NODE_ENV: 'test',
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}OverlayControllerLogGroup`, {
          logGroupName: constants.DEV.ECS_OVERLAY_CONTROLLER_LOG_GLOUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    return new ecs.FargateService(this, `${PREFIX}OverlayControllerService`, {
      serviceName: constants.DEV.ECS_OVERLAY_CONTROLLER_SERVICE_NAME,
      cluster,
      taskDefinition: taskDef,
      vpcSubnets: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [secgrp],
      assignPublicIp: false,
    });
  }

  private createRealtimeApiAppService(cluster: ecs.Cluster, secgrp: ec2.SecurityGroup) {
    const repo = new ecr.Repository(this, `${PREFIX}RealtimeApiRepo`, {
      repositoryName: constants.DEV.ECS_REALTIME_API_FAMILY_NAME,
    });
    const realtimeApiTaskDef = new ecs.FargateTaskDefinition(
      this,
      `${PREFIX}RealtimeApiTaskDef`,
      {
        family: constants.DEV.ECS_REALTIME_API_FAMILY_NAME,
      },
    );
    realtimeApiTaskDef.addContainer(`${PREFIX}RealtimeApiContainer`, {
      containerName: constants.DEV.ECS_REALTIME_API_FAMILY_NAME,
      portMappings: [{ containerPort: constants.DEV.ECS_REALTIME_API_PORT }],
      image: ecs.ContainerImage.fromEcrRepository(repo),
      memoryLimitMiB: 512,
      secrets: {
        JWT_SECRET: ecs.Secret.fromSsmParameter(this.JWT_SECRET),
        CIPHER_HASH: ecs.Secret.fromSsmParameter(this.CIPHER_HASH),
        CIPHER_PASSWORD: ecs.Secret.fromSsmParameter(this.CIPHER_PASSWORD),
        CIPHER_SALT: ecs.Secret.fromSsmParameter(this.CIPHER_SALT),
        REDIS_URL: ecs.Secret.fromSsmParameter(this.REDIS_URL),
        CACHE_REDIS_URL: ecs.Secret.fromSsmParameter(this.CACHE_REDIS_URL),
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${PREFIX}RealtimeApiLogGroup`, {
          logGroupName: constants.DEV.ECS_REALTIME_API_LOG_GROUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    return new ecs.FargateService(this, `${PREFIX}RealtimeApiService`, {
      cluster,
      serviceName: constants.DEV.ECS_REALTIME_API_SERVICE_NAME,
      taskDefinition: realtimeApiTaskDef,
      vpcSubnets: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [secgrp],
      assignPublicIp: false,
    });
  }

  /** ALB 생성 */
  private createPublicALB({
    vpc,
    apiService,
    overlayService,
    overlayControllerService,
    realtimeApiService,
    sg,
  }: {
    vpc: ec2.Vpc;
    apiService: ecs.FargateService;
    overlayService: ecs.FargateService;
    overlayControllerService: ecs.FargateService;
    realtimeApiService: ecs.FargateService;
    sg: ec2.SecurityGroup;
  }) {
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
    alb.addRedirect();

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
          interval: Duration.minutes(1),
        },
        targets: [apiService],
      },
    );

    const sslCert = acm.Certificate.fromCertificateArn(
      this,
      'DnsCertificates',
      this.ACM_ARN,
    );

    // ALB에 HTTP 리스너 추가
    const HttpsListener = alb.addListener(`${PREFIX}ALBHttpsListener`, {
      port: 443,
      sslPolicy: elbv2.SslPolicy.RECOMMENDED,
      certificates: [sslCert],
      defaultTargetGroups: [apiTargetGroup],
    });
    HttpsListener.connections.allowDefaultPortFromAnyIpv4('https ALB open to world');

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
          interval: Duration.minutes(1),
        },
        targets: [overlayService],
      },
    );

    // HTTP 리스너에 Overlay 서버 타겟그룹 추가
    HttpsListener.addTargetGroups(`${PREFIX}HTTPSOverlayTargetGroup`, {
      priority: 2,
      conditions: [
        elbv2.ListenerCondition.hostHeaders([`dev-live.${constants.PUNYCODE_DOMAIN}`]),
      ],
      targetGroups: [overlayTargetGroup],
    });

    const overlayControllerTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      `${PREFIX}OverlayControllerTargetGroup`,
      {
        vpc,
        targetGroupName: 'OverlayControllerTargetGroup',
        port: constants.DEV.ECS_OVERLAY_CONTROLLER_PORT,
        protocol: elbv2.ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: '/health-check',
          interval: Duration.minutes(1),
        },
        targets: [overlayControllerService],
      },
    );

    // HTTP 리스너에 Overlay-controller 서버 타겟그룹 추가
    HttpsListener.addTargetGroups(`${PREFIX}HTTPSOverlayControllerTargetGroup`, {
      priority: 3,
      conditions: [
        elbv2.ListenerCondition.hostHeaders([
          `dev-overlay-controller.${constants.PUNYCODE_DOMAIN}`,
        ]),
        elbv2.ListenerCondition.sourceIps([constants.WHILETRUE_IP_ADDRESS]),
      ],
      targetGroups: [overlayControllerTargetGroup],
    });

    const realtimeApiTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      `${PREFIX}RealtimeApiTargetGroup`,
      {
        vpc,
        targetGroupName: 'RealtimeApiTargetGroup',
        port: constants.DEV.ECS_REALTIME_API_PORT,
        protocol: elbv2.ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: '/',
          interval: Duration.minutes(1),
        },
        targets: [realtimeApiService],
      },
    );
    // HTTP 리스너에 RealtimeAPI 서버 타겟그룹 추가
    HttpsListener.addTargetGroups(`${PREFIX}HTTPSRealtimeApiTargetGroup`, {
      priority: 4,
      conditions: [
        elbv2.ListenerCondition.hostHeaders([
          `dev-realtime.${constants.PUNYCODE_DOMAIN}`,
        ]),
      ],
      targetGroups: [realtimeApiTargetGroup],
    });

    return alb;
  }

  private loadSsmParameters() {
    this.DBURL_PARAMETER = loadSsmParam(this, `${PREFIX}DBUrlSecret`, {
      parameterName: constants.DEV.ECS_DATABASE_URL_KEY,
      version: 4,
    });

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
        version: 2,
        parameterName: constants.DEV.GOOGLE_CLIENT_ID,
      },
    );
    this.GOOGLE_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}GOOGLE_CLIENT_SECRET`,
      {
        version: 2,
        parameterName: constants.DEV.GOOGLE_CLIENT_SECRET,
      },
    );
    this.NAVER_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}NAVER_CLIENT_ID`,
      {
        version: 2,
        parameterName: constants.DEV.NAVER_CLIENT_ID,
      },
    );
    this.NAVER_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}NAVER_CLIENT_SECRET`,
      {
        version: 2,
        parameterName: constants.DEV.NAVER_CLIENT_SECRET,
      },
    );
    this.KAKAO_CLIENT_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}KAKAO_CLIENT_ID`,
      {
        version: 2,
        parameterName: constants.DEV.KAKAO_CLIENT_ID,
      },
    );
    this.MAILER_USER = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}MAILER_USER`,
      {
        version: 3,
        parameterName: constants.DEV.MAILER_USER,
      },
    );
    this.MAILER_PASS = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}MAILER_PASS`,
      {
        version: 5,
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

    this.WHILETRUE_IP_ADDRESS = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}WHILETRUE_IP_ADDRESS`,
      {
        version: 2,
        parameterName: constants.DEV.WHILETRUE_IP_ADDRESS,
      },
    );

    this.REDIS_URL = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}REDIS_URL`,
      {
        version: 4,
        parameterName: constants.DEV.REDIS_URL,
      },
    );

    this.CACHE_REDIS_URL = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}CACHE_REDIS_URL`,
      {
        version: 3,
        parameterName: constants.DEV.CACHE_REDIS_URL,
      },
    );

    this.MQ_REDIS_URL = ssm.StringParameter.fromSecureStringParameterAttributes(
      this,
      `${PREFIX}MQ_REDIS_URL`,
      { parameterName: constants.DEV.MQ_REDIS_URL },
    );

    this.TOSS_PAYMENTS_SECRET_KEY =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        `${PREFIX}TOSS_PAYMENTS_SECRET_KEY`,
        { parameterName: constants.DEV.TOSS_PAYMENTS_SECRET_KEY },
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
      GOOGLE_CREDENTIALS_EMAIL: this.GOOGLE_CREDENTIALS_EMAIL,
      GOOGLE_CREDENTIALS_PRIVATE_KEY: this.GOOGLE_CREDENTIALS_PRIVATE_KEY,
      JWT_SECRET: this.JWT_SECRET,
      CIPHER_HASH: this.CIPHER_HASH,
      CIPHER_PASSWORD: this.CIPHER_PASSWORD,
      CIPHER_SALT: this.CIPHER_SALT,
      S3_ACCESS_KEY_ID: this.S3_ACCESS_KEY_ID,
      S3_ACCESS_KEY_SECRET: this.S3_ACCESS_KEY_SECRET,
      WHILETRUE_IP_ADDRESS: this.WHILETRUE_IP_ADDRESS,
      REDIS_URL: this.REDIS_URL,
      CACHE_REDIS_URL: this.CACHE_REDIS_URL,
      MQ_REDIS_URL: this.MQ_REDIS_URL,
      TOSS_PAYMENTS_SECRET_KEY: this.TOSS_PAYMENTS_SECRET_KEY,
    };
  }
}
