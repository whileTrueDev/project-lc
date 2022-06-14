import { Box } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';

import { Benefits } from '@project-lc/components-web-kkshow/mypage/benefits/Benefits';

export function BenefitsIndex(): JSX.Element {
  return (
    <CustomerMypageLayout>
      <Box p={[2, 2, 4]}>
        <Benefits />
      </Box>
    </CustomerMypageLayout>
  );
}

export default BenefitsIndex;
