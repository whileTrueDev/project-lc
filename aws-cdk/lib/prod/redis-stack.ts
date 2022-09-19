import { StackProps, Stack } from 'aws-cdk-lib';
import { Vpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import {
  CfnReplicationGroup,
  CfnCacheCluster,
  CfnSubnetGroup,
} from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';
import { constants } from '../../constants';

interface LCRedisStackProps extends StackProps {
  vpc: Vpc;
  redisSecGrp: SecurityGroup;
}

export class LCRedisStack extends Stack {
  constructor(scope: Construct, id: string, props: LCRedisStackProps) {
    super(scope, id, props);

    const { vpc, redisSecGrp } = props;

    const redisSubnets: string[] = [];
    vpc.isolatedSubnets.forEach((v) => redisSubnets.push(v.subnetId));

    const redisSubnetGroup = new CfnSubnetGroup(
      this,
      `${constants.PROD.ID_PREFIX}ElastiCacheSubnetGroup`,
      {
        description: 'Elasticache Subnet Group',
        subnetIds: redisSubnets,
        cacheSubnetGroupName: 'KksProdRedisSubnetGroup',
      },
    );

    // * Redis cluster used as caching and realtime websocket-adapter instance
    new CfnReplicationGroup(this, `${constants.PROD.ID_PREFIX}ElastiCacheClusterGroup`, {
      engine: 'redis',
      replicationGroupId: 'KksProdRedis',
      replicationGroupDescription: 'kkshow prod env cache cluster',
      securityGroupIds: [redisSecGrp.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
      engineVersion: '6.2',
      cacheNodeType: 'cache.t4g.micro',
      numNodeGroups: 3,
    });

    // * Redis cluster used as Message Queue in Microservices architecture
    new CfnCacheCluster(this, `${constants.DEV.ID_PREFIX}RedisMQCluster`, {
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
