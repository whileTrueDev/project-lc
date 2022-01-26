import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import { constants } from '../../constants';

interface LCDevRedisStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  redisSecGrp: ec2.SecurityGroup;
}

export class LCDevRedisStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LCDevRedisStackProps) {
    super(scope, id, props);

    const { vpc, redisSecGrp } = props;

    const redisSubnets: string[] = [];
    vpc.isolatedSubnets.forEach((v) => redisSubnets.push(v.subnetId));
    vpc.privateSubnets.forEach((v) => redisSubnets.push(v.subnetId));

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(
      this,
      `${constants.DEV.ID_PREFIX}ElastiCacheSubnetGroup`,
      {
        description: 'Elasticache Subnet Group',
        subnetIds: redisSubnets,
        cacheSubnetGroupName: 'RedisSubnetGroup',
      },
    );

    const redis = new elasticache.CfnCacheCluster(
      this,
      `${constants.DEV.ID_PREFIX}ElastiCacheCluster`,
      {
        vpcSecurityGroupIds: [redisSecGrp.securityGroupId],
        clusterName: 'KksRedisCluster',
        cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
        engine: 'redis',
        engineVersion: '6.2',
        cacheNodeType: 'cache.t4g.micro',
        numCacheNodes: 1,
      },
    );
  }
}
