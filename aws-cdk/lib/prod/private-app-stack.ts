import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Repository, TagStatus } from 'aws-cdk-lib/aws-ecr';
import {
  AwsLogDriver,
  Cluster,
  ContainerImage,
  FargatePlatformVersion,
  FargateService,
  FargateTaskDefinition,
  Secret,
} from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { constants } from '../../constants';
import { loadSsmParam } from '../../util/loadSsmParam';

interface LCProdPrivateAppStackProps extends StackProps {
  mailerSecGrp: SecurityGroup;
  cluster: Cluster;
}
export class LCProdPrivateAppStack extends Stack {
  private readonly ID_PREFIX = `${constants.PROD.ID_PREFIX}PRIVATE-`;

  public privateAlb: ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: LCProdPrivateAppStackProps) {
    super(scope, id, props);
    const { cluster, mailerSecGrp } = props;

    // * Fargate services
    this.createMailerService(cluster, mailerSecGrp);
  }

  /** 메일러 Fargate 서비스를 생성합니다. */
  private createMailerService(cluster: Cluster, secGrp: SecurityGroup): FargateService {
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
    const MQ_REDIS_URL = loadSsmParam(this, `${prefix}MQ_REDIS_URL`, {
      parameterName: constants.PROD.MQ_REDIS_URL_KEY,
    });

    taskDef.addContainer(`${prefix}Container`, {
      image: ContainerImage.fromEcrRepository(repo),
      containerName: constants.PROD.ECS_MAILER_FAMILY_NAME,
      portMappings: [{ containerPort: constants.PROD.ECS_MAILER_PORT }],
      memoryLimitMiB: 512,
      secrets: {
        MAILER_USER: Secret.fromSsmParameter(MAILER_USER),
        MAILER_PASS: Secret.fromSsmParameter(MAILER_PASS),
        MQ_REDIS_URL: Secret.fromSsmParameter(MQ_REDIS_URL),
      },
      environment: {
        NODE_ENV: 'production',
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

    return service;
  }
}
