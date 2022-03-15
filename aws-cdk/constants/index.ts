import * as dotenv from 'dotenv';
import { envCheck } from '../util/env-check';

dotenv.config();
envCheck();

export const constants = {
  DOMAIN: '크크쇼.com',
  PUNYCODE_DOMAIN: 'xn--hp4b17xa.com',
  PUNYCODE_라이브: 'xn--oi2bm8jnwi',
  PUNYCODE_판매자: 'xn--9z2b23wk2i',
  PUNYCODE_방송인: 'xn--vh3b23hfsf',
  WHILETRUE_IP_ADDRESS: process.env.WHILETRUE_IP_ADDRESS!,
  DEV: {
    /** Dev 환경용 프라이빗 도메인 */
    PRIVATE_DOMAIN: 'kkshow-dev-dns.com',
    ID_PREFIX: 'LC-DEV-',
    /** 개발환경의 ECS 클러스터명 */
    ECS_CLUSTER: 'project-lc-dev',
    /** API 서버 ECS 서비스명 */
    ECS_API_SERVICE_NAME: 'project-lc-api-dev-service',
    /** API 서버 ECS 컨테이너 패밀리명 (작업정의명) */
    ECS_API_FAMILY_NAME: 'project-lc-api-dev',
    /** API 서버 데이터베이스 SSM Parameter 키 */
    ECS_DATABASE_URL_KEY: 'LC_DEV_DB_URL',
    /** 퍼스트몰 데이터베이스 SSM Parameter 키 */
    FIRSTMALL_DATABASE_URL_KEY: 'LC_FIRSTMALL_DB_URL',
    /** API 서버 cloudwatch log group 명 */
    ECS_API_LOG_GLOUP_NAME: '/ecs/project-lc-api-dev',
    /** API 서버 PORT */
    ECS_API_PORT: 3000,
    /** Overlay 서버 서비스명 */
    ECS_OVERLAY_SERVICE_NAME: 'project-lc-overlay-dev-service',
    /** Overlay 서버 컨테이너 패밀리명 (작업정의명) */
    ECS_OVERLAY_FAMILY_NAME: 'project-lc-overlay-dev',
    /** API 서버 cloudwatch log group 명 */
    ECS_OVERLAY_LOG_GLOUP_NAME: '/ecs/project-lc-overlay-dev',
    /** Overlay 서버 PORT */
    ECS_OVERLAY_PORT: 3002,
    /** Overlay 서버 서비스명 */
    ECS_OVERLAY_CONTROLLER_SERVICE_NAME: 'project-lc-overlay-controller-dev-service',
    /** Overlay 서버 컨테이너 패밀리명 (작업정의명) */
    ECS_OVERLAY_CONTROLLER_FAMILY_NAME: 'project-lc-overlay-controller-dev',
    /** API 서버 cloudwatch log group 명 */
    ECS_OVERLAY_CONTROLLER_LOG_GLOUP_NAME: '/ecs/project-lc-overlay-controller-dev',
    /** Overlay 서버 PORT */
    ECS_OVERLAY_CONTROLLER_PORT: 3333,
    /** 구글 TTS(Text To Speech) API 계정 */
    GOOGLE_CREDENTIALS_EMAIL_KEY: 'LIVECOMMERCE_GCP_TTS_EMAIL',
    /** 구글 TTS(Text To Speech) API private key */
    GOOGLE_CREDENTIALS_PRIVATE_KEY_KEY: 'LIVECOMMERCE_GCP_TTS_PRIVATE_KEY',
    /** VPC Subnet 인그레스 서브넷 그룹 명 */
    INGRESS_SUBNET_GROUP_NAME: 'Ingress Subnet',
    /** VPC Subnet 프라이빗 서브넷 그룹 명 */
    PRIVATE_SUBNET_GROUP_NAME: 'Private Subnet',
    /** VPC Subnet ISOLATED 서브넷 그룹 명 */
    ISOLATED_SUBNET_GROUP_NAME: 'Isolated Subnet for DB',
    // * ECS REALTIME API
    ECS_REALTIME_API_SERVICE_NAME: 'project-lc-realtimeapi-dev-service',
    ECS_REALTIME_API_FAMILY_NAME: 'project-lc-realtimeapi-dev',
    ECS_REALTIME_API_LOG_GROUP_NAME: '/ecs/project-lc-realtimeapi-dev',
    ECS_REALTIME_API_PORT: 3001,
    // * ECS Mailer
    ECS_MAILER_SERVICE_NAME: 'project-lc-mailer-dev-service',
    ECS_MAILER_FAMILY_NAME: 'project-lc-mailer-dev',
    ECS_MAILER_LOG_GROUP_NAME: '/ecs/project-lc-mailer-dev',
    ECS_MAILER_PORT: 3003,
    // * ECS Inactive Batch
    ECS_INACTIVE_BATCH_FAMILY_NAME: 'project-lc-inactive-batch-dev',
    ECS_INACTIVE_BATCH_LOG_GROUP_NAME: '/ecs/project-lc-inactive-batch-dev',
    // * ************************
    // * SSM Parameter Store Keys
    // * ************************
    GOOGLE_CLIENT_ID: 'PROJECT_LC_GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET: 'PROJECT_LC_GOOGLE_CLIENT_SECRET',
    NAVER_CLIENT_ID: 'PROJECT_LC_NAVER_CLIENT_ID',
    NAVER_CLIENT_SECRET: 'PROJECT_LC_NAVER_CLIENT_SECRET',
    KAKAO_CLIENT_ID: 'PROJECT_LC_KAKAO_CLIENT_ID',
    MAILER_USER: 'PROJECT_LC_MAILER_USER',
    MAILER_PASS: 'PROJECT_LC_MAILER_PASS',
    JWT_SECRET: 'PROJECT_LC_JWT_SECRET',
    CIPHER_HASH: 'PROJECT_LC_CIPHER_HASH',
    CIPHER_PASSWORD: 'PROJECT_LC_CIPHER_PASSWORD',
    CIPHER_SALT: 'PROJECT_LC_CIPHER_SALT',
    S3_ACCESS_KEY_ID: 'S3_ACCESS_KEY_ID',
    S3_ACCESS_KEY_SECRET: 'S3_ACCESS_KEY_SECRET',
    GMAIL_OAUTH_REFRESH_TOKEN: 'PROJECT_LC_GMAIL_OAUTH_REFRESH_TOKEN',
    GMAIL_OAUTH_CLIENT_ID: 'PROJECT_LC_GMAIL_OAUTH_CLIENT_ID',
    GMAIL_OAUTH_CLIENT_SECRET: 'PROJECT_LC_GMAIL_OAUTH_CLIENT_SECRET',
    WHILETRUE_IP_ADDRESS: 'WHILETRUE_IP_ADDRESS',
    REDIS_URL: 'PROJECT_LC_DEV_REDIS_URL',
    CACHE_REDIS_URL: 'PROJECT_LC_DEV_CACHE_REDIS_URL',
  },
  PROD: {
    /** Production 환경용 프라이빗 도메인 */
    PRIVATE_DOMAIN: 'kkshow-dns.com',
    ID_PREFIX: 'LC-PROD-',
    INGRESS_SUBNET_GROUP_NAME: 'PROD Ingress Subnet',
    PRIVATE_SUBNET_GROUP_NAME: 'PROD Private Subnet for Apps',
    ISOLATED_SUBNET_GROUP_NAME: 'PROD Isolated Subnet for DB',
    // * ************************
    // * ECS
    // * ************************
    ECS_CLUSTER_NAME: 'project-lc-prod',
    ECS_API_FAMILY_NAME: 'project-lc-api',
    ECS_API_SERVICE_NAME: 'project-lc-api-service',
    ECS_API_LOG_GLOUP_NAME: '/ecs/project-lc-api',
    ECS_API_PORT: 3000,
    ECS_OVERLAY_FAMILY_NAME: 'project-lc-overlay',
    ECS_OVERLAY_SERVICE_NAME: 'project-lc-overlay-service',
    ECS_OVERLAY_LOG_GLOUP_NAME: '/ecs/project-lc-overlay',
    ECS_OVERLAY_PORT: 3002,
    ECS_OVERLAY_CONTROLLER_FAMILY_NAME: 'project-lc-overlay-controller',
    ECS_OVERLAY_CONTROLLER_SERVICE_NAME: 'project-lc-overlay-controller-service',
    ECS_OVERLAY_CONTROLLER_LOG_GLOUP_NAME: '/ecs/project-lc-overlay-controller',
    ECS_OVERLAY_CONTROLLER_PORT: 3333,
    ECS_REALTIME_API_FAMILY_NAME: 'project-lc-realtimeapi',
    ECS_REALTIME_API_SERVICE_NAME: 'project-lc-realtimeapi-service',
    ECS_REALTIME_API_LOG_GLOUP_NAME: '/ecs/project-lc-realtimeapi',
    ECS_REALTIME_API_PORT: 3001,
    // * ECS Mailer
    ECS_MAILER_SERVICE_NAME: 'project-lc-mailer-service',
    ECS_MAILER_FAMILY_NAME: 'project-lc-mailer',
    ECS_MAILER_LOG_GROUP_NAME: '/ecs/project-lc-mailer',
    ECS_MAILER_PORT: 3003,
    // * ECS Inactive Batch
    ECS_INACTIVE_BATCH_FAMILY_NAME: 'project-lc-inactive-batch',
    ECS_INACTIVE_BATCH_LOG_GROUP_NAME: '/ecs/project-lc-inactive-batch',
    // * ************************
    // * SSM Parameter Store Keys
    // * ************************
    DATABASE_URL_KEY: 'PROJECT_LC_DB_URL',
    FIRSTMALL_DATABASE_URL_KEY: 'LC_FIRSTMALL_DB_URL',
    GOOGLE_CREDENTIALS_EMAIL_KEY: 'LIVECOMMERCE_GCP_TTS_EMAIL',
    GOOGLE_CREDENTIALS_PRIVATE_KEY_KEY: 'LIVECOMMERCE_GCP_TTS_PRIVATE_KEY',
    GOOGLE_CLIENT_ID_KEY: 'PROJECT_LC_GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET_KEY: 'PROJECT_LC_GOOGLE_CLIENT_SECRET',
    NAVER_CLIENT_ID_KEY: 'PROJECT_LC_NAVER_CLIENT_ID',
    NAVER_CLIENT_SECRET_KEY: 'PROJECT_LC_NAVER_CLIENT_SECRET',
    KAKAO_CLIENT_ID_KEY: 'PROJECT_LC_KAKAO_CLIENT_ID',
    MAILER_USER_KEY: 'PROJECT_LC_MAILER_USER',
    MAILER_PASS_KEY: 'PROJECT_LC_MAILER_PASS',
    GMAIL_OAUTH_REFRESH_TOKEN: 'PROJECT_LC_GMAIL_OAUTH_REFRESH_TOKEN',
    GMAIL_OAUTH_CLIENT_ID: 'PROJECT_LC_GMAIL_OAUTH_CLIENT_ID',
    GMAIL_OAUTH_CLIENT_SECRET: 'PROJECT_LC_GMAIL_OAUTH_CLIENT_SECRET',
    JWT_SECRET_KEY: 'PROJECT_LC_JWT_SECRET',
    CIPHER_HASH_KEY: 'PROJECT_LC_CIPHER_HASH',
    CIPHER_PASSWORD_KEY: 'PROJECT_LC_CIPHER_PASSWORD',
    CIPHER_SALT_KEY: 'PROJECT_LC_CIPHER_SALT',
    S3_ACCESS_KEY_ID_KEY: 'S3_ACCESS_KEY_ID',
    S3_ACCESS_KEY_SECRET_KEY: 'S3_ACCESS_KEY_SECRET',
    WHILETRUE_IP_ADDRESS: 'WHILETRUE_IP_ADDRESS',
    REDIS_URL_KEY: 'PROJECT_LC_REDIS_URL',
    CACHE_REDIS_URL_KEY: 'PROJECT_LC_CACHE_REDIS_URL',
  },
} as const;
