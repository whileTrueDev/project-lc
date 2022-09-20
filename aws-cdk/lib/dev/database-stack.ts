import { Construct } from 'constructs';
import { Stack, StackProps, aws_ec2 as ec2, aws_rds as rds } from 'aws-cdk-lib';

interface LCDevDatabaseStackProps extends StackProps {
  vpc: ec2.Vpc;
  dbSecGrp: ec2.SecurityGroup;
}

export class LCDevDatabaseStack extends Stack {
  public readonly db: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: LCDevDatabaseStackProps) {
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
