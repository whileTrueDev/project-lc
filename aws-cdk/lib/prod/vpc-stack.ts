import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc, SecurityGroup, SubnetType, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { constants } from '../../constants';

// CONSTANTS
const ID_PREFIX = 'LC-PROD-';
const DATABASE_PORT = 3306;

export class LCProdVpcStack extends Stack {
  public readonly vpc: Vpc;
  public readonly albSecGrp: SecurityGroup;
  public readonly dbSecGrp: SecurityGroup;
  public readonly apiSecGrp: SecurityGroup;
  public readonly overlaySecGrp: SecurityGroup;
  public readonly overlayControllerSecGrp: SecurityGroup;
  public readonly realtimeApiSecGrp: SecurityGroup;
  public readonly redisSecGrp: SecurityGroup;
  public readonly mailerSecGrp: SecurityGroup;
  public readonly inactiveBatchSecGrp: SecurityGroup;
  public readonly virtualAccountBatchSecGrp: SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
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
    this.virtualAccountBatchSecGrp = this.createVirtualAccountBatchSecGrp();
    this.dbSecGrp = this.createDbSecGrp({
      apiSecGrp: this.apiSecGrp,
      overlaySecGrp: this.overlaySecGrp,
      overlayControllerSecGrp: this.overlayControllerSecGrp,
      inactiveBatchSecGrp: this.inactiveBatchSecGrp,
      virtualAccountBatchSecGrp: this.virtualAccountBatchSecGrp,
    });
  }

  private createVpc(): Vpc {
    return new Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 4,
      subnetConfiguration: [
        {
          subnetType: SubnetType.PUBLIC,
          name: constants.PROD.INGRESS_SUBNET_GROUP_NAME,
        },
        {
          subnetType: SubnetType.PRIVATE_WITH_NAT,
          name: constants.PROD.PRIVATE_SUBNET_GROUP_NAME,
        },
        {
          subnetType: SubnetType.PRIVATE_ISOLATED,
          name: constants.PROD.ISOLATED_SUBNET_GROUP_NAME,
        },
      ],
    });
  }

  /** 퍼블릭 로드밸런서 보안그룹 생성 */
  private createAlbSecGrp(): SecurityGroup {
    const albSecGrp = new SecurityGroup(this, `${ID_PREFIX}ALB-SecGrp`, {
      vpc: this.vpc,
      description: 'ALB security group for project-lc',
      allowAllOutbound: true,
    });
    albSecGrp.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow 80 to all');
    albSecGrp.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow 443 to all');

    return albSecGrp;
  }

  /** API서버 보안그룹 생성 */
  private createApiSecGrp(): SecurityGroup {
    const apiSecGrp = new SecurityGroup(this, `${ID_PREFIX}API-SecGrp`, {
      vpc: this.vpc,
      description: 'api security grp for project-lc',
      allowAllOutbound: true,
    });
    this.allowAlbToServer(apiSecGrp, constants.PROD.ECS_API_PORT);
    this.allowRedisToServer(apiSecGrp, constants.PROD.ECS_API_PORT);
    return apiSecGrp;
  }

  /** Overlay서버 보안그룹 생성 */
  private createOverlaySecGrp(): SecurityGroup {
    const overlaySecGrp = new SecurityGroup(this, `${ID_PREFIX}Overlay-SecGrp`, {
      vpc: this.vpc,
      description: 'overlay security grp for project-lc',
      allowAllOutbound: true,
    });

    this.allowAlbToServer(overlaySecGrp, constants.PROD.ECS_OVERLAY_PORT);
    this.allowRedisToServer(overlaySecGrp, constants.PROD.ECS_OVERLAY_PORT);
    return overlaySecGrp;
  }

  /** 오버레이 컨트롤러 서버 보안 그룹 생성 */
  private createOverlayControllerSecGrp(): SecurityGroup {
    const overlayControllerSecGrp = new SecurityGroup(
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
    virtualAccountBatchSecGrp,
  }: Record<
    | 'apiSecGrp'
    | 'overlaySecGrp'
    | 'overlayControllerSecGrp'
    | 'inactiveBatchSecGrp'
    | 'virtualAccountBatchSecGrp',
    SecurityGroup
  >): SecurityGroup {
    // * 보안그룹
    // db 보안그룹
    const dbSecGrp = new SecurityGroup(this, `${ID_PREFIX}DB-SecGrp`, {
      vpc: this.vpc,
      description: 'database security grp for project-lc',
      allowAllOutbound: false,
    });
    // * 보안그룹 룰 지정
    dbSecGrp.addIngressRule(
      Peer.ipv4(constants.WHILETRUE_IP_ADDRESS),
      Port.tcp(DATABASE_PORT),
      `Allow port ${DATABASE_PORT} for outbound traffics to the whiletrue developers`,
    );
    dbSecGrp.addIngressRule(
      apiSecGrp ?? this.apiSecGrp,
      Port.tcp(DATABASE_PORT),
      `Allow port ${DATABASE_PORT} only to traffic from api security group`,
    );
    dbSecGrp.addIngressRule(
      overlaySecGrp ?? this.overlaySecGrp,
      Port.tcp(DATABASE_PORT),
      `Allow port ${DATABASE_PORT} only to traffic from overlay security group`,
    );
    dbSecGrp.addIngressRule(
      overlayControllerSecGrp ?? this.overlayControllerSecGrp,
      Port.tcp(DATABASE_PORT),
      `Allow port ${DATABASE_PORT} only to traffic from overlay controller security group`,
    );

    const githubActionsRunnerSecGrp = new SecurityGroup(
      this,
      `${ID_PREFIX}BuilderSecGrp`,
      {
        vpc: this.vpc,
        description: 'github actions builder security group',
        allowAllOutbound: true,
      },
    );
    githubActionsRunnerSecGrp.addIngressRule(
      Peer.ipv4(constants.WHILETRUE_IP_ADDRESS),
      Port.tcp(22),
      'SSH for Admin Desktop',
    );

    dbSecGrp.addIngressRule(
      githubActionsRunnerSecGrp,
      Port.tcp(DATABASE_PORT),
      'Allow github actions builder',
    );

    dbSecGrp.addIngressRule(
      inactiveBatchSecGrp || this.inactiveBatchSecGrp,
      Port.tcp(DATABASE_PORT),
      'Allow inactive batch',
    );

    dbSecGrp.addIngressRule(
      virtualAccountBatchSecGrp || this.virtualAccountBatchSecGrp,
      Port.tcp(DATABASE_PORT),
      'Allow virtual-account batch',
    );
    return dbSecGrp;
  }

  /** realtime API 서버 보안그룹 생성 */
  private createRealtimeApiSecGrp(): SecurityGroup {
    const realtimeApiSecGrp = new SecurityGroup(this, `${ID_PREFIX}RealtimeApi-SecGrp`, {
      vpc: this.vpc,
      description: 'Realtime api server security grp for project-lc',
      allowAllOutbound: true,
    });

    this.allowAlbToServer(realtimeApiSecGrp, constants.PROD.ECS_REALTIME_API_PORT);
    this.allowRedisToServer(realtimeApiSecGrp, constants.PROD.ECS_REALTIME_API_PORT);

    return realtimeApiSecGrp;
  }

  /** Redis 서버 (ElstiCache) 보안그룹 생성 */
  private createRedisSecGrp(): SecurityGroup {
    const redisPort = 6379;
    const redisSecGrp = new SecurityGroup(this, `${ID_PREFIX}Redis-SecGrp`, {
      vpc: this.vpc,
      description: 'Redis security grp for project-lc',
      allowAllOutbound: true,
    });

    redisSecGrp.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(redisPort),
      `allow port ${redisPort} to anyIpv4`,
    );

    return redisSecGrp;
  }

  /** Mailer 서버 보안그룹 생성 */
  private createMailerSecGrp(): SecurityGroup {
    const mailerSecGrp = new SecurityGroup(this, `${ID_PREFIX}Mailer-SecGrp`, {
      vpc: this.vpc,
      description: 'mailer sec grp for project-lc (private)',
      allowAllOutbound: true,
    });
    this.allowRedisToServer(mailerSecGrp, constants.PROD.ECS_MAILER_PORT);
    return mailerSecGrp;
  }

  /** 휴면처리 배치 프로그램 보안그룹 생성 */
  private createInactiveBatchSecGrp(): SecurityGroup {
    const inactiveBatchSecGrp = new SecurityGroup(
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

  /** 휴면처리 배치 프로그램 보안그룹 생성 */
  private createVirtualAccountBatchSecGrp(): SecurityGroup {
    const inactiveBatchSecGrp = new SecurityGroup(
      this,
      `${ID_PREFIX}virtual-account-batch-SecGrp`,
      {
        vpc: this.vpc,
        description: 'virtual-account batch sec grp for project-lc (private)',
        allowAllOutbound: true,
      },
    );
    return inactiveBatchSecGrp;
  }

  // ******************************
  // * 보안 그룹 적용 헬퍼 함수
  // ******************************

  /** 서버보안그룹에 Redis로부터의 요청을 허용하는 메서드로, 레디스 보안그룹 생성 이후 사용해야 함. */
  private allowRedisToServer(secGrp: SecurityGroup, serverPort: number): void {
    if (!this.redisSecGrp)
      throw Error(
        '서버보안그룹에 Redis로부터의 요청을 허용하는 메서드로, 레디스 보안그룹 생성 이후 사용해야 함.',
      );
    secGrp.addIngressRule(
      this.redisSecGrp,
      Port.tcp(serverPort),
      `allow port ${serverPort} to redis cluster`,
    );
  }

  /** 서버보안그룹에 ALB로부터의 요청을 허용하는 메서드로, 로드밸런서 보안그룹 생성 이후 사용해야 함. */
  private allowAlbToServer(secGrp: SecurityGroup, serverPort: number): void {
    if (!this.albSecGrp)
      throw Error(
        '서버보안그룹에 ALB로부터의 요청을 허용하는 메서드로, 로드밸런서 보안그룹 생성 이후 사용해야 함.',
      );
    secGrp.addIngressRule(
      this.albSecGrp,
      Port.tcp(serverPort),
      `allow port ${serverPort} to ALB`,
    );
  }
}
