import * as ec2 from '@aws-cdk/aws-ec2';
import * as acm from '@aws-cdk/aws-certificatemanager';
import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  FargatePlatformVersion,
  FargateService,
  FargateTaskDefinition,
  Secret,
} from '@aws-cdk/aws-ecs';
import {
  ApplicationLoadBalancer,
  ApplicationProtocol,
  ApplicationTargetGroup,
  ListenerCondition,
  SslPolicy,
} from '@aws-cdk/aws-elasticloadbalancingv2';
import * as logs from '@aws-cdk/aws-logs';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { constants } from '../../constants';

interface LCProdAppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  albSecGrp: ec2.SecurityGroup;
  apiSecGrp: ec2.SecurityGroup;
  overlaySecGrp: ec2.SecurityGroup;
}

export class LCProdAppStack extends cdk.Stack {
  private readonly ACM_ARN =
    'arn:aws:acm:ap-northeast-2:803609402610:certificate/763681b4-a8c3-47e0-998a-24754351b499';

  private readonly PREFIX = constants.PROD.ID_PREFIX;
  private readonly vpc: ec2.Vpc;
  private readonly albSecGrp: ec2.SecurityGroup;
  private readonly apiSecGrp: ec2.SecurityGroup;
  private readonly overlaySecGrp: ec2.SecurityGroup;
  private readonly cluster: Cluster;
  private readonly parameters: ReturnType<LCProdAppStack['loadSsmParamters']>;

  public readonly apiService: FargateService;
  public readonly overlayService: FargateService;
  public readonly alb: ApplicationLoadBalancer;

  constructor(scope: cdk.Construct, id: string, props: LCProdAppStackProps) {
    super(scope, id, props);
    const { vpc, albSecGrp, apiSecGrp, overlaySecGrp } = props;
    this.vpc = vpc;
    this.albSecGrp = albSecGrp;
    this.apiSecGrp = apiSecGrp;
    this.overlaySecGrp = overlaySecGrp;

    this.parameters = this.loadSsmParamters();
    this.cluster = this.createEcsCluster();
    this.apiService = this.createApiService();
    this.overlayService = this.createOverlayService();

    this.alb = this.createALB();
  }

  private createEcsCluster(): Cluster {
    return new Cluster(this, `${this.PREFIX}ECS-Cluster`, {
      vpc: this.vpc,
      clusterName: constants.PROD.ECS_CLUSTER_NAME,
      containerInsights: true,
    });
  }

  private createApiService(): FargateService {
    const apiTaskDef = new FargateTaskDefinition(this, `${this.PREFIX}ApiTaskDef`, {
      family: constants.PROD.ECS_API_FAMILY_NAME,
    });

    const p = this.parameters;
    apiTaskDef.addContainer(`${this.PREFIX}ApiContainer`, {
      containerName: constants.PROD.ECS_API_FAMILY_NAME,
      portMappings: [{ containerPort: constants.PROD.ECS_API_PORT }],
      image: ContainerImage.fromRegistry(`hwasurr/${constants.PROD.ECS_API_FAMILY_NAME}`),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: Secret.fromSsmParameter(p.DATABASE_URL),
        FIRSTMALL_DATABASE_URL: Secret.fromSsmParameter(p.FIRSTMALL_DATABASE_URL),
        GOOGLE_CLIENT_ID: Secret.fromSsmParameter(p.GOOGLE_CLIENT_ID),
        GOOGLE_CLIENT_SECRET: Secret.fromSsmParameter(p.GOOGLE_CLIENT_SECRET),
        NAVER_CLIENT_ID: Secret.fromSsmParameter(p.NAVER_CLIENT_ID),
        NAVER_CLIENT_SECRET: Secret.fromSsmParameter(p.NAVER_CLIENT_SECRET),
        KAKAO_CLIENT_ID: Secret.fromSsmParameter(p.KAKAO_CLIENT_ID),
        MAILER_USER: Secret.fromSsmParameter(p.MAILER_USER),
        GMAIL_OAUTH_REFRESH_TOKEN: Secret.fromSsmParameter(p.GMAIL_OAUTH_REFRESH_TOKEN),
        GMAIL_OAUTH_CLIENT_ID: Secret.fromSsmParameter(p.GMAIL_OAUTH_CLIENT_ID),
        GMAIL_OAUTH_CLIENT_SECRET: Secret.fromSsmParameter(p.GMAIL_OAUTH_CLIENT_SECRET),
        JWT_SECRET: Secret.fromSsmParameter(p.JWT_SECRET),
        CIPHER_HASH: Secret.fromSsmParameter(p.CIPHER_HASH),
        CIPHER_PASSWORD: Secret.fromSsmParameter(p.CIPHER_PASSWORD),
        CIPHER_SALT: Secret.fromSsmParameter(p.CIPHER_SALT),
        AWS_S3_ACCESS_KEY_ID: Secret.fromSsmParameter(p.S3_ACCESS_KEY_ID),
        AWS_S3_ACCESS_KEY_SECRET: Secret.fromSsmParameter(p.S3_ACCESS_KEY_SECRET),
      },
      environment: {
        S3_BUCKET_NAME: 'lc-project',
      },
      logging: new AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${this.PREFIX}ApiLogGroup`, {
          logGroupName: constants.PROD.ECS_API_LOG_GLOUP_NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const service = new FargateService(this, `${this.PREFIX}ApiService`, {
      cluster: this.cluster,
      serviceName: constants.PROD.ECS_API_SERVICE_NAME,
      taskDefinition: apiTaskDef,
      vpcSubnets: {
        subnetGroupName: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [this.apiSecGrp],
      assignPublicIp: false,
    });
    return service;
  }

  private createOverlayService(): FargateService {
    const overlayTaskDef = new FargateTaskDefinition(
      this,
      `${this.PREFIX}OverlayTaskDef`,
      {
        family: constants.PROD.ECS_OVERLAY_FAMILY_NAME,
      },
    );
    const p = this.parameters;
    overlayTaskDef.addContainer(`${this.PREFIX}OverlayContainer`, {
      containerName: constants.PROD.ECS_OVERLAY_FAMILY_NAME,
      portMappings: [{ containerPort: constants.PROD.ECS_OVERLAY_PORT }],
      image: ContainerImage.fromRegistry(
        `hwasurr/${constants.PROD.ECS_OVERLAY_FAMILY_NAME}`,
      ),
      memoryLimitMiB: 512,
      secrets: {
        DATABASE_URL: Secret.fromSsmParameter(p.DATABASE_URL),
        FIRSTMALL_DATABASE_URL: Secret.fromSsmParameter(p.FIRSTMALL_DATABASE_URL),
        GOOGLE_CREDENTIALS_EMAIL: Secret.fromSsmParameter(p.GOOGLE_CREDENTIALS_EMAIL),
        GOOGLE_CREDENTIALS_PRIVATE_KEY: Secret.fromSsmParameter(
          p.GOOGLE_CREDENTIALS_PRIVATE_KEY,
        ),
        JWT_SECRET: Secret.fromSsmParameter(p.JWT_SECRET),
        CIPHER_HASH: Secret.fromSsmParameter(p.CIPHER_HASH),
        CIPHER_PASSWORD: Secret.fromSsmParameter(p.CIPHER_PASSWORD),
        CIPHER_SALT: Secret.fromSsmParameter(p.CIPHER_SALT),
        AWS_S3_ACCESS_KEY_ID: Secret.fromSsmParameter(p.S3_ACCESS_KEY_ID),
        AWS_S3_ACCESS_KEY_SECRET: Secret.fromSsmParameter(p.S3_ACCESS_KEY_SECRET),
      },
      environment: {
        S3_BUCKET_NAME: 'lc-project',
      },
      logging: new AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${this.PREFIX}OverlayLogGroup`, {
          logGroupName: constants.PROD.ECS_OVERLAY_LOG_GLOUP_NAME,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const service = new FargateService(this, `${this.PREFIX}OverlayService`, {
      cluster: this.cluster,
      serviceName: constants.PROD.ECS_OVERLAY_SERVICE_NAME,
      taskDefinition: overlayTaskDef,
      vpcSubnets: {
        subnetGroupName: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [this.overlaySecGrp],
      assignPublicIp: false,
    });

    return service;
  }

  private createALB(): ApplicationLoadBalancer {
    const alb = new ApplicationLoadBalancer(this, `${this.PREFIX}ALB`, {
      vpc: this.vpc,
      internetFacing: true,
      loadBalancerName: `${this.PREFIX}ALB`,
      vpcSubnets: {
        subnetGroupName: constants.PROD.INGRESS_SUBNET_GROUP_NAME,
      },
      securityGroup: this.albSecGrp,
    });

    // Redirect 80(http) to 440(https)
    alb.addRedirect();

    const apiTargetGroup = new ApplicationTargetGroup(
      this,
      `${this.PREFIX}ApiTargetGroup`,
      {
        vpc: this.vpc,
        targetGroupName: `APITargetGroupProd`,
        port: constants.PROD.ECS_API_PORT,
        protocol: ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: '/',
          interval: cdk.Duration.minutes(1),
        },
        targets: [this.apiService],
      },
    );

    const sslCert = acm.Certificate.fromCertificateArn(
      this,
      'DnsCertificates',
      this.ACM_ARN,
    );
    const httpsListener = alb.addListener(`${this.PREFIX}ALBHttpsListener`, {
      port: 443,

      certificates: [sslCert],
      sslPolicy: SslPolicy.RECOMMENDED,
      defaultTargetGroups: [apiTargetGroup],
    });
    httpsListener.connections.allowDefaultPortFromAnyIpv4('Open HTTP ALB to anywhere');
    httpsListener.addTargetGroups(`${this.PREFIX}AddApiTargetGroup`, {
      priority: 1,
      conditions: [ListenerCondition.hostHeaders([`api.${constants.PUNYCODE_DOMAIN}`])],
      targetGroups: [apiTargetGroup],
    });
    const overlayTargetGroup = new ApplicationTargetGroup(
      this,
      `${this.PREFIX}OverlayTargetGroup`,
      {
        vpc: this.vpc,
        targetGroupName: 'OerlayTargetGroupProd',
        port: constants.PROD.ECS_OVERLAY_PORT,
        protocol: ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: '/',
          interval: cdk.Duration.minutes(1),
        },
        targets: [this.overlayService],
      },
    );
    httpsListener.addTargetGroups(`${this.PREFIX}AddOverlayTargetGroup`, {
      priority: 2,
      conditions: [ListenerCondition.hostHeaders([`live.${constants.PUNYCODE_DOMAIN}`])],
      targetGroups: [overlayTargetGroup],
    });

    return alb;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private loadSsmParamters() {
    const c = constants.PROD;

    const __loadSsmParmeter = (
      parameterName: string,
      version = 1,
    ): ssm.IStringParameter => {
      return ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        constants.PROD.ID_PREFIX + parameterName,
        { parameterName, version },
      );
    };
    return {
      // TODO: PROD DB로 변경필요
      DATABASE_URL: __loadSsmParmeter(c.DATABASE_URL_KEY, 2),
      FIRSTMALL_DATABASE_URL: __loadSsmParmeter(c.FIRSTMALL_DATABASE_URL_KEY),
      GOOGLE_CLIENT_ID: __loadSsmParmeter(c.GOOGLE_CLIENT_ID_KEY, 2),
      GOOGLE_CLIENT_SECRET: __loadSsmParmeter(c.GOOGLE_CLIENT_SECRET_KEY, 2),
      NAVER_CLIENT_ID: __loadSsmParmeter(c.NAVER_CLIENT_ID_KEY, 2),
      NAVER_CLIENT_SECRET: __loadSsmParmeter(c.NAVER_CLIENT_SECRET_KEY, 2),
      KAKAO_CLIENT_ID: __loadSsmParmeter(c.KAKAO_CLIENT_ID_KEY, 2),
      MAILER_USER: __loadSsmParmeter(c.MAILER_USER_KEY, 2),
      GMAIL_OAUTH_REFRESH_TOKEN: __loadSsmParmeter(c.GMAIL_OAUTH_REFRESH_TOKEN),
      GMAIL_OAUTH_CLIENT_ID: __loadSsmParmeter(c.GMAIL_OAUTH_CLIENT_ID),
      GMAIL_OAUTH_CLIENT_SECRET: __loadSsmParmeter(c.GMAIL_OAUTH_CLIENT_SECRET),
      JWT_SECRET: __loadSsmParmeter(c.JWT_SECRET_KEY),
      CIPHER_HASH: __loadSsmParmeter(c.CIPHER_HASH_KEY),
      CIPHER_PASSWORD: __loadSsmParmeter(c.CIPHER_PASSWORD_KEY),
      CIPHER_SALT: __loadSsmParmeter(c.CIPHER_SALT_KEY),
      S3_ACCESS_KEY_ID: __loadSsmParmeter(c.S3_ACCESS_KEY_ID_KEY),
      S3_ACCESS_KEY_SECRET: __loadSsmParmeter(c.S3_ACCESS_KEY_SECRET_KEY),
      GOOGLE_CREDENTIALS_EMAIL: __loadSsmParmeter(c.GOOGLE_CREDENTIALS_EMAIL_KEY, 2),
      GOOGLE_CREDENTIALS_PRIVATE_KEY: __loadSsmParmeter(
        c.GOOGLE_CREDENTIALS_PRIVATE_KEY_KEY,
        2,
      ),
    };
  }
}
