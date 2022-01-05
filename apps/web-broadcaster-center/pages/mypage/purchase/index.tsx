import { broadcasterCenterMypageNavLinks } from '@project-lc/components-constants/navigation';
import { BroadcasterPurchaseList } from '@project-lc/components-web-bc/BroadcasterPurchaseList';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';

export function PurchaseIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <BroadcasterPurchaseList />
    </MypageLayout>
  );
}

export default PurchaseIndex;
