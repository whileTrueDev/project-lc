import { Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';

const PREFIX = 'LCDEV-Lambda';

export class LCDevLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, `${PREFIX}resizeImage2`, {
      entry: 'lambda/resizeS3Image/index.ts',
      handler: 'handler',
      bundling: {
        nodeModules: ['sharp'],
      },
      environment: {
        S3_BUCKET_REGION: 'ap-northeast-2',
      },
      logRetention: RetentionDays.ONE_WEEK,
    });

    const bucket = Bucket.fromBucketName(
      this,
      `${PREFIX}S3Bucket`,
      'project-lc-dev-test',
    );

    fn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`${bucket.bucketArn}/*`],
        actions: ['s3:PutObject', 's3:PutObjectAcl', 's3:GetObject'],
      }),
    );

    // Nodejs-lambda
    bucket.addObjectCreatedNotification(
      new LambdaDestination(fn),
      // ...filters
      { prefix: 'avatar/' },
      { prefix: 'goods-category/' },
      { prefix: 'kkshow-main-carousel-images/' },
      { prefix: 'kkshow-shopping-carousel-images' },
      { prefix: 'kkshow-shopping-banner-images' },
      { prefix: 'kkshow-shopping-carousel-images' },
      { prefix: 'kkshow-shopping-goods' },
      { prefix: 'kkshow-shopping-keywords-theme-images' },
      { prefix: 'manual' },
      { prefix: 'goods-review-images' },
      { prefix: 'goods' },
    );
  }
}
