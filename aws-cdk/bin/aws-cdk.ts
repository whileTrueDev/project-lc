#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LCProdAppStack } from '../lib/prod/app-stack';
import { LCProdVpcStack } from '../lib/prod/vpc-stack';
import { LCProdDatabaseStack } from '../lib/prod/database-stack';

const app = new cdk.App();

if (process.env.NODE_ENV === 'production') {
  // VPC 스택 생성
  const vpcStack = new LCProdVpcStack(app, 'LC_VPC');

  // 애플리케이션 스택 생성
  const appStack = new LCProdAppStack(app, 'AwsCdkStack', {
    vpc: vpcStack.vpc,
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  });

  // DB 스택 생성
  const dbStack = new LCProdDatabaseStack(app, 'LC_RDS', {
    vpc: vpcStack.vpc,
    backendSecGrp: appStack.backendSecGrp,
  });
} else {
  //
}
