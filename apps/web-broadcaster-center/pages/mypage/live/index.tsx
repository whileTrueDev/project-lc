import { broadcasterCenterMypageNavLinks } from '@project-lc/components-constants/navigation';
import { BroadcasterLiveShoppingList } from '@project-lc/components-web-bc/BroadcasterLiveShoppingList';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';

export function LiveShoppingIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <BroadcasterLiveShoppingList />
    </MypageLayout>
  );
}

export default LiveShoppingIndex;
