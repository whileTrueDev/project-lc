/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { constants } from '../../constants';

// CONSTANTS
const ID_PREFIX = 'LC-DEV-';
const DATABASE_PORT = 3306;

export class LCDevVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public albSecGrp: ec2.SecurityGroup;
  public privateAlbSecGrp: ec2.SecurityGroup;
  public dbSecGrp: ec2.SecurityGroup;
  public apiSecGrp: ec2.SecurityGroup;
  public realtimeApiSecGrp: ec2.SecurityGroup;
  public overlaySecGrp: ec2.SecurityGroup;
  public overlayControllerSecGrp: ec2.SecurityGroup;
  public redisSecGrp: ec2.SecurityGroup;
  public mailerSecGrp: ec2.SecurityGroup;
  public inactiveBatchSecGrp: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
    const apiSecGrp = this.createApiSecGrp();
    const overlaySecGrp = this.createOverlaySecGrp();
    const overlayControllerSecGrp = this.createOverlayControllerSecGrp();
    const inactiveBatchSecGrp = this.createInactiveBatchSecGrp();
    this.createPrivateAlbSecGrp();
    this.createDbSecGrp({
      apiSecGrp,
      overlaySecGrp,
      overlayControllerSecGrp,
      inactiveBatchSecGrp,
    });
    this.createRealtimeApiSecGrp();
    this.createRedisSecGrp();
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

  /** 프라이빗 로드밸런서(ALB) 보안 그룹 생성 */
  private createPrivateAlbSecGrp() {
    this.privateAlbSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}Private-ALB-SecGrp`,
      {
        vpc: this.vpc,
        description: 'private ALB security group for project-lc',
        allowAllOutbound: true,
      },
    );
    this.privateAlbSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow 80 to API',
    );
    this.privateAlbSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow443 to api',
    );
    return this.privateAlbSecGrp;
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
  }

  /** 레디스 서버 보안그룹 생성 */
  private createRedisSecGrp() {
    this.redisSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Redis-SecGrp`, {
      vpc: this.vpc,
      description: 'redis security grp for project-lc',
      allowAllOutbound: false,
    });

    type AllowServerOptions = {
      serverName: string;
      secGrp: ec2.SecurityGroup;
      serverPort: number;
      redisPort?: number;
    };
    const allowServer = ({
      serverName,
      secGrp,
      redisPort = 6379,
      serverPort,
    }: AllowServerOptions) => {
      // * API server
      this.redisSecGrp.addIngressRule(
        secGrp,
        ec2.Port.tcp(redisPort),
        `allow port ${redisPort} to ${serverName} server`,
      );
      this.redisSecGrp.addEgressRule(
        secGrp,
        ec2.Port.tcp(redisPort),
        `allow port ${redisPort} to ${serverName} server`,
      );
      secGrp.addIngressRule(
        this.redisSecGrp,
        ec2.Port.tcp(serverPort),
        `allow port ${serverPort} to redis cluster`,
      );
    };

    // * Allow API Server
    allowServer({
      serverName: 'api',
      secGrp: this.apiSecGrp,
      serverPort: constants.DEV.ECS_API_PORT,
    });
    // * Allow Realtime API Server
    allowServer({
      serverName: 'realtime-api',
      secGrp: this.realtimeApiSecGrp,
      serverPort: constants.DEV.ECS_REALTIME_API_PORT,
    });
    // * Allow Overlay Server
    allowServer({
      serverName: 'overlay',
      secGrp: this.overlaySecGrp,
      serverPort: constants.DEV.ECS_OVERLAY_PORT,
    });
    // * Allow Overlay-controller Server
    allowServer({
      serverName: 'overlay-controller',
      secGrp: this.overlayControllerSecGrp,
      serverPort: constants.DEV.ECS_OVERLAY_CONTROLLER_PORT,
    });
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
