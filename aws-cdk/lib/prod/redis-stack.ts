import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import { constants } from '../../constants';

interface LCRedisStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  redisSecGrp: ec2.SecurityGroup;
}

export class LCRedisStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LCRedisStackProps) {
    super(scope, id, props);

    const { vpc, redisSecGrp } = props;

    const redisSubnets: string[] = [];
    vpc.isolatedSubnets.forEach((v) => redisSubnets.push(v.subnetId));

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(
      this,
      `${constants.PROD.ID_PREFIX}ElastiCacheSubnetGroup`,
      {
        description: 'Elasticache Subnet Group',
        subnetIds: redisSubnets,
        cacheSubnetGroupName: 'KksProdRedisSubnetGroup',
      },
    );

    // * Redis cluster used as caching and realtime websocket-adapter instance
    new elasticache.CfnReplicationGroup(
      this,
      `${constants.PROD.ID_PREFIX}ElastiCacheClusterGroup`,
      {
        engine: 'redis',
        replicationGroupId: 'KksProdRedis',
        replicationGroupDescription: 'kkshow prod env cache cluster',
        securityGroupIds: [redisSecGrp.securityGroupId],
        cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
        engineVersion: '6.2',
        cacheNodeType: 'cache.t4g.micro',
        numNodeGroups: 3,
      },
    );

    // * Redis cluster used as Message Queue in Microservices architecture
    new elasticache.CfnCacheCluster(this, `${constants.DEV.ID_PREFIX}RedisMQCluster`, {
      engine: 'redis',
      numCacheNodes: 1,
      engineVersion: '6.2',
      cacheNodeType: 'cache.t4g.micro',
      clusterName: 'KksProdRedisMQ',
      vpcSecurityGroupIds: [redisSecGrp.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
    });
  }
}
