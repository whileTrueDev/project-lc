import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

interface LCProdAppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class LCProdAppStack extends cdk.Stack {
  public readonly API_SERVER_PORT = 4000;
  public readonly backendSecGrp: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props: LCProdAppStackProps) {
    super(scope, id, props);

    const { vpc } = props;

    // * 보안그룹
    // 백엔드 보안그룹
    this.backendSecGrp = new ec2.SecurityGroup(this, 'backendSecGrp', {
      vpc,
      description: 'backend sec grp',
      allowAllOutbound: true,
    });
    this.backendSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(this.API_SERVER_PORT));

    // * ECS
    const EIP = new ec2.CfnEIP(this, 'eip');

    // Cloudwatch log group
  }
}
