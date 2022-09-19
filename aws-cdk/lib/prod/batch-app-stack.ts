import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository, TagStatus } from 'aws-cdk-lib/aws-ecr';
import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  FargatePlatformVersion,
  FargateTaskDefinition,
  Secret,
} from 'aws-cdk-lib/aws-ecs';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { constants } from '../../constants';
import { loadSsmParam } from '../../util/loadSsmParam';

interface LCBatchAppStackProps extends StackProps {
  vpc: Vpc;
  cluster: Cluster;
  inactiveBatchSecGrp: SecurityGroup;
  virtualAccountBatchSecGrp: SecurityGroup;
}
export class LCBatchAppStack extends Stack {
  private readonly ID_PREFIX = `${constants.PROD.ID_PREFIX}Batch-`;

  constructor(scope: Construct, id: string, props: LCBatchAppStackProps) {
    super(scope, id, props);
    const { vpc, cluster, inactiveBatchSecGrp, virtualAccountBatchSecGrp } = props;

    // * Fargate scheduled services
    this.createInactiveBatchService(vpc, cluster, inactiveBatchSecGrp);
    this.createVirtualAccountBatchService(vpc, cluster, virtualAccountBatchSecGrp);
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
      repositoryName: constants.PROD.ECS_INACTIVE_BATCH_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: TagStatus.ANY },
        { maxImageAge: Duration.days(1), tagStatus: TagStatus.UNTAGGED },
      ],
    });

    const taskDefinition = new FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.PROD.ECS_INACTIVE_BATCH_FAMILY_NAME,
    });

    taskDefinition.addContainer(`${prefix}EcsContainer`, {
      containerName: constants.PROD.ECS_INACTIVE_BATCH_FAMILY_NAME,
      image: ContainerImage.fromEcrRepository(repo),
      secrets: {
        DATABASE_URL: Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}ParamDBUrl`, {
            parameterName: constants.PROD.DATABASE_URL_KEY,
          }),
        ),
        MQ_REDIS_URL: Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}MQ_REDIS_URL`, {
            parameterName: constants.PROD.MQ_REDIS_URL_KEY,
          }),
        ),
      },
      environment: {
        NODE_ENV: 'production',
        S3_BUCKET_NAME: 'lc-project',
        MAILER_HOST: `https://mailer.${constants.PUNYCODE_DOMAIN}`,
      },
      logging: new AwsLogDriver({
        logGroup: new LogGroup(this, `${prefix}LogGroup`, {
          logGroupName: constants.PROD.ECS_INACTIVE_BATCH_LOG_GROUP_NAME,
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
        subnetGroupName: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
      },
      securityGroups: [secGrp],
      scheduledFargateTaskDefinitionOptions: {
        taskDefinition,
      },
      // 매일 1시 0 분
      schedule: Schedule.cron({ hour: '1', minute: '0' }),
      platformVersion: FargatePlatformVersion.LATEST,
    });

    return task;
  }

  /** 매 일 1시 0분마다 실행되는 입금기한 넘긴 가상계좌 결제처리 배치프로그램 Service를 생성합니다. */
  private createVirtualAccountBatchService(
    vpc: Vpc,
    cluster: Cluster,
    secGrp: SecurityGroup,
  ): ScheduledFargateTask {
    const servicePrefix = 'VirtualAccount';
    const prefix = `${this.ID_PREFIX}${servicePrefix}`;

    const repo = new Repository(this, `${prefix}Repo`, {
      repositoryName: constants.PROD.ECS_VIRTUAL_ACCOUNT_BATCH_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: TagStatus.ANY },
        { maxImageAge: Duration.days(1), tagStatus: TagStatus.UNTAGGED },
      ],
    });

    const taskDefinition = new FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.PROD.ECS_VIRTUAL_ACCOUNT_BATCH_FAMILY_NAME,
    });

    taskDefinition.addContainer(`${prefix}EcsContainer`, {
      containerName: constants.PROD.ECS_VIRTUAL_ACCOUNT_BATCH_FAMILY_NAME,
      image: ContainerImage.fromEcrRepository(repo),
      secrets: {
        DATABASE_URL: Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}ParamDBUrl`, {
            parameterName: constants.PROD.DATABASE_URL_KEY,
          }),
        ),
        REDIS_BULL_QUEUE_URL: Secret.fromSsmParameter(
          loadSsmParam(this, `${prefix}REDIS_BULL_QUEUE_URL`, {
            parameterName: constants.PROD.REDIS_BULL_QUEUE_URL,
          }),
        ),
      },
      environment: { NODE_ENV: 'production' },
      logging: new AwsLogDriver({
        logGroup: new LogGroup(this, `${prefix}LogGroup`, {
          logGroupName: constants.PROD.ECS_VIRTUAL_ACCOUNT_BATCH_LOG_GROUP_NAME,
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
        subnetGroupName: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
      },
      securityGroups: [secGrp],
      scheduledFargateTaskDefinitionOptions: { taskDefinition },
      schedule: Schedule.cron({ hour: '1', minute: '0' }), // 매일 1시 0 분
      platformVersion: FargatePlatformVersion.LATEST,
    });

    return task;
  }
}
