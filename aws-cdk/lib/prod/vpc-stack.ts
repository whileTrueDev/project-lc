import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { constants } from '../../constants';

// CONSTANTS
const ID_PREFIX = 'LC-PROD-';
// const DATABASE_PORT = 3306;

export class LCProdVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly albSecGrp: ec2.SecurityGroup;
  public readonly dbSecGrp: ec2.SecurityGroup;
  public readonly apiSecGrp: ec2.SecurityGroup;
  public readonly overlaySecGrp: ec2.SecurityGroup;
  public readonly overlayControllerSecGrp: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    // * vpc
    this.vpc = this.createVpc();
    this.albSecGrp = this.createAlbSecGrp();
    this.apiSecGrp = this.createApiSecGrp(this.albSecGrp);
    this.overlaySecGrp = this.createOverlaySecGrp(this.albSecGrp);
    this.overlayControllerSecGrp = this.createOverlayControllerSecGrp(this.albSecGrp);
    this.dbSecGrp = this.createDbSecGrp({
      apiSecGrp: this.apiSecGrp,
      overlaySecGrp: this.overlaySecGrp,
      overlayControllerSecGrp: this.overlayControllerSecGrp,
    });
  }

  private createVpc(): ec2.Vpc {
    return new ec2.Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 4,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: constants.PROD.INGRESS_SUBNET_GROUP_NAME,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE,
          name: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
        },
        {
          subnetType: ec2.SubnetType.ISOLATED,
          name: constants.PROD.ISOLATED_SUBNET_GROUP_NAME,
        },
      ],
    });
  }

  /** 로드밸런서 보안그룹 생성 */
  private createAlbSecGrp(): ec2.SecurityGroup {
    const albSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}ALB-SecGrp`, {
      vpc: this.vpc,
      description: 'ALB security group for project-lc',
      allowAllOutbound: true,
    });
    albSecGrp.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow 80 to all');
    albSecGrp.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow 443 to all');

    return albSecGrp;
  }

  /** API서버 보안그룹 생성 */
  private createApiSecGrp(albSecGrp: ec2.SecurityGroup): ec2.SecurityGroup {
    const apiSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}API-SecGrp`, {
      vpc: this.vpc,
      description: 'api security grp for project-lc',
      allowAllOutbound: true,
    });
    apiSecGrp.addIngressRule(albSecGrp, ec2.Port.tcp(3000), 'allow port 3000');
    return apiSecGrp;
  }

  /** Overlay서버 보안그룹 생성 */
  private createOverlaySecGrp(albSecGrp: ec2.SecurityGroup): ec2.SecurityGroup {
    const overlaySecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Overlay-SecGrp`, {
      vpc: this.vpc,
      description: 'overlay security grp for project-lc',
      allowAllOutbound: true,
    });

    overlaySecGrp.addIngressRule(albSecGrp, ec2.Port.tcp(3002), 'allow port 3002');
    return overlaySecGrp;
  }

  /** 오버레이 컨트롤러 서버 보안 그룹 생성 */
  private createOverlayControllerSecGrp(albSecGrp: ec2.SecurityGroup): ec2.SecurityGroup {
    const overlayControllerSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}OverlayController-SecGrp`,
      {
        vpc: this.vpc,
        description: 'overlay-controller security grp for project-lc',
        allowAllOutbound: true,
      },
    );

    overlayControllerSecGrp.addIngressRule(
      albSecGrp,
      ec2.Port.tcp(3333),
      'allow port 3333 to alb',
    );
    return overlayControllerSecGrp;
  }

  /** 데이터베이스 서버 보안그룹 생성 */
  private createDbSecGrp({
    apiSecGrp,
    overlaySecGrp,
    overlayControllerSecGrp,
  }: Record<
    'apiSecGrp' | 'overlaySecGrp' | 'overlayControllerSecGrp',
    ec2.SecurityGroup
  >): ec2.SecurityGroup {
    // * 보안그룹
    // db 보안그룹
    const dbSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DB-SecGrp`, {
      vpc: this.vpc,
      description: 'database security grp for project-lc',
      allowAllOutbound: false,
    });
    // * 보안그룹 룰 지정
    dbSecGrp.addIngressRule(
      ec2.Peer.ipv4('121.175.189.231/32'),
      ec2.Port.tcp(3306),
      'Allow port 3306 for outbound traffics to the whiletrue developers',
    );
    dbSecGrp.addIngressRule(
      apiSecGrp ?? this.apiSecGrp,
      ec2.Port.tcp(3306),
      'Allow port 3306 only to traffic from api security group',
    );
    dbSecGrp.addIngressRule(
      overlaySecGrp ?? this.overlaySecGrp,
      ec2.Port.tcp(3306),
      'Allow port 3306 only to traffic from overlay security group',
    );
    dbSecGrp.addIngressRule(
      overlayControllerSecGrp ?? this.overlayControllerSecGrp,
      ec2.Port.tcp(3306),
      'Allow port 3306 only to traffic from overlay controller security group',
    );

    const githubActionsRunnerSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}BuilderSecGrp`,
      {
        vpc: this.vpc,
        description: 'github actions builder security group',
        allowAllOutbound: true,
      },
    );
    githubActionsRunnerSecGrp.addIngressRule(
      ec2.Peer.ipv4('121.175.189.231/32'),
      ec2.Port.tcp(22),
      'SSH for Admin Desktop',
    );

    dbSecGrp.addIngressRule(
      githubActionsRunnerSecGrp,
      ec2.Port.tcp(3306),
      'Allow github actions builder',
    );
    return dbSecGrp;
  }
}
