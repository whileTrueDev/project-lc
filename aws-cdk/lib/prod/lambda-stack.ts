import { Duration, Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { constants } from '../../constants';

export class LCProdLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, `${constants.PROD.ID_PREFIX}resizeImage`, {
      entry: 'lambda/resizeS3Image/index.ts',
      handler: 'handler',
      bundling: {
        nodeModules: ['sharp'],
      },
      environment: {
        S3_BUCKET_REGION: 'ap-northeast-2',
      },
      logRetention: RetentionDays.ONE_WEEK,
      timeout: Duration.seconds(15),
    });

    const bucket = Bucket.fromBucketName(
      this,
      `${constants.PROD.ID_PREFIX}S3Bucket`,
      'lc-project',
    );

    fn.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`${bucket.bucketArn}/*`],
        actions: ['s3:PutObject', 's3:PutObjectAcl', 's3:GetObject'],
      }),
    );

    // Nodejs-lambda
    bucket.addObjectCreatedNotification(new LambdaDestination(fn));
  }
}
