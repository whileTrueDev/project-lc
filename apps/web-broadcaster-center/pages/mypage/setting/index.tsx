import { broadcasterCenterMypageNavLinks, MypageLayout } from '@project-lc/components';

export function SettingIndex(): JSX.Element {
  return (
    <MypageLayout siteType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      마이페이지 - 계정설정
    </MypageLayout>
  );
}

export default SettingIndex;
