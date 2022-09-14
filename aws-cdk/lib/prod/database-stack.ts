import { Stack, StackProps } from 'aws-cdk-lib';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  MysqlEngineVersion,
  ParameterGroup,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { constants } from '../../constants';

interface LCProdDatabaseStackProps extends StackProps {
  vpc: Vpc;
  dbSecGrp: SecurityGroup;
}

export class LCProdDatabaseStack extends Stack {
  public readonly db: DatabaseInstance;

  constructor(scope: Construct, id: string, props: LCProdDatabaseStackProps) {
    super(scope, id, props);
    const { vpc, dbSecGrp } = props;

    // * DB 엔진
    const dbEngine = DatabaseInstanceEngine.mysql({
      version: MysqlEngineVersion.VER_8_0_25,
    });

    // * RDS 데이터베이스 인스턴스
    this.db = new DatabaseInstance(this, `${constants.PROD.ID_PREFIX}DB`, {
      databaseName: 'public', // 초기 데이터베이스 생성
      instanceIdentifier: 'kkshow-production',
      vpc,
      engine: dbEngine,
      credentials: { username: 'admin' },
      allocatedStorage: 20,
      maxAllocatedStorage: 500,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      multiAz: false,
      autoMinorVersionUpgrade: false,
      securityGroups: [dbSecGrp],
      parameterGroup: new ParameterGroup(this, 'dbParameterGroup', {
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
      cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
    });
  }
}
