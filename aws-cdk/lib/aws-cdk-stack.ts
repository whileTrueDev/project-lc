import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    // * 보안그룹
    // 백엔드 보안그룹
    const backendSecGrp = new ec2.SecurityGroup(this, 'backendSecGrp', {
      vpc,
      description: 'backend sec grp',
      allowAllOutbound: false,
    });

    // db 보안그룹
    const dbSecGrp = new ec2.SecurityGroup(this, 'dbSecGrp', {
      vpc,
      description: 'database sec grp',
      allowAllOutbound: false,
    });
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

    // * ******************************
    // * 데이터베이스
    // * ******************************

    // db 엔진
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_25,
    });

    // db
    const db = new rds.DatabaseInstance(this, 'DB', {
      databaseName: 'project-lc-dev-db',
      vpc,
      engine: dbEngine,
      credentials: {
        username: 'admin',
      },
      allocatedStorage: 20,
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
          max_allowed_packet: '16777216', // 16 GB (if memory capacity is lower than this, rds will use the entire memory)
        },
      }),
      deletionProtection: false,
    });
  }
}
