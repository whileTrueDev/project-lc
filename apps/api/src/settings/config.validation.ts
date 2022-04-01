import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  FIRSTMALL_DATABASE_URL: Joi.string().required(),

  // 구글 어플리케이션
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  // 네이버 어플리케이션
  NAVER_CLIENT_ID: Joi.string().required(),
  NAVER_CLIENT_SECRET: Joi.string().required(),

  // 카카오 어플리케이션
  KAKAO_CLIENT_ID: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // 암호화 관련
  CIPHER_HASH: Joi.string().required(),
  CIPHER_PASSWORD: Joi.string().required(),
  CIPHER_SALT: Joi.string().required(),

  // S3
  S3_BUCKET_NAME: Joi.string().required(),

  // 호스트명
  API_HOST: Joi.string(),
  // 판매자 센터 호스트명
  SELLER_WEB_HOST: Joi.string().required(),
  // 방송인 센터 호스트명
  BROADCASTER_WEB_HOST: Joi.string().required(),
  // 크크쇼 호스트명
  KKSHOW_WEB_HOST: Joi.string().required(),

  // 와트 IP
  WHILETRUE_IP_ADDRESS: Joi.string(),

  // Redis as Message Queue host url
  MQ_REDIS_URL: Joi.string().required(),
});
