export const constants = {
  DEV: {
    /**
     * 개발환경의 ECS 클러스터명
     */
    ECS_CLUSTER: 'project-lc-dev',
    /**
     * API 서버 ECS 서비스명
     */
    ECS_API_SERVICE_NAME: 'project-lc-api-dev-service',
    /**
     * API 서버 ECS 컨테이너 패밀리명 (작업정의명)
     */
    ECS_API_FAMILY_NAME: 'project-lc-api-dev',
    /**
     * API 서버 데이터베이스 SSM Parameter 키
     */
    ECS_DATABASE_URL_KEY: 'LC_DEV_DB_URL',
    /**
     * 퍼스트몰 데이터베이스 SSM Parameter 키
     */
    FIRSTMALL_DATABASE_URL_KEY: 'LC_FIRSTMALL_DB_URL',
    /**
     * API 서버 cloudwatch log group 명
     */
    ECS_API_LOG_GLOUP_NAME: '/ecs/project-lc-api-dev',
    /**
     * API 서버 PORT
     */
    ECS_API_PORT: 3000,
    /**
     * Socket 서버 서비스명
     */
    ECS_SOCKET_SERVICE_NAME: 'project-lc-socket-dev-service',
    /**
     * Socket 서버 컨테이너 패밀리명 (작업정의명)
     */
    ECS_SOCKET_FAMILY_NAME: 'project-lc-socket-dev',
    /**
     * API 서버 cloudwatch log group 명
     */
    ECS_SOCKET_LOG_GLOUP_NAME: '/ecs/project-lc-socket-dev',
    /**
     * Socket 서버 PORT
     */
    ECS_SOCKET_PORT: 3002,
    /**
     * VPC Subnet 인그레스 서브넷 그룹 명
     */
    INGRESS_SUBNET_GROUP_NAME: 'Ingress Subnet',
    /**
     * VPC Subnet 프라이빗 서브넷 그룹 명
     */
    PRIVATE_SUBNET_GROUP_NAME: 'Private Subnet',
    /**
     * VPC Subnet ISOLATED 서브넷 그룹 명
     */
    ISOLATED_SUBNET_GROUP_NAME: 'Isolated Subnet for DB',
  },
} as const;
