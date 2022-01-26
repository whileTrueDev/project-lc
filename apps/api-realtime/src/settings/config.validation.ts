import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // JWT
  JWT_SECRET: Joi.string().required(),

  // 암호화 관련
  CIPHER_HASH: Joi.string().required(),
  CIPHER_PASSWORD: Joi.string().required(),
  CIPHER_SALT: Joi.string().required(),

  // 레디스 어댑터 URL
  REDIS_URL: Joi.string().required(),
});
