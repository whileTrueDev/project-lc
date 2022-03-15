import {
  IStringParameter,
  SecureStringParameterAttributes,
  StringParameter,
} from '@aws-cdk/aws-ssm';
import { Construct } from '@aws-cdk/core';

export const loadSsmParam = (
  scope: Construct,
  id: string,
  parameterOpts: SecureStringParameterAttributes,
): IStringParameter => {
  return StringParameter.fromSecureStringParameterAttributes(scope, id, parameterOpts);
};
