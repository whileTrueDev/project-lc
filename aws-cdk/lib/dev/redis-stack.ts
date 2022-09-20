import {
  aws_ec2 as ec2,
  aws_elasticache as elasticache,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { constants } from '../../constants';

interface LCDevRedisStackProps extends StackProps {
  vpc: ec2.Vpc;
  redisSecGrp: ec2.SecurityGroup;
}

export class LCDevRedisStack extends Stack {
  constructor(scope: Construct, id: string, props: LCDevRedisStackProps) {
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

    // * Redis cluster used as caching and realtime websocket-adapter instance
    new elasticache.CfnReplicationGroup(
      this,
      `${constants.DEV.ID_PREFIX}ElastiCacheClusterGroup`,
      {
        engine: 'redis',
        replicationGroupId: 'KksDevRedis',
        replicationGroupDescription: 'kkshow test env cache cluster',
        securityGroupIds: [redisSecGrp.securityGroupId],
        cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
        engineVersion: '6.2',
        cacheNodeType: 'cache.t4g.micro',
        numNodeGroups: 2,
      },
    );

    // * Redis cluster used as Message Queue in Microservices architecture
    new elasticache.CfnCacheCluster(this, `${constants.DEV.ID_PREFIX}RedisMQCluster`, {
      engine: 'redis',
      numCacheNodes: 1,
      engineVersion: '6.2',
      cacheNodeType: 'cache.t4g.micro',
      clusterName: 'KksDevRedisMQ',
      vpcSecurityGroupIds: [redisSecGrp.securityGroupId],
      cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName,
    });
  }
}
