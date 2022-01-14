import { Flex } from '@chakra-ui/react';
import { UserType } from '@project-lc/shared-types';
import { useState } from 'react';
import SignupAgreeTerms from './signup/SignupAgreeTerms';
import { SignupForm } from './signup/SignupForm';
import SignupStart from './signup/SignupStart';

export interface SignupProcessProps {
  appType: UserType;
}
export function SignupProcess({ appType }: SignupProcessProps): JSX.Element {
  const [step, setStep] = useState(0);
  return (
    <Flex align="center" justify="center" minH="calc(100vh - 200px)">
      {/* 크크쇼 시작하기 첫화면 */}
      {step === 0 && <SignupStart userType={appType} moveToNext={() => setStep(1)} />}
      {/* 이용동의 화면 */}
      {step === 1 && (
        <SignupAgreeTerms
          userType={appType}
          moveToNext={() => setStep(2)}
          moveToPrev={() => setStep(0)}
        />
      )}
      {/* 이메일, 비밀번호 입력 폼 */}
      {step === 2 && <SignupForm userType={appType} moveToPrev={() => setStep(1)} />}
    </Flex>
  );
}

export default SignupProcess;
