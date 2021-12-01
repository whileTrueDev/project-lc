import { SignupForm, SignupStart, Navbar } from '@project-lc/components';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';
import { Box, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';

export function SignUp(): JSX.Element {
  const [step, setStep] = useState(0);
  useMoveToMainIfLoggedIn();
  return (
    <Box>
      <Navbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        {step === 0 && (
          <SignupStart userType="broadcaster" moveToSignupForm={() => setStep(1)} />
        )}
        {step === 1 && (
          <SignupForm
            userType="broadcaster"
            enableShadow
            moveToSignupStart={() => setStep(0)}
          />
        )}
      </Flex>
    </Box>
  );
}
export default SignUp;
