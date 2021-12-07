import { MypageLayout, broadcasterCenterMypageNavLinks } from '@project-lc/components';

export function Index(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      마이페이지 홈
    </MypageLayout>
  );
}

export default Index;
