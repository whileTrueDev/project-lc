import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

// CONSTANTS
const ID_PREFIX = 'LC-DEV-';
// const DATABASE_PORT = 3306;

export class LCDevVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

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
  }
}
