import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  FIRSTMALL_DATABASE_URL: Joi.string().required(),

  // Google TTS
  GOOGLE_CREDENTIALS_PRIVATE_KEY: Joi.string().required(),
  GOOGLE_CREDENTIALS_EMAIL: Joi.string().required(),
});
