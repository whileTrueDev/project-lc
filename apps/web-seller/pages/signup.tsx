import { Box } from '@chakra-ui/react';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { SignupProcess } from '@project-lc/components-shared/SignupProcess';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';

export function Signup(): JSX.Element {
  useMoveToMainIfLoggedIn();

  return (
    <Box>
      <SellerNavbar />
      <SignupProcess appType="seller" />
    </Box>
  );
}

export default Signup;
