import {
  broadcasterCenterMypageNavLinks,
  MypageLayout,
  BroadcasterPurchaseList,
} from '@project-lc/components';

export function PurchaseIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <BroadcasterPurchaseList />
    </MypageLayout>
  );
}

export default PurchaseIndex;
