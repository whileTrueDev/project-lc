import { Box, Flex } from '@chakra-ui/react';
import { ResetPasswordForm } from '@project-lc/components-shared/ResetPasswordForm';
import KkshowNavbar from '@project-lc/components-web-kkshow/KkshowNavbar';

export function Resetpassword(): JSX.Element {
  return (
    <Box>
      <KkshowNavbar variant="white" />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <ResetPasswordForm />
      </Flex>
    </Box>
  );
}

export default Resetpassword;
