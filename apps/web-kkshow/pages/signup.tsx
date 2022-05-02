import { Box } from '@chakra-ui/react';
import { SignupProcess } from '@project-lc/components-shared/SignupProcess';
import KkshowNavbar from '@project-lc/components-web-kkshow/KkshowNavbar';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';

export function Signup(): JSX.Element {
  useMoveToMainIfLoggedIn();

  return (
    <Box>
      <KkshowNavbar variant="white" />
      <SignupProcess appType="customer" />
    </Box>
  );
}

export default Signup;
