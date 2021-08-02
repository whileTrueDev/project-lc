#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LCProdAppStack } from '../lib/prod/app-stack';
import { LCProdVpcStack } from '../lib/prod/vpc-stack';
import { LCProdDatabaseStack } from '../lib/prod/database-stack';
import { LCDevVpcStack } from '../lib/dev/vpc-stack';
import { LCDevDatabaseStack } from '../lib/dev/database-stack';

const app = new cdk.App();

if (process.env.NODE_ENV === 'production') {
  // VPC 스택 생성
  const vpcStack = new LCProdVpcStack(app, 'LC_VPC');

  // 애플리케이션 스택 생성
  const appStack = new LCProdAppStack(app, 'AwsCdkStack', {
    vpc: vpcStack.vpc,
  });

  // DB 스택 생성
  const dbStack = new LCProdDatabaseStack(app, 'LC_RDS', {
    vpc: vpcStack.vpc,
    backendSecGrp: appStack.backendSecGrp,
  });
} else {
  // * Dev / Test 환경

  // VPC 생성
  const vpcStack = new LCDevVpcStack(app, 'LC-DEV-VPC');
  // 데이터베이스 스택 생성
  new LCDevDatabaseStack(app, 'LC-DEV-RDS', { vpc: vpcStack.vpc });
}
