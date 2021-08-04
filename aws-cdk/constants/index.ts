export const constants = {
  DEV: {
    /**
     * 개발환경의 ECS 클러스터명
     */
    ECS_CLUSTER: 'project-lc-dev',
    ECS_API_SERVICE_NAME: 'project-lc-api-dev-service',
    ECS_API_FAMILY_NAME: 'project-lc-api-dev',
    ECS_API_DATABASE_URL_KEY: 'LC_DEV_DB_URL',
    ECS_API_LOG_GLOUP_NAME: '/ecs/project-lc-api-dev',
    INGRESS_SUBNET_GROUP_NAME: 'Ingress Subnet',
    ISOLATED_SUBNET_GROUP_NAME: 'Isolated Subnet for DB',
  },
} as const;
