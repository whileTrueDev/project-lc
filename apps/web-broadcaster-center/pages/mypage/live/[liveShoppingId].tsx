import { useRouter } from 'next/router';
import LiveShoppingCurrentStateBoard from '@project-lc/components-web-bc/LiveShoppingCurrentStateBoard';
import { useBroadcasterLiveShoppingList, useProfile } from '@project-lc/hooks';
import { useMemo } from 'react';
import { getLiveShoppingProgress } from '@project-lc/shared-types';

export function LiveShoppingCurrentState(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = Number(router.query.liveShoppingId);

  const { data: profileData } = useProfile();
  const { data: liveShoppingList } = useBroadcasterLiveShoppingList({
    broadcasterId: profileData?.id,
  });

  const { title, isOnAir } = useMemo(() => {
    if (!liveShoppingList) return { title: '', isOnAir: false };
    const currentLiveShopping = liveShoppingList.find(
      (shopping) => shopping.id === liveShoppingId,
    );
    if (!currentLiveShopping) return { title: '', isOnAir: false };
    const liveShoppingTitle = currentLiveShopping.liveShoppingName || '';
    const _progress = getLiveShoppingProgress({
      progress: currentLiveShopping.progress,
      broadcastStartDate: currentLiveShopping.broadcastStartDate,
      broadcastEndDate: currentLiveShopping.broadcastEndDate,
      sellEndDate: currentLiveShopping.sellEndDate,
    });
    return {
      title: liveShoppingTitle,
      isOnAir: _progress === '방송진행중',
      progress: _progress,
    };
  }, [liveShoppingId, liveShoppingList]);

  return (
    <LiveShoppingCurrentStateBoard
      liveShoppingId={liveShoppingId}
      title={title}
      isOnAir={isOnAir}
    />
  );
}

export default LiveShoppingCurrentState;
