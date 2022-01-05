import { Box, Flex } from '@chakra-ui/react';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { SignupForm } from '@project-lc/components-shared/SignupForm';
import { SignupStart } from '@project-lc/components-shared/SignupStart';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';
import { useState } from 'react';

export function Signup(): JSX.Element {
  const [step, setStep] = useState(0);
  useMoveToMainIfLoggedIn();

  return (
    <Box>
      <SellerNavbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        {step === 0 && <SignupStart moveToSignupForm={() => setStep(1)} />}
        {step === 1 && <SignupForm enableShadow moveToSignupStart={() => setStep(0)} />}
      </Flex>
    </Box>
  );
}

export default Signup;
