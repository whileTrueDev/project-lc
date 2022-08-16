import * as logs from '@aws-cdk/aws-logs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import { constants } from '../../constants';

interface LCProdDatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  dbSecGrp: ec2.SecurityGroup;
}

export class LCProdDatabaseStack extends cdk.Stack {
  public readonly db: rds.DatabaseInstance;

  constructor(scope: cdk.Construct, id: string, props: LCProdDatabaseStackProps) {
    super(scope, id, props);
    const { vpc, dbSecGrp } = props;

    // * DB 엔진
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_25,
    });

    // * RDS 데이터베이스 인스턴스
    this.db = new rds.DatabaseInstance(this, `${constants.PROD.ID_PREFIX}DB`, {
      databaseName: 'public', // 초기 데이터베이스 생성
      instanceIdentifier: 'kkshow-production',
      vpc,
      engine: dbEngine,
      credentials: { username: 'admin' },
      allocatedStorage: 20,
      maxAllocatedStorage: 500,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      multiAz: false,
      autoMinorVersionUpgrade: false,
      securityGroups: [dbSecGrp],
      parameterGroup: new rds.ParameterGroup(this, 'dbParameterGroup', {
        engine: dbEngine,
        parameters: {
          time_zone: 'Asia/Seoul',
          wait_timeout: '180',
          max_allowed_packet: '16777216',
          innodb_ft_min_token_size: '1', // for full-text search
          ngram_token_size: '1', // for full-text search
        },
      }),
      publiclyAccessible: false,
      deletionProtection: false,
      iamAuthentication: true,
      // enablePerformanceInsights: true,
      cloudwatchLogsExports: ['error', 'slowquery', 'general', 'audit'],
      cloudwatchLogsRetention: logs.RetentionDays.SIX_MONTHS,
    });
  }
}
