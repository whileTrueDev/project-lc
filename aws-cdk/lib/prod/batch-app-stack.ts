import { Schedule } from '@aws-cdk/aws-applicationautoscaling';
import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import { Repository, TagStatus } from '@aws-cdk/aws-ecr';
import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  FargatePlatformVersion,
  FargateTaskDefinition,
} from '@aws-cdk/aws-ecs';
import { ScheduledFargateTask } from '@aws-cdk/aws-ecs-patterns';
import { LogGroup } from '@aws-cdk/aws-logs';
import { Construct, Duration, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { constants } from '../../constants';

interface LCBatchAppStackProps extends StackProps {
  vpc: Vpc;
  cluster: Cluster;
}
export class LCBatchAppStack extends Stack {
  private readonly ID_PREFIX = `${constants.PROD.ID_PREFIX}PRIVATE-`;

  constructor(scope: Construct, id: string, props: LCBatchAppStackProps) {
    super(scope, id, props);
    const { vpc, cluster } = props;

    // * Fargate scheduled services
    this.createInactiveBatchService(vpc, cluster);
  }

  /** 매 일 1시 0분마다 실행되는 휴면처리 배치프로그램 Service를 생성합니다. */
  private createInactiveBatchService(
    vpc: Vpc,
    cluster: Cluster,
    secGrp?: SecurityGroup,
  ): ScheduledFargateTask {
    const servicePrefix = 'InactiveBatch';
    const prefix = `${this.ID_PREFIX}${servicePrefix}`;

    const repo = new Repository(this, `${prefix}Repo`, {
      repositoryName: constants.PROD.ECS_INACTIVE_BATCH_FAMILY_NAME,
      lifecycleRules: [
        { maxImageCount: 1, tagStatus: TagStatus.ANY },
        {
          maxImageAge: Duration.days(1),
          tagStatus: TagStatus.UNTAGGED,
        },
      ],
    });

    const taskDefinition = new FargateTaskDefinition(this, `${prefix}EcsTaskDef`, {
      family: constants.PROD.ECS_INACTIVE_BATCH_FAMILY_NAME,
    });

    taskDefinition.addContainer(`${prefix}EcsContainer`, {
      containerName: constants.PROD.ECS_INACTIVE_BATCH_FAMILY_NAME,
      image: ContainerImage.fromEcrRepository(repo),
      environment: {
        NODE_ENV: 'test',
        S3_BUCKET_NAME: 'lc-project',
        MAILER_HOST: `https://mailer.${constants.PROD.PRIVATE_DOMAIN}`,
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
      securityGroups: secGrp ? [secGrp] : undefined,
      scheduledFargateTaskDefinitionOptions: {
        taskDefinition,
      },
      // 매일 1시 0 분
      schedule: Schedule.cron({ hour: '1', minute: '0' }),
      platformVersion: FargatePlatformVersion.LATEST,
    });

    return task;
  }
}
