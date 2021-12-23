import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as cdk from '@aws-cdk/core';
import { constants } from '../../constants';

interface LCDomainStackProps extends cdk.StackProps {
  prodALB: elbv2.ApplicationLoadBalancer;
  devALB?: elbv2.ApplicationLoadBalancer;
}

export class LCDomainStack extends cdk.Stack {
  private readonly DOMAIN = constants.DOMAIN;
  private readonly PUNYCODE_DOMAIN = constants.PUNYCODE_DOMAIN;

  private readonly prodALBTarget: route53Targets.LoadBalancerTarget;
  private readonly devALBTarget: route53Targets.LoadBalancerTarget;

  public hostedzone: route53.PublicHostedZone;

  constructor(scope: cdk.Construct, id: string, props: LCDomainStackProps) {
    super(scope, id, props);

    const { prodALB, devALB } = props;
    if (!devALB) {
      throw new Error('dev ALB is not defined - from LCDomainStack');
    }

    // 호스팅영역 생성
    this.createPublicHostedZone();

    this.prodALBTarget = new route53Targets.LoadBalancerTarget(prodALB);
    this.devALBTarget = new route53Targets.LoadBalancerTarget(devALB);

    this.createProdRecords();
    this.createDevRecords();
  }

  private createPublicHostedZone(): route53.PublicHostedZone {
    this.hostedzone = new route53.PublicHostedZone(
      this,
      `${this.PUNYCODE_DOMAIN}_PublicHostedZone`,
      {
        zoneName: this.PUNYCODE_DOMAIN,
        comment: `kkshow hosted zone`,
      },
    );
    return this.hostedzone;
  }

  private createProdRecords(): void {
    // 프로덕션용 ALB로 라우팅하는 기본 크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord`, {
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.prodALBTarget),
    });
    // 프로덕션용 ALB로 라우팅하는 api.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_api`, {
      recordName: `api.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.prodALBTarget),
    });
    // 프로덕션용 ALB로 라우팅하는 live.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_live`, {
      recordName: `live.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.prodALBTarget),
    });
    // 프로덕션용 ALB로 라우팅하는 라이브.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_live_puny`, {
      recordName: `${constants.PUNYCODE_라이브}.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.prodALBTarget),
    });
    // 프로덕션용 ALB로 라우팅하는 overlay-controller.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_overlay_controller`, {
      recordName: `overlay-controller.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.prodALBTarget),
    });
  }

  private createDevRecords(): void {
    // Dev환경용 ALB로 라우팅하는 기본 dev-api.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_devapi`, {
      recordName: `dev-api.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.devALBTarget),
    });
    // Dev환경용 ALB로 라우팅하는 기본 dev-live.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_devlive`, {
      recordName: `dev-live.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.devALBTarget),
    });
    // Dev환경용 ALB로 라우팅하는 기본 dev-live.크크쇼.com 레코드 생성
    new route53.ARecord(this, `${this.PUNYCODE_DOMAIN}_ARecord_devoverlay_controller`, {
      recordName: `dev-overlay-controller.${this.PUNYCODE_DOMAIN}`,
      zone: this.hostedzone,
      target: route53.RecordTarget.fromAlias(this.devALBTarget),
    });
  }
}
