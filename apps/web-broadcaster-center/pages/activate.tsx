import { Box } from '@chakra-ui/react';
import { BroadcasterNavbar } from '@project-lc/components-shared/Navbar';
import { UserActivateForm } from '@project-lc/components-shared/UserActivateForm';
import React from 'react';

export function Activate(): JSX.Element {
  return (
    <Box>
      <BroadcasterNavbar />
      <UserActivateForm />
    </Box>
  );
}

export default Activate;
