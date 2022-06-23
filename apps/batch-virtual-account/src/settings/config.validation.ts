import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  REDIS_BULL_QUEUE_URL: Joi.string().required(),
});
