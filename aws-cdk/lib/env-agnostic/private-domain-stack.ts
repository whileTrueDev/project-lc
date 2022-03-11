import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

import { constants } from '../../constants';

interface LCPrivateDomainStackProps extends cdk.StackProps {
  domainName: typeof constants.DEV.PRIVATE_DOMAIN | typeof constants.PROD.PRIVATE_DOMAIN;
  vpc: ec2.Vpc;
  privateAlb: elbv2.ApplicationLoadBalancer;
}
export class LCPrivateDomainStack extends cdk.Stack {
  private readonly domainName: string;
  private readonly vpc: ec2.Vpc;
  private readonly alb: elbv2.ApplicationLoadBalancer;
  private readonly privateHostedZone: route53.PrivateHostedZone;

  constructor(scope: cdk.Construct, id: string, props: LCPrivateDomainStackProps) {
    super(scope, id, props);
    const { domainName, vpc, privateAlb } = props;
    this.domainName = domainName;
    this.vpc = vpc;
    this.alb = privateAlb;

    this.privateHostedZone = this.createHostedZone();
    this.createRecords();
  }

  /**
   * 크크쇼 서버 간 DNS 쿼리를 위한 프라이빗 호스팅 영역을 생성합니다.
   * @param vpc 프라이빗 호스팅 영역이 위치할 VPC
   */
  private createHostedZone(): route53.PrivateHostedZone {
    return new route53.PrivateHostedZone(this, `${this.domainName}_PrivateHostedZone`, {
      vpc: this.vpc,
      zoneName: this.domainName,
    });
  }

  private createRecords(): void {
    const loadBalancerTarget = new route53Targets.LoadBalancerTarget(this.alb);

    new route53.ARecord(this, `${this.domainName}_ARecord_mailer`, {
      zone: this.privateHostedZone,
      recordName: `mailer.${this.domainName}`,
      target: route53.RecordTarget.fromAlias(loadBalancerTarget),
    });
  }
}
