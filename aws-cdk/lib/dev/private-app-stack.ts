import { Schedule } from '@aws-cdk/aws-applicationautoscaling';
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
import { ScheduledFargateTask } from '@aws-cdk/aws-ecs-patterns';
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

interface LCDevPrivateAppStackProps extends StackProps {
  albSecGrp: SecurityGroup;
  mailerSecGrp: SecurityGroup;
  inactiveBatchSecGrp: SecurityGroup;
  cluster: Cluster;
  vpc: Vpc;
}
export class LCDevPrivateAppStack extends Stack {
  private readonly ID_PREFIX = `${constants.DEV.ID_PREFIX}PRIVATE-`;
  private readonly ACM_ARN = process.env.ACM_CERTIFICATE_ARN!;

  public privateAlb: ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: LCDevPrivateAppStackProps) {
    super(scope, id, props);
    const { vpc, cluster, mailerSecGrp, albSecGrp, inactiveBatchSecGrp } = props;

    // * ALB
    const alb = this.createPrivateAlb(vpc, albSecGrp);
    this.privateAlb = alb;
    const albHttpsListener = this.createPrivateAlbListener(alb);

    // * Fargate services
    this.createMailerService(vpc, cluster, mailerSecGrp, albHttpsListener);

    // * 휴면 배치 작업
    this.createInactiveBatchService(vpc, cluster, inactiveBatchSecGrp);
  }

  /** Private 용 로드밸런서를 구성합니다. */
  private createPrivateAlb(vpc: Vpc, albSecGrp: SecurityGroup): ApplicationLoadBalancer {
    return new ApplicationLoadBalancer(this, `${this.ID_PREFIX}ALB`, {
      vpc,
      internetFacing: true,
      loadBalancerName: `${this.ID_PREFIX}Alb`,
      vpcSubnets: {
        subnetGroupName: constants.DEV.INGRESS_SUBNET_GROUP_NAME,
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
      repositoryName: constants.DEV.ECS_MAILER_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: TagStatus.UNTAGGED,
        },
      ],
    });

    const taskDef = new FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.DEV.ECS_MAILER_FAMILY_NAME,
    });

    const MAILER_USER = loadSsmParam(this, `${prefix}MAILER_USER`, {
      version: 3,
      parameterName: constants.DEV.MAILER_USER,
    });
    const MAILER_PASS = loadSsmParam(this, `${prefix}MAILER_PASS`, {
      version: 5,
      parameterName: constants.DEV.MAILER_PASS,
    });

    taskDef.addContainer(`${prefix}Container`, {
      image: ContainerImage.fromEcrRepository(repo),
      containerName: constants.DEV.ECS_MAILER_FAMILY_NAME,
      portMappings: [{ containerPort: constants.DEV.ECS_MAILER_PORT }],
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
          logGroupName: constants.DEV.ECS_MAILER_LOG_GROUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const service = new FargateService(this, `${prefix}Service`, {
      cluster,
      taskDefinition: taskDef,
      serviceName: constants.DEV.ECS_MAILER_SERVICE_NAME,
      vpcSubnets: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [secGrp],
      assignPublicIp: false,
    });

    const targetGroup = new ApplicationTargetGroup(this, `${prefix}TargetGroup`, {
      vpc,
      targetGroupName: `${prefix}TargetGroup`,
      port: constants.DEV.ECS_MAILER_PORT,
      protocol: ApplicationProtocol.HTTP,
      healthCheck: {
        enabled: true,
        path: '/',
        interval: Duration.minutes(1),
      },
      targets: [service],
    });

    listener.addTargetGroups(`${prefix}HTTPSTargetGroup`, {
      priority: 1,
      conditions: [
        ListenerCondition.hostHeaders([`dev-mailer.${constants.PUNYCODE_DOMAIN}`]),
      ],
      targetGroups: [targetGroup],
    });

    return service;
  }

  /** 매 일 1시 0분마다 실행되는 휴면처리 배치프로그램 Service를 생성합니다. */
  private createInactiveBatchService(
    vpc: Vpc,
    cluster: Cluster,
    secGrp: SecurityGroup,
  ): ScheduledFargateTask {
    const servicePrefix = 'InactiveBatch';
    const prefix = `${this.ID_PREFIX}${servicePrefix}`;

    const repo = new Repository(this, `${prefix}Repo`, {
      repositoryName: constants.DEV.ECS_INACTIVE_BATCH_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: TagStatus.UNTAGGED,
        },
      ],
    });

    const taskDefinition = new FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.DEV.ECS_INACTIVE_BATCH_FAMILY_NAME,
    });

    taskDefinition.addContainer(`${prefix}EcsContainer`, {
      containerName: constants.DEV.ECS_INACTIVE_BATCH_FAMILY_NAME,
      image: ContainerImage.fromEcrRepository(repo),
      secrets: {
        DATABASE_URL: Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}ParamDBUrl`, {
            parameterName: constants.DEV.ECS_DATABASE_URL_KEY,
          }),
        ),
      },
      environment: {
        NODE_ENV: 'test',
        S3_BUCKET_NAME: 'lc-project',
        MAILER_HOST: `https://dev-mailer.${constants.PUNYCODE_DOMAIN}`,
      },
      logging: new AwsLogDriver({
        logGroup: new LogGroup(this, `${prefix}LogGroup`, {
          logGroupName: constants.DEV.ECS_INACTIVE_BATCH_LOG_GROUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const task = new ScheduledFargateTask(this, `${prefix}Task`, {
      vpc,
      cluster,
      desiredTaskCount: 1,
      enabled: true,
      subnetSelection: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      securityGroups: [secGrp],
      scheduledFargateTaskDefinitionOptions: {
        taskDefinition,
      },
      // 매일 5분 마다
      schedule: Schedule.rate(Duration.days(365)),
      platformVersion: FargatePlatformVersion.LATEST,
    });

    return task;
  }
}
