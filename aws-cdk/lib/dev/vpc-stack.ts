/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { aws_ec2 as ec2, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { constants } from '../../constants';

// CONSTANTS
const ID_PREFIX = 'LC-DEV-';
const DATABASE_PORT = 3306;

export class LCDevVpcStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public albSecGrp: ec2.SecurityGroup;
  public dbSecGrp: ec2.SecurityGroup;
  public apiSecGrp: ec2.SecurityGroup;
  public realtimeApiSecGrp: ec2.SecurityGroup;
  public overlaySecGrp: ec2.SecurityGroup;
  public overlayControllerSecGrp: ec2.SecurityGroup;
  public redisSecGrp: ec2.SecurityGroup;
  public mailerSecGrp: ec2.SecurityGroup;
  public inactiveBatchSecGrp: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    // * vpc
    this.vpc = new ec2.Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 2,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: constants.DEV.INGRESS_SUBNET_GROUP_NAME,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          name: constants.DEV.PRIVATE_SUBNET_GROUP_NAME,
        },
      ],
    });

    this.createAlbSecGrp();
    this.createRedisSecGrp();
    const apiSecGrp = this.createApiSecGrp();
    const overlaySecGrp = this.createOverlaySecGrp();
    const overlayControllerSecGrp = this.createOverlayControllerSecGrp();
    const inactiveBatchSecGrp = this.createInactiveBatchSecGrp();
    this.createDbSecGrp({
      apiSecGrp,
      overlaySecGrp,
      overlayControllerSecGrp,
      inactiveBatchSecGrp,
    });
    this.createRealtimeApiSecGrp();
    this.createMailerSecGrp();
  }

  /** 퍼블릭 로드밸런서(ALB) 보안 그룹 생성 */
  private createAlbSecGrp() {
    this.albSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}ALB-SecGrp`, {
      vpc: this.vpc,
      description: 'ALB security group for project-lc',
      allowAllOutbound: true,
    });

    this.albSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow 80 to all',
    );
    this.albSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow 443 to all',
    );

    return this.albSecGrp;
  }

  /** 데이터베이스 보안 그룹 생성 */
  private createDbSecGrp({
    apiSecGrp,
    overlaySecGrp,
    overlayControllerSecGrp,
    inactiveBatchSecGrp,
  }: Record<
    'apiSecGrp' | 'overlaySecGrp' | 'overlayControllerSecGrp' | 'inactiveBatchSecGrp',
    ec2.SecurityGroup
  >) {
    // * 보안그룹
    // db 보안그룹
    this.dbSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DB-SecGrp`, {
      vpc: this.vpc,
      description: 'database security grp for project-lc',
      allowAllOutbound: false,
    });
    // * 보안그룹 룰 지정
    this.dbSecGrp.addIngressRule(
      ec2.Peer.ipv4(constants.WHILETRUE_IP_ADDRESS),
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 for outbound traffics to the whiletrue developers',
    );
    this.dbSecGrp.addIngressRule(
      apiSecGrp ?? this.apiSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 only to traffic from api security group',
    );
    this.dbSecGrp.addIngressRule(
      overlaySecGrp ?? this.overlaySecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 only to traffic from overlay security group',
    );
    this.dbSecGrp.addIngressRule(
      overlayControllerSecGrp ?? this.overlayControllerSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 only to traffic from overlay-controller security group',
    );
    this.dbSecGrp.addIngressRule(
      inactiveBatchSecGrp || this.inactiveBatchSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow inactive batch',
    );

    this.dbSecGrp.addIngressRule(
      new ec2.SecurityGroup(this, `${ID_PREFIX}BuilderSecGrp`, {
        vpc: this.vpc,
        description: 'github actions builder security group',
        allowAllOutbound: true,
      }),
      ec2.Port.tcp(DATABASE_PORT),
      'Allow github actions builder',
    );

    return this.dbSecGrp;
  }

  /** API 서버 보안 그룹 생성 */
  private createApiSecGrp() {
    this.apiSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}API-SecGrp`, {
      vpc: this.vpc,
      description: 'api security grp for project-lc',
      allowAllOutbound: true,
    });

    this.apiSecGrp.addIngressRule(
      this.albSecGrp,
      ec2.Port.tcp(constants.DEV.ECS_API_PORT),
      'allow port 3000 to anywhere',
    );

    this.allowRedisToServer(this.apiSecGrp, constants.DEV.ECS_API_PORT);

    return this.apiSecGrp;
  }

  /** 오버레이 서버 보안 그룹 생성 */
  private createOverlaySecGrp() {
    this.overlaySecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Overlay-SecGrp`, {
      vpc: this.vpc,
      description: 'overlay security grp for project-lc',
      allowAllOutbound: true,
    });

    this.overlaySecGrp.addIngressRule(
      this.albSecGrp,
      ec2.Port.tcp(constants.DEV.ECS_OVERLAY_PORT),
      'allow port 3002 to anywhere',
    );
    this.allowRedisToServer(this.overlaySecGrp, constants.DEV.ECS_OVERLAY_PORT);
    return this.overlaySecGrp;
  }

  /** 오버레이 컨트롤러 서버 보안 그룹 생성 */
  private createOverlayControllerSecGrp() {
    this.overlayControllerSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}OverlayController-SecGrp`,
      {
        vpc: this.vpc,
        description: 'overlay-controller security grp for project-lc',
        allowAllOutbound: true,
      },
    );

    this.overlayControllerSecGrp.addIngressRule(
      this.albSecGrp,
      ec2.Port.tcp(constants.DEV.ECS_OVERLAY_CONTROLLER_PORT),
      'allow port 3333 to alb',
    );
    this.allowRedisToServer(
      this.overlayControllerSecGrp,
      constants.DEV.ECS_OVERLAY_CONTROLLER_PORT,
    );

    return this.overlayControllerSecGrp;
  }

  /** 리얼타임 API 서버 보안그룹 생성 */
  private createRealtimeApiSecGrp() {
    this.realtimeApiSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}RealtimeApi-SecGrp`,
      {
        vpc: this.vpc,
        description: 'realtime api server security grp for project-lc',
        allowAllOutbound: true,
      },
    );

    this.realtimeApiSecGrp.addIngressRule(
      this.albSecGrp,
      ec2.Port.tcp(constants.DEV.ECS_REALTIME_API_PORT),
      'allow port 3001 to alb for kks realtime-api',
    );
    this.allowRedisToServer(this.realtimeApiSecGrp, constants.DEV.ECS_REALTIME_API_PORT);
  }

  /** 레디스 서버 보안그룹 생성 */
  private createRedisSecGrp() {
    this.redisSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Redis-SecGrp`, {
      vpc: this.vpc,
      description: 'redis security grp for project-lc',
      allowAllOutbound: false,
    });

    this.redisSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(6379),
      'allow port 6379 to anyIpv4',
    );
  }

  private allowRedisToServer(secGrp: ec2.SecurityGroup, serverPort: number) {
    secGrp.addIngressRule(
      this.redisSecGrp,
      ec2.Port.tcp(serverPort),
      `allow port ${serverPort} to redis cluster`,
    );
  }

  /** Mailer 서버 보안그룹 생성 */
  private createMailerSecGrp() {
    this.mailerSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Mailer-SecGrp`, {
      vpc: this.vpc,
      description: 'mailer sec grp for project-lc (private)',
      allowAllOutbound: true,
    });

    this.mailerSecGrp.addIngressRule(
      this.albSecGrp,
      ec2.Port.tcp(constants.DEV.ECS_MAILER_PORT),
      'Allow port 3003 to public alb',
    );
    this.allowRedisToServer(this.mailerSecGrp, constants.DEV.ECS_MAILER_PORT);
    return this.mailerSecGrp;
  }

  /** 휴면처리 배치 프로그램 보안그룹 생성 */
  private createInactiveBatchSecGrp() {
    this.inactiveBatchSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}Inactive-batch-SecGrp`,
      {
        vpc: this.vpc,
        description: 'inactive batch sec grp for project-lc (private)',
        allowAllOutbound: true,
      },
    );
    return this.inactiveBatchSecGrp;
  }
}
