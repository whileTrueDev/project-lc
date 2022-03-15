import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import { Repository, TagStatus } from '@aws-cdk/aws-ecr';
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
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  ApplicationTargetGroup,
  ListenerAction,
  ListenerCondition,
  SslPolicy,
} from '@aws-cdk/aws-elasticloadbalancingv2';
import { LogGroup } from '@aws-cdk/aws-logs';
import { Construct, Duration, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { constants } from '../../constants';
import { loadSsmParam } from '../../util/loadSsmParam';

interface LCProdPrivateAppStackProps extends StackProps {
  albSecGrp: SecurityGroup;
  mailerSecGrp: SecurityGroup;
  cluster: Cluster;
  vpc: Vpc;
}
export class LCProdPrivateAppStack extends Stack {
  private readonly ID_PREFIX = `${constants.PROD.ID_PREFIX}PRIVATE-`;
  private readonly ACM_ARN = process.env.ACM_CERTIFICATE_ARN!;

  public privateAlb: ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: LCProdPrivateAppStackProps) {
    super(scope, id, props);
    const { vpc, cluster, mailerSecGrp, albSecGrp } = props;

    // * ALB
    const alb = this.createPrivateAlb(vpc, albSecGrp);
    this.privateAlb = alb;
    const albHttpsListener = this.createPrivateAlbListener(alb);

    // * Fargate services
    this.createMailerService(vpc, cluster, mailerSecGrp, albHttpsListener);
  }

  /** Private 용 로드밸런서를 구성합니다. */
  private createPrivateAlb(vpc: Vpc, albSecGrp: SecurityGroup): ApplicationLoadBalancer {
    return new ApplicationLoadBalancer(this, `${this.ID_PREFIX}ALB`, {
      vpc,
      internetFacing: true,
      loadBalancerName: `${this.ID_PREFIX}ALB`,
      vpcSubnets: {
        subnetGroupName: constants.PROD.INGRESS_SUBNET_GROUP_NAME,
      },
      securityGroup: albSecGrp,
    });
  }

  /** Private 용 로드밸런서에 HTTPS 리스너를 구성합니다 */
  private createPrivateAlbListener(alb: ApplicationLoadBalancer): ApplicationListener {
    const sslCert = Certificate.fromCertificateArn(this, 'DnsCertificates', this.ACM_ARN);
    alb.addRedirect();
    const httpsListener = alb.addListener(`${this.ID_PREFIX}ALBHTTPListener`, {
      port: 443,
      sslPolicy: SslPolicy.RECOMMENDED,
      certificates: [sslCert],
      defaultAction: ListenerAction.fixedResponse(200, {
        messageBody: 'hello world',
      }),
    });
    httpsListener.connections.allowDefaultPortFromAnyIpv4('HTTPS ALB Open to the world');
    return httpsListener;
  }

  /** 메일러 Fargate 서비스를 생성합니다. */
  private createMailerService(
    vpc: Vpc,
    cluster: Cluster,
    secGrp: SecurityGroup,
    listener: ApplicationListener,
  ): FargateService {
    const servicePrefix = 'Mailer';
    const prefix = `${this.ID_PREFIX}${servicePrefix}`;
    const repo = new Repository(this, `${prefix}Repo`, {
      repositoryName: constants.PROD.ECS_MAILER_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: TagStatus.UNTAGGED,
        },
      ],
    });

    const taskDef = new FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.PROD.ECS_MAILER_FAMILY_NAME,
    });

    const MAILER_USER = loadSsmParam(this, `${prefix}MAILER_USER`, {
      version: 3,
      parameterName: constants.PROD.MAILER_USER_KEY,
    });
    const MAILER_PASS = loadSsmParam(this, `${prefix}MAILER_PASS`, {
      version: 5,
      parameterName: constants.PROD.MAILER_PASS_KEY,
    });

    taskDef.addContainer(`${prefix}Container`, {
      image: ContainerImage.fromEcrRepository(repo),
      containerName: constants.PROD.ECS_MAILER_FAMILY_NAME,
      portMappings: [{ containerPort: constants.PROD.ECS_MAILER_PORT }],
      memoryLimitMiB: 512,
      secrets: {
        MAILER_USER: Secret.fromSsmParameter(MAILER_USER),
        MAILER_PASS: Secret.fromSsmParameter(MAILER_PASS),
      },
      environment: {
        NODE_ENV: 'test',
      },
      logging: new AwsLogDriver({
        logGroup: new LogGroup(this, `${prefix}LogGroup`, {
          logGroupName: constants.PROD.ECS_MAILER_LOG_GROUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const service = new FargateService(this, `${prefix}Service`, {
      cluster,
      taskDefinition: taskDef,
      serviceName: constants.PROD.ECS_MAILER_SERVICE_NAME,
      vpcSubnets: {
        subnetGroupName: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [secGrp],
      assignPublicIp: false,
    });

    const targetGroup = new ApplicationTargetGroup(this, `${prefix}TG`, {
      vpc,
      targetGroupName: `${prefix}TG`,
      port: constants.PROD.ECS_MAILER_PORT,
      protocol: ApplicationProtocol.HTTP,
      healthCheck: {
        enabled: true,
        path: '/',
        interval: Duration.minutes(1),
      },
      targets: [service],
    });

    listener.addTargetGroups(`${prefix}HTTPSTG`, {
      priority: 1,
      conditions: [
        ListenerCondition.hostHeaders([`mailer.${constants.PROD.PRIVATE_DOMAIN}`]),
      ],
      targetGroups: [targetGroup],
    });

    return service;
  }
}
