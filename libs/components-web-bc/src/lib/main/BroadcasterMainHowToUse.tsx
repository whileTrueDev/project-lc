import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import {
  MainHowToUse,
  MainHowToUseItem,
} from '@project-lc/components-shared/MainHowToUse';
import { useState } from 'react';
import { howToUseItems } from './broadcasterMainConstants';

export function BroadcasterMainHowToUse(): JSX.Element {
  const [selected, setSelected] = useState<number>(0);
  function handleItemSelect(idx: number): void {
    setSelected(idx);
  }

  return (
    <MainSectionLayout
      _title="크크쇼 이용 방법"
      subtitle={'간단한 URL 등록 하나로\n판매와 홍보 이미지를 송출할 수 있습니다.'}
      whiteIndicator
      py={12}
      bgGradient="linear(to-b, blue.400, blue.500)"
      color="white"
    >
      <MainHowToUse
        imageKey={howToUseItems[selected].image}
        imageSrc={howToUseItems[selected].image}
      >
        {howToUseItems.map((item, idx) => (
          <MainHowToUseItem
            title={item.title}
            contents={item.contents}
            isSelected={selected === idx}
            key={item.title}
            onClick={() => handleItemSelect(idx)}
            indicatorBoxProps={{
              boxShadow:
                selected === idx ? '0 0 0 0.2rem rgb(255, 255, 255, 0.5)' : undefined,
            }}
            textContainerBoxProps={{
              bgColor: selected === idx ? 'white' : 'unset',
              color: selected === idx ? 'WindowText' : 'unset',
            }}
          />
        ))}
      </MainHowToUse>
    </MainSectionLayout>
  );
}

export default BroadcasterMainHowToUse;
