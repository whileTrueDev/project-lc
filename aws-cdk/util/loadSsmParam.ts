import { aws_ssm as ssm } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const loadSsmParam = (
  scope: Construct,
  id: string,
  parameterOpts: ssm.SecureStringParameterAttributes,
): ssm.IStringParameter => {
  return ssm.StringParameter.fromSecureStringParameterAttributes(
    scope,
    id,
    parameterOpts,
  );
};
