import * as Joi from 'joi';

export const validationSchema = Joi.object({
  S3_BUCKET_NAME: Joi.string().required(),
  MAILER_HOST: Joi.string().required(),
});
