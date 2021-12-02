import { broadcasterCenterMypageNavLinks, MypageLayout } from '@project-lc/components';

export function PurchaseIndex(): JSX.Element {
  return (
    <MypageLayout siteType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      마이페이지 - 구입현황
    </MypageLayout>
  );
}

export default PurchaseIndex;
