import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import { MainProcessItemList } from '@project-lc/components-shared/MainProcessItemList';
import { processItems } from './broadcasterMainConstants';

export function BroadcasterMainProcess(): JSX.Element {
  return (
    <MainSectionLayout
      subtitle={'라이브 쇼핑의 처음부터 끝까지\n전문 매니저가 1:1로 전담하여 진행합니다.'}
      _title={'편하게 방송만 할 수 있도록\n크크쇼에서 모두 해결하겠습니다.'}
      py={12}
    >
      <MainProcessItemList processItems={processItems} />
    </MainSectionLayout>
  );
}

export default BroadcasterMainProcess;
