import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';

interface LCDevDatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  dbSecGrp: ec2.SecurityGroup;
}

export class LCDevDatabaseStack extends cdk.Stack {
  public readonly db: rds.DatabaseInstance;

  constructor(scope: cdk.Construct, id: string, props: LCDevDatabaseStackProps) {
    super(scope, id, props);

    const { vpc, dbSecGrp } = props;

    // * DB 엔진
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_25,
    });

    // * RDS 데이터베이스 인스턴스
    this.db = new rds.DatabaseInstance(this, 'LC-DEV-DB', {
      vpc,
      engine: dbEngine,
      databaseName: 'lcDev',
      credentials: {
        username: 'admin',
      },
      allocatedStorage: 20,
      maxAllocatedStorage: 30,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      multiAz: false,
      autoMinorVersionUpgrade: false,
      publiclyAccessible: true,
      securityGroups: [dbSecGrp],
      parameterGroup: new rds.ParameterGroup(this, 'LC-DEV-DB-ParameterGroup', {
        engine: dbEngine,
        parameters: {
          time_zone: 'Asia/Seoul',
          wait_timeout: '180',
          max_allowed_packet: '16777216',
          innodb_ft_min_token_size: '1', // for full-text search
          ngram_token_size: '1', // for full-text search
        },
      }),
      deletionProtection: false,
      iamAuthentication: true,
      enablePerformanceInsights: false,
      cloudwatchLogsExports: ['error', 'slowquery', 'general'],
    });
  }
}
