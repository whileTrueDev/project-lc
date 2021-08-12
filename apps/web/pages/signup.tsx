import { SignupForm, Navbar, SignupModal, SignupStart } from '@project-lc/components';
import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';

export function Signup(): JSX.Element {
  const [step, setStep] = useState(0);
  return (
    <Box>
      <Navbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <Box display={step === 0 ? 'block' : 'none'}>
          <SignupStart moveToSignupForm={() => setStep(1)} />
        </Box>
        <Box display={step === 1 ? 'block' : 'none'}>
          <SignupForm enableShadow moveToSignupStart={() => setStep(0)} />
        </Box>
      </Flex>
    </Box>
  );
}

export default Signup;
