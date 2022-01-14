import {
  howToUseSectionBody,
  SectionData,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import SellerMainSectionContainer from '@project-lc/components-layout/SellerMainSectionContainer';
import {
  MainHowToUse,
  MainHowToUseItem,
} from '@project-lc/components-shared/MainHowToUse';
import { useState } from 'react';

/** 판매자 메인페이지 - 크크쇼 이용방법 섹션 */
export function SellerMainHowToUseSection(): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<SectionData>(howToUseSectionBody[0]);
  return (
    <SellerMainSectionContainer sectionData={sellerMainSectionText.howToUse} hasGrayBg>
      <MainHowToUse
        imageKey={selectedItem.title || 'nothingSelected'}
        imageSrc={selectedItem.img || 'nothingSelected'}
      >
        {howToUseSectionBody.map((item) => (
          <MainHowToUseItem
            key={item.title}
            title={item.title || ''}
            contents={item.desc || ''}
            isSelected={item === selectedItem}
            onClick={() => setSelectedItem(item)}
            indicatorBoxProps={{
              boxShadow:
                item === selectedItem ? '0 0 0 0.2rem rgb(80, 120, 255, 0.5)' : undefined,
            }}
            textContainerBoxProps={{
              flex: 1,
              bgColor: item === selectedItem ? 'blue.500' : 'unset',
              color: item === selectedItem ? 'white' : 'unset',
            }}
          />
        ))}
      </MainHowToUse>
    </SellerMainSectionContainer>
  );
}

export default SellerMainHowToUseSection;
