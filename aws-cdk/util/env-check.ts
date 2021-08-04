import * as joi from 'joi';

interface ProjectLcCdkEnv {
  // 임시
  [key: string]: string;
}

const envSchema = joi.object<ProjectLcCdkEnv>({}).unknown();

export const envCheck = () => {
  const { value, error } = envSchema.validate(process.env);
  if (error) throw new Error('Check environment variables. - from joi validation');
  return value;
};
