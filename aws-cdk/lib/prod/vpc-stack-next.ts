import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { constants } from '../../constants';

// CONSTANTS
const ID_PREFIX = 'LC-PROD-';
const DATABASE_PORT = 3306;

export class LCProdVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly albSecGrp: ec2.SecurityGroup;
  public readonly dbSecGrp: ec2.SecurityGroup;
  public readonly apiSecGrp: ec2.SecurityGroup;
  public readonly overlaySecGrp: ec2.SecurityGroup;
  public readonly overlayControllerSecGrp: ec2.SecurityGroup;
  public readonly realtimeApiSecGrp: ec2.SecurityGroup;
  public readonly redisSecGrp: ec2.SecurityGroup;
  public readonly mailerSecGrp: ec2.SecurityGroup;
  public readonly inactiveBatchSecGrp: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    // * vpc
    this.vpc = this.createVpc();
    this.albSecGrp = this.createAlbSecGrp();
    this.redisSecGrp = this.createRedisSecGrp();

    this.apiSecGrp = this.createApiSecGrp();
    this.overlaySecGrp = this.createOverlaySecGrp();
    this.overlayControllerSecGrp = this.createOverlayControllerSecGrp();
    this.realtimeApiSecGrp = this.createRealtimeApiSecGrp();
    this.mailerSecGrp = this.createMailerSecGrp();
    this.inactiveBatchSecGrp = this.createInactiveBatchSecGrp();
    this.dbSecGrp = this.createDbSecGrp({
      apiSecGrp: this.apiSecGrp,
      overlaySecGrp: this.overlaySecGrp,
      overlayControllerSecGrp: this.overlayControllerSecGrp,
      inactiveBatchSecGrp: this.inactiveBatchSecGrp,
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
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          name: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          name: constants.PROD.ISOLATED_SUBNET_GROUP_NAME,
        },
      ],
    });
  }

  /** 퍼블릭 로드밸런서 보안그룹 생성 */
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

  /** 서버보안그룹에 ALB로부터의 요청을 허용하는 메서드로, 로드밸런서 보안그룹 생성 이후 사용해야 함. */
  private allowAlbToServer(secGrp: ec2.SecurityGroup, serverPort: number): void {
    if (!this.albSecGrp)
      throw Error(
        '서버보안그룹에 ALB로부터의 요청을 허용하는 메서드로, 로드밸런서 보안그룹 생성 이후 사용해야 함.',
      );
    secGrp.addIngressRule(
      this.albSecGrp,
      ec2.Port.tcp(serverPort),
      `allow port ${serverPort} to ALB`,
    );
  }

  /** API서버 보안그룹 생성 */
  private createApiSecGrp(): ec2.SecurityGroup {
    const apiSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}API-SecGrp`, {
      vpc: this.vpc,
      description: 'api security grp for project-lc',
      allowAllOutbound: true,
    });
    this.allowAlbToServer(apiSecGrp, constants.PROD.ECS_API_PORT);
    this.allowRedisToServer(apiSecGrp, constants.PROD.ECS_API_PORT);
    return apiSecGrp;
  }

  /** Overlay서버 보안그룹 생성 */
  private createOverlaySecGrp(): ec2.SecurityGroup {
    const overlaySecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Overlay-SecGrp`, {
      vpc: this.vpc,
      description: 'overlay security grp for project-lc',
      allowAllOutbound: true,
    });

    this.allowAlbToServer(overlaySecGrp, constants.PROD.ECS_OVERLAY_PORT);
    this.allowRedisToServer(overlaySecGrp, constants.PROD.ECS_OVERLAY_PORT);
    return overlaySecGrp;
  }

  /** 오버레이 컨트롤러 서버 보안 그룹 생성 */
  private createOverlayControllerSecGrp(): ec2.SecurityGroup {
    const overlayControllerSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}OverlayController-SecGrp`,
      {
        vpc: this.vpc,
        description: 'overlay-controller security grp for project-lc',
        allowAllOutbound: true,
      },
    );

    this.allowAlbToServer(
      overlayControllerSecGrp,
      constants.PROD.ECS_OVERLAY_CONTROLLER_PORT,
    );
    this.allowRedisToServer(
      overlayControllerSecGrp,
      constants.PROD.ECS_OVERLAY_CONTROLLER_PORT,
    );
    return overlayControllerSecGrp;
  }

  /** 데이터베이스 서버 보안그룹 생성 */
  private createDbSecGrp({
    apiSecGrp,
    overlaySecGrp,
    overlayControllerSecGrp,
    inactiveBatchSecGrp,
  }: Record<
    'apiSecGrp' | 'overlaySecGrp' | 'overlayControllerSecGrp' | 'inactiveBatchSecGrp',
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
      ec2.Peer.ipv4(constants.WHILETRUE_IP_ADDRESS),
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 for outbound traffics to the whiletrue developers',
    );
    dbSecGrp.addIngressRule(
      apiSecGrp ?? this.apiSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 only to traffic from api security group',
    );
    dbSecGrp.addIngressRule(
      overlaySecGrp ?? this.overlaySecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow port 3306 only to traffic from overlay security group',
    );
    dbSecGrp.addIngressRule(
      overlayControllerSecGrp ?? this.overlayControllerSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
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
      ec2.Peer.ipv4(constants.WHILETRUE_IP_ADDRESS),
      ec2.Port.tcp(22),
      'SSH for Admin Desktop',
    );

    dbSecGrp.addIngressRule(
      githubActionsRunnerSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow github actions builder',
    );

    dbSecGrp.addIngressRule(
      inactiveBatchSecGrp || this.inactiveBatchSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      'Allow inactive batch',
    );
    return dbSecGrp;
  }

  /** realtime API 서버 보안그룹 생성 */
  private createRealtimeApiSecGrp(): ec2.SecurityGroup {
    const realtimeApiSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}RealtimeApi-SecGrp`,
      {
        vpc: this.vpc,
        description: 'Realtime api server security grp for project-lc',
        allowAllOutbound: true,
      },
    );

    this.allowAlbToServer(realtimeApiSecGrp, constants.PROD.ECS_REALTIME_API_PORT);
    this.allowRedisToServer(realtimeApiSecGrp, constants.PROD.ECS_REALTIME_API_PORT);

    return realtimeApiSecGrp;
  }

  /** Redis 서버 (ElstiCache) 보안그룹 생성 */
  private createRedisSecGrp(): ec2.SecurityGroup {
    const redisPort = 6379;
    const redisSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Redis-SecGrp`, {
      vpc: this.vpc,
      description: 'Redis security grp for project-lc',
      allowAllOutbound: true,
    });

    redisSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(redisPort),
      'allow port 6379 to anyIpv4',
    );

    return redisSecGrp;
  }

  /** 서버보안그룹에 Redis로부터의 요청을 허용하는 메서드로, 레디스 보안그룹 생성 이후 사용해야 함. */
  private allowRedisToServer(secGrp: ec2.SecurityGroup, serverPort: number): void {
    if (!this.redisSecGrp)
      throw Error(
        '서버보안그룹에 Redis로부터의 요청을 허용하는 메서드로, 레디스 보안그룹 생성 이후 사용해야 함.',
      );
    secGrp.addIngressRule(
      this.redisSecGrp,
      ec2.Port.tcp(serverPort),
      `allow port ${serverPort} to redis cluster`,
    );
  }

  /** Mailer 서버 보안그룹 생성 */
  private createMailerSecGrp(): ec2.SecurityGroup {
    const mailerSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}Mailer-SecGrp`, {
      vpc: this.vpc,
      description: 'mailer sec grp for project-lc (private)',
      allowAllOutbound: true,
    });
    this.allowRedisToServer(mailerSecGrp, constants.PROD.ECS_MAILER_PORT);
    return mailerSecGrp;
  }

  /** 휴면처리 배치 프로그램 보안그룹 생성 */
  private createInactiveBatchSecGrp(): ec2.SecurityGroup {
    const inactiveBatchSecGrp = new ec2.SecurityGroup(
      this,
      `${ID_PREFIX}Inactive-batch-SecGrp`,
      {
        vpc: this.vpc,
        description: 'inactive batch sec grp for project-lc (private)',
        allowAllOutbound: true,
      },
    );
    return inactiveBatchSecGrp;
  }
}
