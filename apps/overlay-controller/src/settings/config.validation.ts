import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  FIRSTMALL_DATABASE_URL: Joi.string().required(),

  // 오버레이서버 호스트명
  OVERLAY_HOST: Joi.string().required(),
  // 오버레이컨트롤러 서버 호스트명
  OVERLAY_CONTROLLER_HOST: Joi.string().required(),
  // S3 버킷
  S3_BUCKET_NAME: Joi.string().required(),
});
