import {
  MypageLayout,
  broadcasterCenterMypageNavLinks,
  BcSettlementHistory,
} from '@project-lc/components';

export function SettlementIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <BcSettlementHistory />
    </MypageLayout>
  );
}

export default SettlementIndex;
