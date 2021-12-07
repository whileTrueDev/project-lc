import { Box, Flex } from '@chakra-ui/react';
import { SellerNavbar, ResetPasswordForm } from '@project-lc/components';

export function Resetpassword(): JSX.Element {
  return (
    <Box>
      <SellerNavbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <ResetPasswordForm userType="seller" />
      </Flex>
    </Box>
  );
}

export default Resetpassword;
