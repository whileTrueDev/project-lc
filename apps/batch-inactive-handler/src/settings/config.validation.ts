import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  // Redis as Message Queue host url
  MQ_REDIS_URL: Joi.string().required(),
});
