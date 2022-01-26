#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import { LCDevAppStack } from '../lib/dev/app-stack';
import { LCDevDatabaseStack } from '../lib/dev/database-stack';
import { LCDevRedisStack } from '../lib/dev/redis-stack';
import { LCDevVpcStack } from '../lib/dev/vpc-stack';
import { LCDomainStack } from '../lib/env-agnostic/domain-stack';
import { LCProdAppStack } from '../lib/prod/app-stack';
import { LCProdDatabaseStack } from '../lib/prod/database-stack';
import { LCRedisStack } from '../lib/prod/redis-stack';
import { LCProdVpcStack } from '../lib/prod/vpc-stack';
import { envCheck } from '../util/env-check';

dotenv.config();
envCheck();

const app = new cdk.App();

// ************************************
// * Dev / Test 환경
// VPC 생성
const devVpcStack = new LCDevVpcStack(app, 'LC-DEV-VPC');
// 데이터베이스 스택 생성
new LCDevDatabaseStack(app, 'LC-DEV-RDS', {
  vpc: devVpcStack.vpc,
  dbSecGrp: devVpcStack.dbSecGrp,
});
// API,Overlay 등 App
const devAppStack = new LCDevAppStack(app, 'LC-DEV-APP', {
  vpc: devVpcStack.vpc,
  apiSecGrp: devVpcStack.apiSecGrp,
  overlaySecGrp: devVpcStack.overlaySecGrp,
  overlayControllerSecGrp: devVpcStack.overlayControllerSecGrp,
  albSecGrp: devVpcStack.albSecGrp,
  realtimeApiSecGrp: devVpcStack.realtimeApiSecGrp,
});
// 레디스 캐시 스택
new LCDevRedisStack(app, 'LC-DEV-REDIS', {
  vpc: devVpcStack.vpc,
  redisSecGrp: devVpcStack.redisSecGrp,
});

// ************************************
// * Production 환경
// VPC
const prodVpcStack = new LCProdVpcStack(app, 'LC-PROD-VPC');

// 데이터베이스
new LCProdDatabaseStack(app, 'LC-PROD-RDS', {
  vpc: prodVpcStack.vpc,
  dbSecGrp: prodVpcStack.dbSecGrp,
});

// API,Overlay 등 App
const prodAppStack = new LCProdAppStack(app, 'LC-PROD-APP', {
  vpc: prodVpcStack.vpc,
  albSecGrp: prodVpcStack.albSecGrp,
  apiSecGrp: prodVpcStack.apiSecGrp,
  overlaySecGrp: prodVpcStack.overlaySecGrp,
  overlayControllerSecGrp: prodVpcStack.overlayControllerSecGrp,
  realtimeApiSecGrp: prodVpcStack.realtimeApiSecGrp,
});

// 레디스 캐시 스택
new LCRedisStack(app, 'LC-PROD-REDIS', {
  vpc: prodVpcStack.vpc,
  redisSecGrp: prodVpcStack.redisSecGrp,
});

// ************************************
// * 도메인
new LCDomainStack(app, 'LC-DOMAIN', {
  devALB: devAppStack.alb,
  prodALB: prodAppStack.alb,
});
