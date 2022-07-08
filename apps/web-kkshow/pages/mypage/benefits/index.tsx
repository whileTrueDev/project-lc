import { Box, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';

import { Benefits } from '@project-lc/components-web-kkshow/mypage/benefits/Benefits';

export function BenefitsIndex(): JSX.Element {
  const title = '혜택관리';
  return (
    <CustomerMypageLayout title={title}>
      <Box p={[2, 2, 4]}>
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        <Benefits />
      </Box>
    </CustomerMypageLayout>
  );
}

export default BenefitsIndex;
