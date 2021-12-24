import * as joi from 'joi';

interface ProjectLcCdkEnv {
  // 임시
  [key: string]: string;
}

const envSchema = joi
  .object<ProjectLcCdkEnv>({
    WHILETRUE_IP_ADDRESS: joi.string().required(),
  })
  .unknown();

export const envCheck = (): any => {
  const { value, error } = envSchema.validate(process.env);
  if (error) {
    console.log(error.details);
    throw new Error('ENV Validation Failed - Check environment variables.');
  }
  return value;
};
