import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MAILER_USER: Joi.string().required(),
  MAILER_PASS: Joi.string().required(),
});
