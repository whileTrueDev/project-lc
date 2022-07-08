import { Box } from '@chakra-ui/react';
import { broadcasterCenterMypageNavLinks } from '@project-lc/components-constants/navigation';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { BroadcasterPurchaseList } from '@project-lc/components-web-bc/BroadcasterPurchaseList';

export function PurchaseIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Box p={[2, 2, 4]}>
        <BroadcasterPurchaseList />
      </Box>
    </MypageLayout>
  );
}

export default PurchaseIndex;
