import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  FIRSTMALL_DATABASE_URL: Joi.string().required(),

  // Overlay server host
  OVERLAY_HOST_NAME: Joi.string().required(),
});
