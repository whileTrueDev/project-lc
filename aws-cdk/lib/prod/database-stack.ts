import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';

interface LCProdDatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  backendSecGrp: ec2.SecurityGroup;
}

export class LCProdDatabaseStack extends cdk.Stack {
  public readonly db: rds.DatabaseInstance;

  constructor(scope: cdk.Construct, id: string, props: LCProdDatabaseStackProps) {
    super(scope, id, props);

    const { vpc, backendSecGrp } = props;

    // * 보안그룹
    // db 보안그룹
    const dbSecGrp = new ec2.SecurityGroup(this, 'dbSecGrp', {
      vpc,
      description: 'database sec grp',
      allowAllOutbound: false,
    });
    // * 보안그룹 룰 지정
    dbSecGrp.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      'Allow port 3306 for outbound traffics to the backend server',
    );
    dbSecGrp.addIngressRule(
      ec2.Peer.ipv4('59.22.64.86'),
      ec2.Port.tcp(3306),
      'Allow port 3306 for outbound traffics to the whiletrue developers',
    );
    dbSecGrp.addIngressRule(
      backendSecGrp,
      ec2.Port.tcp(3306),
      'Allow port 3306 for inbound traffics from the backend server',
    );

    // * DB 엔진
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_25,
    });

    // * RDS 데이터베이스 인스턴스
    this.db = new rds.DatabaseInstance(this, 'DB', {
      databaseName: 'project-lc-prod-db', // rename 필요
      vpc,
      engine: dbEngine,
      credentials: {
        username: 'admin',
      },
      allocatedStorage: 20,
      maxAllocatedStorage: 300,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      vpcSubnets: {
        subnetFilters: [ec2.SubnetFilter.onePerAz()],
      },
      multiAz: false,
      autoMinorVersionUpgrade: false,
      securityGroups: [dbSecGrp],
      parameterGroup: new rds.ParameterGroup(this, 'dbParameterGroup', {
        engine: dbEngine,
        parameters: {
          time_zone: 'Asia/Seoul',
          wait_timeout: '180',
          max_allowed_packet: '16777216',
        },
      }),
      deletionProtection: false,
      iamAuthentication: true,
      enablePerformanceInsights: true,
    });
  }
}
