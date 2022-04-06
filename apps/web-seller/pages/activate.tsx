import { Box } from '@chakra-ui/react';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { UserActivateForm } from '@project-lc/components-shared/UserActivateForm';
import React from 'react';

export function Activate(): JSX.Element {
  return (
    <Box>
      <SellerNavbar />
      <UserActivateForm />
    </Box>
  );
}

export default Activate;
