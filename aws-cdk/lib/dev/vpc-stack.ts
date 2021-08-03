import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

// CONSTANTS
const ID_PREFIX = 'LC-DEV-';
// const DATABASE_PORT = 3306;

export class LCDevVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public dbSecGrp: ec2.SecurityGroup;
  public apiSecGrp: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    // * vpc
    this.vpc = new ec2.Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: '10.0.0.0/24',
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'Ingress Subnet',
        },
        {
          subnetType: ec2.SubnetType.ISOLATED,
          name: 'Isolated Subnet for DB',
        },
      ],
    });

    const apiSecGrp = this.createApiSecGrp();
    this.createDbSecGrp(apiSecGrp);
  }

  private createDbSecGrp(apiSecGrp: ec2.SecurityGroup) {
    // * 보안그룹
    // db 보안그룹
    this.dbSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DB-SecGrp`, {
      vpc: this.vpc,
      description: 'database security grp for project-lc',
      allowAllOutbound: false,
    });
    // * 보안그룹 룰 지정
    this.dbSecGrp.addIngressRule(
      ec2.Peer.ipv4('59.22.64.86/32'),
      ec2.Port.tcp(3306),
      'Allow port 3306 for outbound traffics to the whiletrue developers',
    );
    this.dbSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      // apiSecGrp ?? this.apiSecGrp,
      ec2.Port.tcp(3306),
      'Allow port 3306 only to traffic from api security group',
    );

    return this.dbSecGrp;
  }

  private createApiSecGrp() {
    this.apiSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}API-SecGrp`, {
      vpc: this.vpc,
      description: 'api security grp for project-lc',
      allowAllOutbound: true,
    });

    this.apiSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      'allow port 3000 to anywhere',
    );

    return this.apiSecGrp;
  }
}
