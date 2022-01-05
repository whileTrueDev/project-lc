import { Box, Flex } from '@chakra-ui/react';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { ResetPasswordForm } from '@project-lc/components-shared/ResetPasswordForm';

export function Resetpassword(): JSX.Element {
  return (
    <Box>
      <SellerNavbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <ResetPasswordForm />
      </Flex>
    </Box>
  );
}

export default Resetpassword;
