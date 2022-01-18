import { useRouter } from 'next/router';
import LiveShoppingCurrentStateBoard from '@project-lc/components-web-bc/LiveShoppingCurrentStateBoard';

export function LiveShoppingCurrentState(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = Number(router.query.liveShoppingId);
  const liveShoppingTitle = '토요일 토여니는 즐거워';
  return (
    <LiveShoppingCurrentStateBoard
      liveShoppingId={liveShoppingId}
      title={liveShoppingTitle}
    />
  );
}

export default LiveShoppingCurrentState;
