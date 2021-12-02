import { MypageLayout, broadcasterCenterMypageNavLinks } from '@project-lc/components';

export function SettlementIndex(): JSX.Element {
  return (
    <MypageLayout siteType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      마이페이지 - 정산
    </MypageLayout>
  );
}

export default SettlementIndex;
