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

  // Mailer account -> official.whiletrue@gmail.com
  MAILER_USER: Joi.string().required(),
  MAILER_PASS: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // 암호화 관련
  CIPHER_HASH: Joi.string().required(),
  CIPHER_PASSWORD: Joi.string().required(),
  CIPHER_SALT: Joi.string().required(),
});
