#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import { LCDevAppStack } from '../lib/dev/app-stack';
import { LCDevDatabaseStack } from '../lib/dev/database-stack';
import { LCDevLambdaStack } from '../lib/dev/lambda-stack';
import { LCDevPrivateAppStack } from '../lib/dev/private-app-stack';
import { LCDevRedisStack } from '../lib/dev/redis-stack';
import { LCDevVpcStack } from '../lib/dev/vpc-stack';
import { LCDomainStack } from '../lib/env-agnostic/domain-stack';
import { LCProdAppStack } from '../lib/prod/app-stack';
import { LCBatchAppStack } from '../lib/prod/batch-app-stack';
import { LCProdDatabaseStack } from '../lib/prod/database-stack';
import { LCProdPrivateAppStack } from '../lib/prod/private-app-stack';
import { LCRedisStack } from '../lib/prod/redis-stack';
import { LCProdVpcStack } from '../lib/prod/vpc-stack';
import { envCheck } from '../util/env-check';

dotenv.config();
envCheck();

const app = new App();

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
// Dev 프라이빗 앱 (메일러, ...)
new LCDevPrivateAppStack(app, 'LC-DEV-PRIVATE-APP', {
  vpc: devVpcStack.vpc,
  cluster: devAppStack.cluster,
  mailerSecGrp: devVpcStack.mailerSecGrp,
  inactiveBatchSecGrp: devVpcStack.inactiveBatchSecGrp,
});

// Serverless lambda functions
new LCDevLambdaStack(app, 'LC-DEV-LAMBDA', {});

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

// 프라이빗 앱 (mailer)
new LCProdPrivateAppStack(app, 'LC-PROD-PRIVATE-APP', {
  cluster: prodAppStack.cluster,
  mailerSecGrp: prodVpcStack.mailerSecGrp,
});

// Prod 배치 앱 (휴면배치, ...)
new LCBatchAppStack(app, 'LC-PROD-BATCH-APP', {
  vpc: prodVpcStack.vpc,
  cluster: prodAppStack.cluster,
  inactiveBatchSecGrp: prodVpcStack.inactiveBatchSecGrp,
  virtualAccountBatchSecGrp: prodVpcStack.virtualAccountBatchSecGrp,
});

// ************************************
// * 퍼블릭 도메인
new LCDomainStack(app, 'LC-DOMAIN', {
  devALB: devAppStack.alb,
  prodALB: prodAppStack.alb,
});
