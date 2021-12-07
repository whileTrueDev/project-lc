import {
  broadcasterCenterMypageNavLinks,
  MypageLayout,
  BroadcasterLiveShoppingList,
} from '@project-lc/components';

export function LiveShoppingIndex(): JSX.Element {
  return (
    <MypageLayout siteType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <BroadcasterLiveShoppingList />
    </MypageLayout>
  );
}

export default LiveShoppingIndex;
