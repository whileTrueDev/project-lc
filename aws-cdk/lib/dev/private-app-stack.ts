import {
  aws_applicationautoscaling as autoScaling,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_ecs as ecs,
  aws_ecs_patterns as ecsPatterns,
  aws_logs as logs,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { constants } from '../../constants';
import { loadSsmParam } from '../../util/loadSsmParam';

interface LCDevPrivateAppStackProps extends StackProps {
  mailerSecGrp: ec2.SecurityGroup;
  inactiveBatchSecGrp: ec2.SecurityGroup;
  cluster: ecs.Cluster;
  vpc: ec2.Vpc;
}
export class LCDevPrivateAppStack extends Stack {
  private readonly ID_PREFIX = `${constants.DEV.ID_PREFIX}PRIVATE-`;
  private readonly ACM_ARN = process.env.ACM_CERTIFICATE_ARN!;

  constructor(scope: Construct, id: string, props: LCDevPrivateAppStackProps) {
    super(scope, id, props);
    const { vpc, cluster, mailerSecGrp, inactiveBatchSecGrp } = props;

    // * Fargate services
    this.createMailerService(cluster, mailerSecGrp);

    // * 휴면 배치 작업
    this.createInactiveBatchService(vpc, cluster, inactiveBatchSecGrp);
  }

  /** 메일러 Fargate 서비스를 생성합니다. */
  private createMailerService(
    cluster: ecs.Cluster,
    secGrp: ec2.SecurityGroup,
  ): ecs.FargateService {
    const servicePrefix = 'Mailer';
    const prefix = `${this.ID_PREFIX}${servicePrefix}`;
    const repo = new ecr.Repository(this, `${prefix}Repo`, {
      repositoryName: constants.DEV.ECS_MAILER_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: ecr.TagStatus.ANY },
        { maxImageAge: Duration.days(1), tagStatus: ecr.TagStatus.UNTAGGED },
      ],
    });

    const taskDef = new ecs.FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.DEV.ECS_MAILER_FAMILY_NAME,
    });

    taskDef.addContainer(`${prefix}Container`, {
      image: ecs.ContainerImage.fromEcrRepository(repo),
      containerName: constants.DEV.ECS_MAILER_FAMILY_NAME,
      portMappings: [{ containerPort: constants.DEV.ECS_MAILER_PORT }],
      memoryLimitMiB: 512,
      secrets: {
        MAILER_USER: ecs.Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}MAILER_USER`, {
            parameterName: constants.DEV.MAILER_USER,
          }),
        ),
        MAILER_PASS: ecs.Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}MAILER_PASS`, {
            parameterName: constants.DEV.MAILER_PASS,
          }),
        ),
        MQ_REDIS_URL: ecs.Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}MQ_REDIS_URL`, {
            parameterName: constants.DEV.MQ_REDIS_URL,
          }),
        ),
      },
      environment: {
        NODE_ENV: 'test',
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${prefix}LogGroup`, {
          logGroupName: constants.DEV.ECS_MAILER_LOG_GROUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const service = new ecs.FargateService(this, `${prefix}Service`, {
      cluster,
      taskDefinition: taskDef,
      serviceName: constants.DEV.ECS_MAILER_SERVICE_NAME,
      vpcSubnets: {
        subnetGroupName: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
      },
      platformVersion: ecs.FargatePlatformVersion.LATEST,
      desiredCount: 1,
      securityGroups: [secGrp],
      assignPublicIp: false,
    });

    return service;
  }

  /** 매 일 1시 0분마다 실행되는 휴면처리 배치프로그램 Service를 생성합니다. */
  private createInactiveBatchService(
    vpc: ec2.Vpc,
    cluster: ecs.Cluster,
    secGrp: ec2.SecurityGroup,
  ): ecsPatterns.ScheduledFargateTask {
    const servicePrefix = 'InactiveBatch';
    const prefix = `${this.ID_PREFIX}${servicePrefix}`;

    const repo = new ecr.Repository(this, `${prefix}Repo`, {
      repositoryName: constants.DEV.ECS_INACTIVE_BATCH_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: ecr.TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: ecr.TagStatus.UNTAGGED,
        },
      ],
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.DEV.ECS_INACTIVE_BATCH_FAMILY_NAME,
    });

    taskDefinition.addContainer(`${prefix}EcsContainer`, {
      containerName: constants.DEV.ECS_INACTIVE_BATCH_FAMILY_NAME,
      image: ecs.ContainerImage.fromEcrRepository(repo),
      secrets: {
        DATABASE_URL: ecs.Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}ParamDBUrl`, {
            parameterName: constants.DEV.ECS_DATABASE_URL_KEY,
          }),
        ),
        MQ_REDIS_URL: ecs.Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}MQ_REDIS_URL`, {
            parameterName: constants.DEV.MQ_REDIS_URL,
          }),
        ),
      },
      environment: {
        NODE_ENV: 'test',
        S3_BUCKET_NAME: 'lc-project',
      },
      logging: new ecs.AwsLogDriver({
        logGroup: new logs.LogGroup(this, `${prefix}LogGroup`, {
          logGroupName: constants.DEV.ECS_INACTIVE_BATCH_LOG_GROUP_NAME,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
        streamPrefix: 'ecs',
      }),
    });

    const task = new ecsPatterns.ScheduledFargateTask(this, `${prefix}Task`, {
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
      schedule: autoScaling.Schedule.rate(Duration.days(365)),
      platformVersion: ecs.FargatePlatformVersion.LATEST,
    });

    return task;
  }
}
